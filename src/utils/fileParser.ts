import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { DocumentChunk, UploadedDocument } from '../types/handover';

// Configure PDF.js worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('PDF.js worker initialization notice:', e);
}

const MAX_CHAR_PER_FILE = 80000;

export async function parseUploadedFile(file: File): Promise<UploadedDocument> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // Check for HWP / HWPX explicitly
  if (extension === 'hwp' || extension === 'hwpx') {
    return {
      id: fileId,
      name: file.name,
      size: file.size,
      type: 'unsupported',
      status: 'error',
      charCount: 0,
      chunkCount: 0,
      errorMessage: 'HWP/HWPX 형식은 전용 보안 및 한글 전용 구조로 인해 브라우저 직접 텍스트 추출이 지원되지 않습니다. 한글(HWP) 프로그램에서 [다른 이름으로 저장]을 통해 PDF, DOCX 또는 TXT 형식으로 변환 후 등록해 주시기 바랍니다.',
      chunks: []
    };
  }

  // Check for other unsupported formats
  const supportedTypes = ['pdf', 'docx', 'xlsx', 'xls', 'csv', 'txt'];
  if (!supportedTypes.includes(extension)) {
    return {
      id: fileId,
      name: file.name,
      size: file.size,
      type: 'unsupported',
      status: 'error',
      charCount: 0,
      chunkCount: 0,
      errorMessage: `.${extension.toUpperCase()} 형식은 현재 지원되지 않습니다. 1차 지원 형식인 PDF, DOCX, XLSX, CSV, TXT 파일로 변환하여 등록해 주세요.`,
      chunks: []
    };
  }

  const mappedType: 'pdf' | 'docx' | 'xlsx' | 'csv' | 'txt' =
    extension === 'xls' ? 'xlsx' : (extension as any);

  try {
    let chunks: DocumentChunk[] = [];
    let warning: string | undefined;

    if (mappedType === 'txt') {
      const text = await file.text();
      chunks = parseTxt(file.name, text);
    } else if (mappedType === 'csv') {
      const buffer = await file.arrayBuffer();
      chunks = parseCsv(file.name, buffer);
    } else if (mappedType === 'xlsx') {
      const buffer = await file.arrayBuffer();
      chunks = parseXlsx(file.name, buffer);
    } else if (mappedType === 'docx') {
      const buffer = await file.arrayBuffer();
      chunks = await parseDocx(file.name, buffer);
    } else if (mappedType === 'pdf') {
      const buffer = await file.arrayBuffer();
      chunks = await parsePdf(file.name, buffer);
    }

    const totalChars = chunks.reduce((sum, c) => sum + c.text.length, 0);

    if (totalChars > MAX_CHAR_PER_FILE) {
      warning = `파일 분량이 약 ${totalChars.toLocaleString()}자로 대용량입니다. 주요 내용 앞부분 ${MAX_CHAR_PER_FILE.toLocaleString()}자만 AI 분석에 전달되며, 후반부 일부가 누락될 수 있으니 필요한 경우 분할 등록을 권장합니다.`;
    }

    if (chunks.length === 0) {
      return {
        id: fileId,
        name: file.name,
        size: file.size,
        type: mappedType,
        status: 'error',
        charCount: 0,
        chunkCount: 0,
        errorMessage: '파일에서 추출 가능한 텍스트가 없습니다. 스캔 이미지 전용 PDF이거나 빈 문서인지 확인해 주세요.',
        chunks: []
      };
    }

    return {
      id: fileId,
      name: file.name,
      size: file.size,
      type: mappedType,
      status: 'success',
      charCount: totalChars,
      chunkCount: chunks.length,
      warning,
      chunks
    };
  } catch (err: any) {
    console.error('File parse error for:', file.name, err);
    let errMsg = err.message || '파일을 분석하는 중 오류가 발생했습니다.';
    if (errMsg.includes('password') || errMsg.includes('encrypted')) {
      errMsg = '비밀번호로 암호화된 파일입니다. 문서 보안 암호를 해제한 후 등록해 주세요.';
    }
    return {
      id: fileId,
      name: file.name,
      size: file.size,
      type: mappedType,
      status: 'error',
      charCount: 0,
      chunkCount: 0,
      errorMessage: errMsg,
      chunks: []
    };
  }
}

