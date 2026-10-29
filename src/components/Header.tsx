import React from 'react';
import { ShieldCheck, Sparkles, FolderSync, RefreshCw, FileText, CheckCircle2, PieChart } from 'lucide-react';

interface HeaderProps {
  currentStage: 'empty' | 'analyzing' | 'review_needed' | 'completed';
  unreviewedCount: number;
  isDemoActive: boolean;
  onLoadDemo: () => void;
  onReset: () => void;
  onOpenSecurityModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStage,
  unreviewedCount,
  isDemoActive,
  onLoadDemo,
  onReset,
  onOpenSecurityModal
}) => {
  const stages = [
    { key: 'empty', label: '1. 자료 등록' },
    { key: 'extracted', label: '2. 텍스트 추출' },
    { key: 'analyzing', label: '3. AI 초안 생성' },
    { key: 'review_needed', label: `4. 전임자 검토${unreviewedCount > 0 ? ` (${unreviewedCount})` : ''}` },
    { key: 'completed', label: '5. 최종 확정' }
  ];

  const getStageIndex = () => {
    switch (currentStage) {
      case 'empty': return 0;
      case 'analyzing': return 2;
      case 'review_needed': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  const currentIdx = getStageIndex();

  return (
    <header className="neu-frame rounded-2xl sm:rounded-3xl p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Brand / Title matching reference top-left */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl neu-inset flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <PieChart className="w-6 h-6 text-cyan-400 stroke-[1.75]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-wider uppercase font-mono">
                업무 바통
              </h1>
              <span className="text-[10px] tracking-widest text-indigo-300 font-semibold px-2 py-0.5 rounded-full bg-[#1b2361] border border-[#2e3b9e]/50">
                AI HANDOVER SYSTEM
              </span>
              {isDemoActive && (
                <span className="text-[10px] bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  DEMO 모의데이터
                </span>
              )}
            </div>
            <p className="text-[11px] text-indigo-300/70 tracking-wide mt-0.5">
              공공업무 인수인계 초안 생성 및 근거 출처 검토 시스템
            </p>
          </div>
        </div>

        {/* Segmented Timeline Pill Bar matching reference top bar */}
        <div className="neu-inset p-1.5 rounded-2xl flex items-center justify-between overflow-x-auto gap-1 max-w-xl w-full">
          {stages.map((st, idx) => {
            const isActive = idx === currentIdx;
            const isPassed = idx < currentIdx;

            return (
              <div
                key={st.key}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-tight whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'neu-pill-active text-white scale-[1.02]'
                    : isPassed
                    ? 'bg-[#182159] text-indigo-200 border border-[#2a3892]/40'
                    : 'text-indigo-400/50 hover:text-indigo-300'
                }`}
              >
                {isPassed && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
                {st.label}
              </div>
            );
          })}
        </div>

        {/* Action Controls matching dark neumorphic button style */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 self-end lg:self-center">
          <button
            onClick={onOpenSecurityModal}
            className="neu-card-sm px-3 py-2 text-xs font-semibold text-indigo-200 hover:text-white rounded-xl transition-all flex items-center gap-1.5 border border-[#2b3a9e]/40 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
            title="보안 및 개인정보 유의사항 확인"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">보안 안내</span>
          </button>

          <button
            onClick={onLoadDemo}
            className="neu-card-sm px-3.5 py-2 text-xs font-bold text-white rounded-xl transition-all flex items-center gap-1.5 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-500 hover:to-purple-500 border border-indigo-400/40 shadow-[0_0_15px_rgba(99,102,241,0.35)]"
            title="가상 공공업무 모의데이터로 즉시 체험"
          >
            <FolderSync className="w-4 h-4 text-cyan-300" />
            <span>데모 불러오기</span>
          </button>

          <button
            onClick={onReset}
            className="neu-card-sm p-2 text-indigo-300 hover:text-white rounded-xl transition-all border border-[#2b3a9e]/40 hover:border-rose-400/40 hover:shadow-[0_0_12px_rgba(244,63,94,0.3)]"
            title="초기화"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
