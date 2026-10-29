import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { HandoverDraft } from '../types/handover';
import {
  exportToMarkdown,
  exportToJson,
  exportWorkItemsToCsv,
  exportScheduleToCsv,
  triggerDownload
} from '../utils/exportFormats';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: HandoverDraft;
}

type ExportType = 'md' | 'json' | 'csv_work' | 'csv_schedule';

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  draft
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportType>('md');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getExportData = () => {
    switch (selectedFormat) {
      case 'md':
        return {
          content: exportToMarkdown(draft),
          filename: `${draft.department || '업무'}_인수인계서_${new Date().toISOString().slice(0, 10)}.md`,
          mime: 'text/markdown;charset=utf-8'
        };
      case 'json':
        return {
          content: exportToJson(draft),
          filename: `handover_data_${new Date().toISOString().slice(0, 10)}.json`,
          mime: 'application/json;charset=utf-8'
        };
      case 'csv_work':
        return {
          content: exportWorkItemsToCsv(draft),
          filename: `인수인계_업무목록_${new Date().toISOString().slice(0, 10)}.csv`,
          mime: 'text/csv;charset=utf-8'
        };
      case 'csv_schedule':
        return {
          content: exportScheduleToCsv(draft),
          filename: `인수인계_일정목록_${new Date().toISOString().slice(0, 10)}.csv`,
          mime: 'text/csv;charset=utf-8'
        };
    }
  };

  const { content, filename, mime } = getExportData();

  const handleDownload = () => {
    setErrorMessage(null);
    setDownloadSuccess(null);
    try {
      triggerDownload(content, filename, mime);
      setDownloadSuccess(`'${filename}' 파일이 성공적으로 다운로드되었습니다.`);
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || '파일 다운로드에 실패했습니다. 내용을 복사하여 저장해 주세요.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="neu-frame bg-[#101642] rounded-3xl max-w-3xl w-full p-6 max-h-[92vh] flex flex-col border border-[#2d3d99]/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#243387]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl neu-inset text-emerald-400 flex items-center justify-center">
              <Download className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-wide">
                인수인계서 내보내기 및 다운로드
              </h3>
              <p className="text-xs text-indigo-300">
                검토된 인수인계 결과물을 Markdown, JSON, CSV 형식으로 안전하게 내려받습니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-indigo-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector matching dark neumorphic cards */}
        <div className="my-4">
          <label className="block text-xs font-bold text-indigo-200 mb-2">
            내보낼 포맷 선택:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <button
              onClick={() => setSelectedFormat('md')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedFormat === 'md'
                  ? 'neu-pill-active border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] font-bold'
                  : 'neu-card-sm text-indigo-200 hover:text-white border-[#2b3a9e]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>Markdown (.md)</span>
                <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded-full font-bold">권장</span>
              </div>
              <p className="text-[11px] text-indigo-300/80 font-normal mt-1">
                보고서 서식 및 표 형태
              </p>
            </button>

            <button
              onClick={() => setSelectedFormat('json')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedFormat === 'json'
                  ? 'neu-pill-active border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] font-bold'
                  : 'neu-card-sm text-indigo-200 hover:text-white border-[#2b3a9e]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>JSON (.json)</span>
              </div>
              <p className="text-[11px] text-indigo-300/80 font-normal mt-1">
                구조화된 시스템 데이터
              </p>
            </button>

            <button
              onClick={() => setSelectedFormat('csv_work')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedFormat === 'csv_work'
                  ? 'neu-pill-active border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] font-bold'
                  : 'neu-card-sm text-indigo-200 hover:text-white border-[#2b3a9e]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>업무목록 CSV</span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded-full font-bold">엑셀</span>
              </div>
              <p className="text-[11px] text-indigo-300/80 font-normal mt-1">
                엑셀용 업무 목록
              </p>
            </button>

            <button
              onClick={() => setSelectedFormat('csv_schedule')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedFormat === 'csv_schedule'
                  ? 'neu-pill-active border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] font-bold'
                  : 'neu-card-sm text-indigo-200 hover:text-white border-[#2b3a9e]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>일정목록 CSV</span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded-full font-bold">엑셀</span>
              </div>
              <p className="text-[11px] text-indigo-300/80 font-normal mt-1">
                시기별 타임라인
              </p>
            </button>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="flex-1 min-h-[220px] flex flex-col">
          <div className="flex items-center justify-between pb-1.5">
            <span className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              내보내기 미리보기 ({filename})
            </span>
            <button
              onClick={handleCopy}
              className="neu-card-sm text-xs text-indigo-200 hover:text-white flex items-center gap-1 px-3 py-1 rounded-xl border border-[#2b3a9e]/40 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-cyan-400" />
                  <span className="text-cyan-300 font-bold">복사 완료</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>내용 복사</span>
                </>
              )}
            </button>
          </div>

          <div className="flex-1 neu-inset text-indigo-100 p-4 rounded-2xl font-mono text-[11px] overflow-y-auto max-h-60 whitespace-pre leading-relaxed border border-[#233180]/50 select-all">
            {content}
          </div>
        </div>

        {/* Success or Error */}
        {downloadSuccess && (
          <div className="mt-3 p-3 rounded-xl neu-inset border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-3 p-3 rounded-xl neu-inset border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#243387]/50 flex items-center justify-between text-xs">
          <span className="text-indigo-400">
            사용자 로컬 PC로 직접 안전하게 다운로드됩니다.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="neu-card-sm px-4 py-2 text-indigo-200 hover:text-white rounded-xl font-medium border border-[#2b3a9e]/40"
            >
              닫기
            </button>
            <button
              onClick={handleDownload}
              className="neu-pill-active px-6 py-2 text-white rounded-xl font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.5)] cursor-pointer"
            >
              <Download className="w-4 h-4" />
              다운로드 실행
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
