import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  FolderUp,
  Eye,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { UploadedDocument } from '../types/handover';

interface DocumentUploadSectionProps {
  documents: UploadedDocument[];
  onFilesSelected: (files: FileList | File[]) => void;
  onRemoveDocument: (docId: string) => void;
  onPreviewChunks: () => void;
  onGenerateDraft: () => void;
  isGenerating: boolean;
  department: string;
  setDepartment: (val: string) => void;
  predecessor: string;
  setPredecessor: (val: string) => void;
  successor: string;
  setSuccessor: (val: string) => void;
  customNotes: string;
  setCustomNotes: (val: string) => void;
}

export const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  documents,
  onFilesSelected,
  onRemoveDocument,
  onPreviewChunks,
  onGenerateDraft,
  isGenerating,
  department,
  setDepartment,
  predecessor,
  setPredecessor,
  successor,
  setSuccessor,
  customNotes,
  setCustomNotes
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const validDocs = documents.filter(d => d.status === 'success');
  const errorDocs = documents.filter(d => d.status === 'error');
  const totalChars = validDocs.reduce((acc, d) => acc + d.charCount, 0);
  const totalChunks = validDocs.reduce((acc, d) => acc + d.chunkCount, 0);

  const getFormatBadge = (type: string) => {
    switch (type) {
      case 'pdf':
        return <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.3)]">PDF</span>;
      case 'docx':
        return <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.3)]">DOCX</span>;
      case 'xlsx':
      case 'csv':
        return <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]">{type.toUpperCase()}</span>;
      case 'txt':
        return <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-indigo-500/20 text-indigo-200 border border-indigo-500/40">{type.toUpperCase()}</span>;
      default:
        return <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">미지원</span>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* 1. File Upload Card */}
      <div className="neu-card rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neu-inset flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <UploadCloud className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-wide flex items-center gap-2">
                1. 업무 문서 등록 및 출처 텍스트 추출
              </h2>
              <p className="text-xs text-indigo-300/70">
                인수인계에 활용할 추진계획, 현안보고서, 일정표, 연락망 문서를 등록하세요.
              </p>
            </div>
          </div>

          <div className="text-xs text-indigo-300/80 flex items-center gap-2">
            <span className="font-semibold text-indigo-200">지원 형식:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-[#1b2361] text-cyan-300 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-cyan-500/30">PDF</span>
              <span className="bg-[#1b2361] text-blue-300 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-blue-500/30">DOCX</span>
              <span className="bg-[#1b2361] text-emerald-300 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-emerald-500/30">XLSX</span>
              <span className="bg-[#1b2361] text-purple-300 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-purple-500/30">CSV</span>
              <span className="bg-[#1b2361] text-slate-300 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-slate-500/30">TXT</span>
            </div>
          </div>
        </div>

        {/* Drop Box matching neu-inset styling */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`neu-inset rounded-2xl p-7 text-center transition-all border-2 border-dashed ${
            isDragging
              ? 'border-cyan-400 bg-[#0e1645] scale-[0.99] shadow-[0_0_25px_rgba(6,182,212,0.3)]'
              : 'border-[#263585]/70 hover:border-cyan-400/60'
          }`}
        >
          <div className="mx-auto w-14 h-14 rounded-2xl neu-card-sm flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(99,102,241,0.25)]">
            <UploadCloud className="w-7 h-7 text-cyan-400" />
          </div>
          <p className="text-sm font-bold text-white tracking-wide">
            문서 파일을 이곳으로 드래그하거나 아래 버튼을 눌러 선택하세요
          </p>
          <p className="text-xs text-indigo-300/70 mt-1 max-w-lg mx-auto leading-relaxed">
            여러 파일 다중 선택 및 폴더 등록이 지원됩니다. 원본 파일은 사용자 PC에서 읽기 전용으로 취급되어 절대 덮어쓰거나 수정되지 않습니다.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="neu-pill-active px-5 py-2.5 text-white text-xs font-bold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-cyan-300" />
              파일 선택 (다중 선택)
            </button>

            <button
              type="button"
              onClick={() => folderInputRef.current?.click()}
              className="neu-card-sm px-4 py-2.5 text-indigo-200 hover:text-white text-xs font-bold rounded-xl border border-[#2e3e9e]/50 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <FolderUp className="w-4 h-4 text-cyan-400" />
              폴더 단위 등록
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.xlsx,.xls,.csv,.txt,.hwp,.hwpx"
            onChange={(e) => {
              if (e.target.files) onFilesSelected(e.target.files);
              e.target.value = '';
            }}
            className="hidden"
          />

          <input
            ref={folderInputRef}
            type="file"
            // @ts-ignore
            webkitdirectory="true"
            directory="true"
            onChange={(e) => {
              if (e.target.files) onFilesSelected(e.target.files);
              e.target.value = '';
            }}
            className="hidden"
          />
        </div>

        {/* Uploaded Documents List */}
        {documents.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#253587]/60 text-xs text-indigo-200">
              <div className="font-bold flex items-center gap-2 text-white">
                <Layers className="w-4 h-4 text-cyan-400" />
                등록 자료 처리 현황 ({documents.length}개 파일)
              </div>
              <div className="text-[11px] text-indigo-300/80">
                추출 성공: <strong className="text-cyan-400">{validDocs.length}개</strong>
                {errorDocs.length > 0 && (
                  <span className="ml-2 text-rose-400">
                    (오류: <strong>{errorDocs.length}개</strong>)
                  </span>
                )}
                <span className="mx-2 text-indigo-500">|</span>
                총 텍스트 약 <strong className="text-white">{totalChars.toLocaleString()}자</strong> ({totalChunks}개 조각)
              </div>
            </div>

            <div className="neu-inset rounded-2xl overflow-hidden divide-y divide-[#1e2a6d]/40 max-h-72 overflow-y-auto">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-3.5 flex items-start justify-between gap-3 text-xs transition-colors ${
                    doc.status === 'error'
                      ? 'bg-rose-950/20'
                      : doc.isDemo
                      ? 'bg-amber-950/20'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="mt-0.5 shrink-0 p-2 rounded-xl neu-card-sm text-cyan-400">
                      {doc.type === 'xlsx' || doc.type === 'csv' ? (
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <FileText className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white truncate">
                          {doc.name}
                        </span>
                        {getFormatBadge(doc.type)}
                        <span className="text-[11px] text-indigo-300/60 font-mono">
                          {formatFileSize(doc.size)}
                        </span>
                        {doc.isDemo && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.2 rounded-full font-bold">
                            가상 모의자료
                          </span>
                        )}
                      </div>

                      {doc.status === 'success' && (
                        <div className="text-[11px] text-indigo-200/80 mt-1 flex items-center gap-3">
                          <span className="text-cyan-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            추출 성공
                          </span>
                          <span>분량: <strong className="text-white">{doc.charCount.toLocaleString()}자</strong></span>
                          <span>위치 조각: <strong className="text-white">{doc.chunkCount}개</strong></span>
                        </div>
                      )}

                      {doc.warning && (
                        <p className="text-[11px] text-amber-300 mt-1.5 flex items-start gap-1.5 neu-inset p-2 rounded-xl border border-amber-500/30">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                          <span>{doc.warning}</span>
                        </p>
                      )}

                      {doc.status === 'error' && (
                        <p className="text-[11px] text-rose-300 mt-1.5 flex items-start gap-1.5 neu-inset p-2 rounded-xl border border-rose-500/40 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                          <span>{doc.errorMessage}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveDocument(doc.id)}
                    className="p-1.5 text-indigo-400 hover:text-rose-400 rounded-lg hover:bg-white/10 transition-colors shrink-0"
                    title="분석 대상에서 제외"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Metadata & Generation Parameters Card */}
      <div className="neu-card rounded-3xl p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl neu-inset flex items-center justify-center text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-wide">
              2. 인수인계 기본 정보 및 생성 파라미터
            </h2>
            <p className="text-xs text-indigo-300/70">
              부서명과 전임자/후임자를 기재하면 인수인계서 표지와 본문에 자동 반영됩니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-indigo-200 mb-1.5">
              소속 부서 / 팀명
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="예: 디지털혁신과 스마트기획팀"
              className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white placeholder-indigo-400/40 border border-[#2b3a9e]/40 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-indigo-200 mb-1.5">
              전임자 성명 / 직급
            </label>
            <input
              type="text"
              value={predecessor}
              onChange={(e) => setPredecessor(e.target.value)}
              placeholder="예: 홍길동 주무관 (전임자)"
              className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white placeholder-indigo-400/40 border border-[#2b3a9e]/40 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-indigo-200 mb-1.5">
              후임자 성명 / 직급
            </label>
            <input
              type="text"
              value={successor}
              onChange={(e) => setSuccessor(e.target.value)}
              placeholder="예: 이몽룡 주무관 (후임자)"
              className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white placeholder-indigo-400/40 border border-[#2b3a9e]/40 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-bold text-indigo-200 mb-1.5">
            추가 중점 분석 요청사항 (선택)
          </label>
          <input
            type="text"
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="예: 상반기 조기집행 잔여 예산과 현장 보안감사 리스크를 중점적으로 정리해 주세요."
            className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white placeholder-indigo-400/40 border border-[#2b3a9e]/40 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] focus:outline-hidden"
          />
        </div>

        {/* Security Checkbox matching dark style */}
        <div className="neu-inset p-3.5 rounded-2xl border border-[#2b3a9e]/40 mb-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasConsented}
              onChange={(e) => setHasConsented(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded-md border-indigo-500 bg-[#0c1033] text-indigo-600 focus:ring-cyan-500 cursor-pointer"
            />
            <span className="text-xs text-indigo-200/90 leading-relaxed">
              <strong className="text-cyan-300">[필수 확인]</strong> 등록된 문서 내용이 AI 분석을 위해 전송되는 것에 동의하며,
              주민등록번호 등 개인정보나 비공개 비밀자료가 포함되지 않았음을 확인하였습니다.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#233180]/60">
          <button
            type="button"
            onClick={onPreviewChunks}
            disabled={validDocs.length === 0}
            className="w-full sm:w-auto neu-card-sm px-4 py-2.5 text-xs font-bold text-indigo-200 hover:text-white rounded-xl border border-[#2e3e9e]/50 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            추출 텍스트 미리보기 ({totalChunks}개 조각)
          </button>

          <button
            type="button"
            onClick={onGenerateDraft}
            disabled={validDocs.length === 0 || !hasConsented || isGenerating}
            className="w-full sm:w-auto neu-pill-active px-7 py-3 text-xs font-extrabold text-white rounded-xl shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:opacity-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                AI 인수인계 초안 구조화 생성 중...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                인수인계 초안 생성 실행
                <ArrowRight className="w-4 h-4 text-indigo-200" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
