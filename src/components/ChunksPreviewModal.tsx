import React, { useState } from 'react';
import { X, Search, FileText, Compass, Layers } from 'lucide-react';
import { DocumentChunk } from '../types/handover';

interface ChunksPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  chunks: DocumentChunk[];
}

export const ChunksPreviewModal: React.FC<ChunksPreviewModalProps> = ({
  isOpen,
  onClose,
  chunks
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFileFilter, setSelectedFileFilter] = useState<string>('all');

  if (!isOpen) return null;

  const uniqueFiles = Array.from(new Set(chunks.map(c => c.fileName)));

  const filteredChunks = chunks.filter(c => {
    const matchesFile = selectedFileFilter === 'all' || c.fileName === selectedFileFilter;
    const matchesSearch =
      !searchTerm ||
      c.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFile && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="neu-frame bg-[#101642] rounded-3xl max-w-4xl w-full p-6 max-h-[92vh] flex flex-col border border-[#2d3d99]/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#243387]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl neu-inset text-cyan-400 flex items-center justify-center">
              <Layers className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-wide">
                추출 텍스트 및 위치 메타데이터 미리보기
              </h3>
              <p className="text-xs text-indigo-300">
                총 {chunks.length}개의 발췌 조각에 보존된 페이지, 시트·셀, 문단 및 행 위치 정보
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

        {/* Filters */}
        <div className="my-3 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="텍스트 내용 또는 위치(예: 3쪽, 14행 등) 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="neu-inset w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl text-white placeholder-indigo-400/40 border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs text-indigo-300 whitespace-nowrap">파일 필터:</label>
            <select
              value={selectedFileFilter}
              onChange={(e) => setSelectedFileFilter(e.target.value)}
              className="neu-inset text-xs px-3 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:outline-hidden"
            >
              <option value="all" className="bg-[#101642]">전체 파일 ({chunks.length}개 조각)</option>
              {uniqueFiles.map(fn => (
                <option key={fn} value={fn} className="bg-[#101642]">
                  {fn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chunks List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filteredChunks.length === 0 ? (
            <div className="text-center py-12 text-indigo-400 text-xs neu-inset rounded-2xl">
              일치하는 텍스트 조각이 없습니다.
            </div>
          ) : (
            filteredChunks.map((chunk, index) => (
              <div
                key={chunk.sourceId || index}
                className="p-3.5 neu-card rounded-2xl text-xs space-y-2 hover:border-cyan-400/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-bold text-white">
                      {chunk.fileName}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-md bg-[#1b2361] text-cyan-300 text-[10px] uppercase font-mono font-bold">
                      {chunk.fileType}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-indigo-200">
                    <Compass className="w-3 h-3 text-cyan-400" />
                    <span className="text-[11px] neu-inset px-2.5 py-0.5 rounded-lg border border-[#2b3a9e]/30 font-mono text-cyan-300">
                      위치: {chunk.location || '상세 위치 확인 불가'}
                    </span>
                  </div>
                </div>

                <p className="text-indigo-100 leading-relaxed neu-inset p-3 rounded-xl border border-[#233180]/40">
                  {chunk.text}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#243387]/50 flex items-center justify-between text-xs">
          <span className="text-indigo-400">
            표시 중: <strong className="text-white">{filteredChunks.length}</strong> / {chunks.length}개 조각
          </span>
          <button
            onClick={onClose}
            className="neu-card-sm px-5 py-2 text-white rounded-xl font-bold hover:text-cyan-300 transition-colors border border-[#2b3a9e]/40"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
