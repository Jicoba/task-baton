import React, { useState } from 'react';
import { X, FileText, Check, Copy, AlertCircle, Bookmark, Compass } from 'lucide-react';
import { DocumentChunk, SourceReference } from '../types/handover';

interface SourceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSource: SourceReference | null;
  allChunks: DocumentChunk[];
}

export const SourceDrawer: React.FC<SourceDrawerProps> = ({
  isOpen,
  onClose,
  selectedSource,
  allChunks
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !selectedSource) return null;

  const handleCopy = () => {
    if (selectedSource?.excerpt) {
      navigator.clipboard.writeText(selectedSource.excerpt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const matchedChunk = allChunks.find(
    c =>
      c.sourceId === selectedSource.sourceId ||
      (c.fileName === selectedSource.fileName && c.location === selectedSource.location) ||
      (c.fileName === selectedSource.fileName && c.text.includes(selectedSource.excerpt.slice(0, 25)))
  );

  const displayLocation = selectedSource.location && selectedSource.location.trim() !== ''
    ? selectedSource.location
    : '상세 위치 확인 불가';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-md flex justify-end">
      <div className="w-full max-w-lg neu-frame bg-[#101642] h-full shadow-2xl flex flex-col border-l border-[#2e3e9e]/60 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#243387]/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl neu-inset text-cyan-400 flex items-center justify-center">
              <Bookmark className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wide">
                원문 근거 출처 확인 패널
              </h3>
              <p className="text-[11px] text-indigo-300/80">
                AI 초안 항목의 실제 문서 발췌문 및 원본 메타데이터
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-indigo-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Metadata Card */}
          <div className="neu-card rounded-2xl p-4 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">
                  {selectedSource.fileName}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-[#1b2361] text-cyan-300 uppercase border border-cyan-500/30">
                {selectedSource.fileType || 'DOC'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-indigo-200">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-indigo-400 font-medium">문서 내 위치:</span>
              <strong className="text-white neu-inset px-2.5 py-0.5 rounded-lg border border-[#2b3a9e]/40 font-mono">
                {displayLocation}
              </strong>
            </div>

            {displayLocation === '상세 위치 확인 불가' && (
              <p className="text-[11px] text-amber-300 neu-inset p-2 rounded-xl border border-amber-500/40 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                정확한 행/페이지 번호를 보존할 수 없는 형식의 경우 임의 번호를 생성하지 않습니다.
              </p>
            )}
          </div>

          {/* Quoted Excerpt */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-indigo-200 flex items-center gap-1">
                인용 발췌문 (Excerpt)
              </label>
              <button
                onClick={handleCopy}
                className="text-[11px] text-cyan-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg neu-card-sm border border-[#2b3a9e]/40 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-cyan-400" />
                    <span className="text-cyan-300 font-bold">복사됨</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>발췌문 복사</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 neu-inset rounded-2xl border border-cyan-500/30 text-xs text-indigo-100 leading-relaxed relative">
              <div className="absolute top-2 left-2 text-cyan-500/40 select-none text-2xl font-serif">“</div>
              <p className="pl-4 italic">
                {selectedSource.excerpt || '발췌문 내용이 제공되지 않았습니다.'}
              </p>
              <div className="text-right text-cyan-500/40 select-none text-2xl font-serif">”</div>
            </div>
          </div>

          {/* Surrounding Context */}
          {matchedChunk && (
            <div>
              <label className="block text-xs font-bold text-indigo-200 mb-1.5">
                해당 위치 전체 원문 문맥 (Surrounding Context)
              </label>
              <div className="neu-inset p-3.5 rounded-2xl border border-[#243387]/40 text-xs text-indigo-200/90 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
                {matchedChunk.text}
              </div>
            </div>
          )}

          {/* Audit Advice */}
          <div className="neu-inset p-3.5 rounded-2xl border border-cyan-500/30 text-[11px] text-indigo-200 leading-relaxed">
            <h5 className="font-bold flex items-center gap-1.5 text-cyan-300 mb-1">
              <Check className="w-3.5 h-3.5 text-cyan-400" />
              전임자 검토 가이드
            </h5>
            <p>
              AI 초안의 문구와 위 발췌문의 사실 관계가 일치하는지 확인하십시오.
              내용을 수정한 경우에도 출처 연결은 유지되나, 의미가 변경되었다면 확인 필요 상태로 표시하십시오.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#243387]/50 flex justify-end">
          <button
            onClick={onClose}
            className="neu-card-sm px-5 py-2 text-white rounded-xl text-xs font-bold hover:text-cyan-300 transition-colors border border-[#2b3a9e]/40"
          >
            패널 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