function parseTxt(fileName: string, text: string): DocumentChunk[] {
  const lines = text.split(/\r?\n/);
  const chunks: DocumentChunk[] = [];
  let buffer: string[] = [];
  let startLine = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      if (buffer.length === 0) startLine = i + 1;
      buffer.push(line);
    }

    if ((line === '' && buffer.length > 0) || buffer.length >= 10 || i === lines.length - 1) {
      if (buffer.length > 0) {
        const endLine = i + 1;
        const loc = startLine === endLine ? `${startLine}줄` : `${startLine}~${endLine}줄`;
        chunks.push({
          sourceId: `txt-${fileName}-${chunks.length + 1}`,
          fileName,
          fileType: 'txt',
          location: loc,
          text: buffer.join(' ')
        });
        buffer = [];
      }
    }
  }

  return chunks;
}

function parseCsv(fileName: string, buffer: ArrayBuffer): DocumentChunk[] {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];

  const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  if (rawRows.length === 0) return [];

  const headers = rawRows[0].map(h => String(h).trim());
  const chunks: DocumentChunk[] = [];

  for (let i = 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    const nonEmpties = row.filter(cell => cell !== '' && cell !== undefined && cell !== null);
    if (nonEmpties.length === 0) continue;

    const rowText = row
      .map((val, colIdx) => {
        const header = headers[colIdx] || `열${colIdx + 1}`;
        const strVal = String(val).trim();
        return strVal ? `${header}: ${strVal}` : '';
      })
      .filter(Boolean)
      .join(' | ');

    if (rowText.trim()) {
      chunks.push({
        sourceId: `csv-${fileName}-${i + 1}`,
        fileName,
        fileType: 'csv',
        location: `${i + 1}행`,
        text: rowText
      });
    }
  }

  return chunks;
}

function parseXlsx(fileName: string, buffer: ArrayBuffer): DocumentChunk[] {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const chunks: DocumentChunk[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;

    const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    if (rawRows.length === 0) continue;

    const headers = (rawRows[0] || []).map(h => String(h).trim());

    // Group rows into meaningful chunks (every 3-5 rows or per row if long)
    for (let r = 1; r < rawRows.length; r++) {
      const row = rawRows[r];
      const items = row
        .map((cell, cIdx) => {
          const val = String(cell).trim();
          if (!val) return '';
          const colName = headers[cIdx] || `열${cIdx + 1}`;
          return `${colName}: ${val}`;
        })
        .filter(Boolean);

      if (items.length > 0) {
        chunks.push({
          sourceId: `xlsx-${fileName}-${sheetName}-${r + 1}`,
          fileName,
          fileType: 'xlsx',
          location: `${sheetName} 시트 (${r + 1}행)`,
          text: items.join(' | ')
        });
      }
    }
  }

  return chunks;
}

async function parseDocx(fileName: string, buffer: ArrayBuffer): Promise<DocumentChunk[]> {
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  const text = result.value || '';
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  const chunks: DocumentChunk[] = [];
  paragraphs.forEach((para, idx) => {
    chunks.push({
      sourceId: `docx-${fileName}-${idx + 1}`,
      fileName,
      fileType: 'docx',
      location: `${idx + 1}문단`,
      text: para
    });
  });

  return chunks;
}

async function parsePdf(fileName: string, buffer: ArrayBuffer): Promise<DocumentChunk[]> {
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true
  });

  const pdf = await loadingTask.promise;
  const chunks: DocumentChunk[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items
      .map((item: any) => item.str)
      .filter((s: string) => s && s.trim().length > 0);

    const pageText = strings.join(' ').replace(/\s+/g, ' ').trim();
    if (pageText.length > 0) {
      chunks.push({
        sourceId: `pdf-${fileName}-${pageNum}`,
        fileName,
        fileType: 'pdf',
        location: `${pageNum}쪽`,
        text: pageText
      });
    }
  }

  return chunks;
}
