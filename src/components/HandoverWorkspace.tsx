import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  AlertTriangle,
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Edit3,
  Bookmark,
  ShieldAlert,
  Layers,
  Check,
  TrendingUp,
  CreditCard,
  Wifi,
  Sun,
  Moon,
  ChevronRight,
  PieChart
} from 'lucide-react';
import {
  HandoverDraft,
  ItemStatus,
  SourceReference,
  DocumentChunk
} from '../types/handover';

interface HandoverWorkspaceProps {
  draft: HandoverDraft;
  onUpdateDraft: (updatedDraft: HandoverDraft) => void;
  onOpenSource: (source: SourceReference) => void;
  onEditItem: (type: 'work' | 'schedule' | 'issue' | 'stakeholder' | 'reference' | 'conflict' | 'missing', item: any) => void;
  onOpenExport: () => void;
  allChunks: DocumentChunk[];
}

type TabType =
  | 'summary'
  | 'work'
  | 'schedule'
  | 'issues'
  | 'stakeholders'
  | 'references'
  | 'conflicts'
  | 'sources';

export const HandoverWorkspace: React.FC<HandoverWorkspaceProps> = ({
  draft,
  onUpdateDraft,
  onOpenSource,
  onEditItem,
  onOpenExport,
  allChunks
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  // Compute counts
  const allItems: { status: ItemStatus; needsReview?: boolean }[] = [
    ...draft.workItems,
    ...draft.schedule,
    ...draft.ongoingIssues,
    ...draft.stakeholders,
    ...draft.references,
    ...draft.conflicts
  ];

  const totalItemCount = allItems.length;
  const completedCount = allItems.filter(i => i.status === '검토 완료').length;
  const needsReviewCount = allItems.filter(i => i.status === '확인 필요' || i.needsReview).length;
  const unreviewedCount = totalItemCount - completedCount;
  const completionRatio = totalItemCount > 0 ? Math.round((completedCount / totalItemCount) * 100) : 0;

  // Toggle whole draft review completion
  const handleToggleWholeReview = () => {
    if (!draft.isFullyReviewed) {
      const confirmDone = window.confirm(
        `전체 ${totalItemCount}개 항목 중 아직 ${unreviewedCount}개의 미검토 항목이 있습니다.\n전체 인수인계서를 '검토 완료'로 확정하시겠습니까?`
      );
      if (confirmDone) {
        onUpdateDraft({
          ...draft,
          isFullyReviewed: true,
          updatedAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
        });
      }
    } else {
      onUpdateDraft({
        ...draft,
        isFullyReviewed: false,
        updatedAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
      });
    }
  };

  // Quick item status updater
  const handleQuickStatusChange = (
    listKey: 'workItems' | 'schedule' | 'ongoingIssues' | 'stakeholders' | 'references' | 'conflicts',
    itemId: string,
    newStatus: ItemStatus
  ) => {
    const updatedList = (draft[listKey] as any[]).map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: newStatus,
          needsReview: newStatus === '확인 필요'
        };
      }
      return item;
    });

    onUpdateDraft({
      ...draft,
      [listKey]: updatedList,
      updatedAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
    });
  };

  const getStatusBadge = (status: ItemStatus) => {
    switch (status) {
      case '검토 완료':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-3 h-3" />
            검토 완료
          </span>
        );
      case '확인 필요':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]">
            <AlertTriangle className="w-3 h-3" />
            확인 필요
          </span>
        );
      case '검토 중':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            <Clock className="w-3 h-3" />
            검토 중
          </span>
        );
      case 'AI 초안':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            AI 초안
          </span>
        );
    }
  };

  const getConfidenceBadge = (confidence?: string) => {
    if (!confidence) return null;
    let color = 'bg-[#1b2361] text-indigo-300 border-[#2e3e9e]/40';
    if (confidence === '근거 충분') color = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    if (confidence === '일부 근거') color = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (confidence === '근거 부족') color = 'bg-rose-500/20 text-rose-300 border-rose-500/40';

    return (
      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${color}`}>
        {confidence}
      </span>
    );
  };

  const navItems = [
    { key: 'summary' as TabType, label: '대시보드 요약', icon: PieChart, count: null },
    { key: 'work' as TabType, label: '담당 업무 목록', icon: FileText, count: draft.workItems.length },
    { key: 'schedule' as TabType, label: '업무 일정표', icon: Calendar, count: draft.schedule.length },
    { key: 'issues' as TabType, label: '진행 현안·리스크', icon: AlertTriangle, count: draft.ongoingIssues.length },
    { key: 'stakeholders' as TabType, label: '협의·연락 관계', icon: Users, count: draft.stakeholders.length },
    { key: 'references' as TabType, label: '관련 규정·서식', icon: BookOpen, count: draft.references.length },
    { key: 'conflicts' as TabType, label: '자료 상충 및 누락', icon: ShieldAlert, count: draft.conflicts.length + draft.missingInformation.length },
    { key: 'sources' as TabType, label: '원문 출처 목록', icon: Layers, count: allChunks.length }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      {/* Left Vertical Navigation matching reference image */}
      <aside className="w-full lg:w-56 shrink-0 neu-frame rounded-3xl p-3 flex flex-col gap-2">
        <div className="p-3 pb-2 text-center border-b border-[#243387]/50">
          <span className="text-[10px] font-mono tracking-widest text-indigo-300/70 uppercase">
            NAVIGATION
          </span>
        </div>

        <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;

            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'neu-pill-active text-white scale-[1.02] shadow-[0_0_20px_rgba(99,102,241,0.5)]'
                    : 'neu-card-sm text-indigo-200/80 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-indigo-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-white/25 text-white' : 'bg-[#1b2361] text-indigo-300'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick export trigger in nav */}
        <div className="mt-auto pt-3 border-t border-[#243387]/50 hidden lg:block">
          <button
            onClick={onOpenExport}
            className="w-full neu-pill-magenta p-2.5 rounded-xl text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(217,70,239,0.4)] cursor-pointer hover:opacity-95"
          >
            <Download className="w-4 h-4 text-white" />
            내보내기 (MD·JSON·CSV)
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 space-y-5 min-w-0">
        {/* Top Visual Dashboard Widgets Section matching reference */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* 1. Bar Chart & Workload Distribution Widget (col-span-5) */}
          <div className="neu-card rounded-3xl p-5 md:col-span-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] text-indigo-300/70 font-semibold tracking-wide">
                  총 업무 항목
                </span>
                <div className="text-xl font-extrabold text-white mt-0.5 flex items-baseline gap-2">
                  <span className="text-cyan-400">{totalItemCount}건</span>
                  <span className="text-xs text-rose-400 font-normal">
                    미검토 {unreviewedCount}건
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-xl neu-inset text-indigo-400">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
            </div>

            {/* Stylized Bar Chart matching reference image */}
            <div className="neu-inset rounded-2xl p-3 pt-4">
              <div className="flex items-end justify-between h-24 gap-1.5 px-1 relative">
                {/* SVG trend line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                  <path
                    d="M 12 65 Q 40 40, 80 55 T 140 30 T 200 45 T 260 20"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_6px_rgba(236,72,153,0.8)]"
                  />
                </svg>

                {[
                  { label: '업무', val: 75, count: draft.workItems.length },
                  { label: '일정', val: 60, count: draft.schedule.length },
                  { label: '현안', val: 85, count: draft.ongoingIssues.length },
                  { label: '협의', val: 50, count: draft.stakeholders.length },
                  { label: '규정', val: 40, count: draft.references.length },
                  { label: '상충', val: 65, count: draft.conflicts.length }
                ].map((bar, bIdx) => (
                  <div key={bIdx} className="flex-1 flex flex-col items-center gap-1.5 z-10">
                    <span className="text-[9px] text-indigo-300/60 font-mono">{bar.count}</span>
                    <div className="w-full bg-[#1b2361] rounded-t-lg overflow-hidden h-16 flex items-end">
                      <div
                        style={{ height: `${bar.val}%` }}
                        className="w-full bg-gradient-to-t from-blue-600 via-indigo-500 to-cyan-400 rounded-t-lg shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all"
                      />
                    </div>
                    <span className="text-[10px] text-indigo-200 font-medium">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Radial Circular Progress Ring (col-span-3) matching 'Ratio Income 62%' */}
          <div className="neu-card rounded-3xl p-5 md:col-span-3 flex flex-col items-center justify-between text-center">
            <div className="w-full flex items-center justify-between">
              <span className="text-[11px] text-indigo-300/70 font-semibold">
                검토 완료율
              </span>
              <span className="text-[10px] text-cyan-400 font-mono font-bold">
                {completedCount}/{totalItemCount}
              </span>
            </div>

            {/* Glowing Donut Ring SVG */}
            <div className="relative w-28 h-28 my-2 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="44"
                  stroke="#1c2563"
                  strokeWidth="11"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="44"
                  stroke="url(#gradientRing)"
                  strokeWidth="11"
                  strokeDasharray={276}
                  strokeDashoffset={276 - (276 * completionRatio) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                />
                <defs>
                  <linearGradient id="gradientRing" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold text-white tracking-tight font-mono">
                  {completionRatio}%
                </span>
                <span className="text-[9px] text-indigo-300 uppercase tracking-widest">
                  REVIEWED
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-indigo-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                완료 {completedCount}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
                미검토 {unreviewedCount}
              </span>
            </div>
          </div>

          {/* 3. Virtual Handover Card matching top-right Credit Card widget (col-span-4) */}
          <div className="neu-card rounded-3xl p-5 md:col-span-4 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#1b2361] via-[#141b4e] to-[#12163b] border border-[#3b4ca8]/50 shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
            {/* Background subtle sheen */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-6 rounded-md bg-gradient-to-r from-amber-400 to-amber-200 shadow-inner flex items-center justify-center">
                  <div className="w-6 h-4 border border-amber-600/40 rounded-xs" />
                </div>
                <div className="flex items-center gap-1 text-indigo-300/60">
                  <Sun className="w-3.5 h-3.5" />
                  <Moon className="w-3.5 h-3.5" />
                </div>
              </div>
              <Wifi className="w-4 h-4 text-indigo-300 rotate-90" />
            </div>

            <div className="my-2">
              <span className="text-[10px] tracking-widest text-indigo-300 font-mono block">
                HANDOVER ID: {draft.id.slice(0, 16)}
              </span>
              <h3 className="text-sm font-extrabold text-white tracking-wide truncate mt-0.5">
                {draft.department || '담당 부서'}
              </h3>
              <p className="text-[11px] text-indigo-200/80">
                전임: <strong className="text-white">{draft.predecessor}</strong> → 후임: <strong className="text-cyan-300">{draft.successor}</strong>
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[11px] text-indigo-300 font-mono">
                {draft.isFullyReviewed ? '✅ 검토 확정됨' : '⚠️ 검토 진행 중'}
              </span>
              <button
                onClick={handleToggleWholeReview}
                className="px-2.5 py-1 rounded-lg neu-card-sm text-[10px] font-bold text-white hover:text-cyan-300 transition-colors border border-indigo-400/30"
              >
                {draft.isFullyReviewed ? '확정 해제' : '전체 검토 확정'}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content Section Container */}
        <div className="neu-frame rounded-3xl p-5 sm:p-6 min-h-[400px]">
          {/* 1. Summary Tab */}
          {activeTab === 'summary' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#243387]/50">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-cyan-400" />
                  인수인계 종합 요약 대시보드
                </h3>
                <span className="text-xs text-indigo-300">
                  작성 일시: {draft.createdAt}
                </span>
              </div>

              {/* Purpose Card */}
              <div className="neu-card rounded-2xl p-5">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-cyan-400" />
                  1. 업무 목적 및 추진 배경
                </h4>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  {draft.summary.purpose || '등록된 자료에서 업무 목적을 추출할 수 없습니다.'}
                </p>
              </div>

              {/* Core Tasks & Immediate Priorities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="neu-card rounded-2xl p-5">
                  <h4 className="text-xs font-bold text-indigo-200 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    2. 핵심 담당 업무
                  </h4>
                  <ul className="space-y-2 text-xs text-indigo-100">
                    {draft.summary.coreTasks.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2 neu-inset p-2.5 rounded-xl border border-[#2b3a9e]/30">
                        <span className="font-mono font-bold text-cyan-400 shrink-0">0{idx + 1}</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="neu-card rounded-2xl p-5 border border-rose-500/30">
                  <h4 className="text-xs font-bold text-rose-300 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    3. 가장 먼저 확인할 사항 (우선 조치)
                  </h4>
                  <ul className="space-y-2 text-xs text-rose-100">
                    {draft.summary.immediatePriorities.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 neu-inset p-2.5 rounded-xl border border-rose-500/30">
                        <span className="font-bold text-rose-400 shrink-0">⚡</span>
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Overall Notes */}
              {draft.summary.overallNotes && (
                <div className="neu-card rounded-2xl p-4 border border-amber-500/30 bg-gradient-to-r from-[#171e54] to-[#151c4d]">
                  <h5 className="font-bold text-amber-300 text-xs mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    전임자 종합 유의사항
                  </h5>
                  <p className="text-xs text-indigo-100/90 leading-relaxed">
                    {draft.summary.overallNotes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 2. Work Items Tab */}
          {activeTab === 'work' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#243387]/50 text-xs text-indigo-300">
                <span className="font-bold text-white">
                  주요 담당 업무 목록 ({draft.workItems.length}건)
                </span>
                <span>출처 버튼을 누르면 원문 근거가 표시됩니다.</span>
              </div>

              <div className="space-y-4">
                {draft.workItems.map((item) => (
                  <div
                    key={item.id}
                    className="neu-card rounded-2xl p-5 space-y-3 transition-all hover:border-cyan-400/40"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#243387]/50">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-extrabold text-white">
                          {item.title}
                        </h4>
                        {getStatusBadge(item.status)}
                        {item.isUserModified && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                            사용자 수정
                          </span>
                        )}
                        {getConfidenceBadge(item.confidence)}
                        <span className="text-[10px] bg-[#1a2360] text-indigo-200 px-2 py-0.5 rounded-lg border border-[#2b3a9e]/40">
                          {item.frequency}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleQuickStatusChange('workItems', item.id, e.target.value as ItemStatus)
                          }
                          className="neu-inset text-xs px-2.5 py-1 rounded-xl text-white border border-[#2b3a9e]/50 focus:outline-hidden"
                        >
                          <option value="AI 초안" className="bg-[#101642]">AI 초안</option>
                          <option value="검토 중" className="bg-[#101642]">검토 중</option>
                          <option value="확인 필요" className="bg-[#101642]">확인 필요</option>
                          <option value="검토 완료" className="bg-[#101642]">검토 완료</option>
                        </select>

                        <button
                          onClick={() => onEditItem('work', item)}
                          className="neu-card-sm px-2.5 py-1 text-xs text-indigo-200 hover:text-white rounded-xl border border-[#2b3a9e]/40 flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                          수정
                        </button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-indigo-300/70 font-semibold">업무 목적: </span>
                        <span className="text-indigo-100">{item.purpose}</span>
                        {item.role && (
                          <span className="ml-2 text-indigo-300">
                            (담당 역할: <strong className="text-white">{item.role}</strong>)
                          </span>
                        )}
                      </div>

                      {/* Procedure */}
                      <div>
                        <div className="font-bold text-indigo-200 mb-1.5">
                          단계별 처리 절차:
                        </div>
                        <ol className="space-y-1.5 neu-inset p-3 rounded-xl border border-[#233180]/50">
                          {item.procedure.map((step, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-2 text-indigo-100">
                              <span className="w-4 h-4 rounded-full neu-card-sm text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {sIdx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Next Actions */}
                      {item.nextActions && item.nextActions.length > 0 && (
                        <div>
                          <div className="font-bold text-indigo-200 mb-1">
                            후속 조치 사항:
                          </div>
                          <ul className="list-disc pl-5 space-y-0.5 text-indigo-200/90">
                            {item.nextActions.map((action, aIdx) => (
                              <li key={aIdx}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Review Note */}
                      {item.reviewNote && (
                        <div className="p-3 neu-inset rounded-xl border border-amber-500/40 text-amber-200 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-amber-300">전임자 확인 메모: </span>
                            <span>{item.reviewNote}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sources Footer */}
                    {item.sources && item.sources.length > 0 && (
                      <div className="pt-2 border-t border-[#243387]/40 flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] text-indigo-400 font-semibold flex items-center gap-1">
                          <Bookmark className="w-3 h-3 text-cyan-400" />
                          근거 출처:
                        </span>
                        {item.sources.map((src, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => onOpenSource(src)}
                            className="neu-card-sm inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-indigo-200 hover:text-white text-[11px] font-semibold border border-[#2b3a9e]/40 hover:border-cyan-400/50 hover:shadow-[0_0_12px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
                          >
                            <FileText className="w-3 h-3 text-cyan-400" />
                            <span>{src.fileName}</span>
                            <span className="text-cyan-300 font-mono">[{src.location}]</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#243387]/50 text-xs text-indigo-300">
                <span className="font-bold text-white">
                  연간 및 월별 업무 일정표 ({draft.schedule.length}건)
                </span>
              </div>

              <div className="space-y-3">
                {draft.schedule.map((item) => (
                  <div key={item.id} className="neu-card rounded-2xl p-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-xl neu-inset text-cyan-300 font-mono text-xs font-extrabold border border-cyan-500/30">
                          {item.timing}
                        </span>
                        <h4 className="text-xs font-bold text-white">
                          {item.task}
                        </h4>
                        {getStatusBadge(item.status)}
                        <span className="text-[11px] text-indigo-300">
                          마감: <strong className="text-white">{item.deadline}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleQuickStatusChange('schedule', item.id, e.target.value as ItemStatus)
                          }
                          className="neu-inset text-xs px-2 py-1 rounded-xl text-white border border-[#2b3a9e]/50 focus:outline-hidden"
                        >
                          <option value="AI 초안" className="bg-[#101642]">AI 초안</option>
                          <option value="검토 중" className="bg-[#101642]">검토 중</option>
                          <option value="확인 필요" className="bg-[#101642]">확인 필요</option>
                          <option value="검토 완료" className="bg-[#101642]">검토 완료</option>
                        </select>
                        <button
                          onClick={() => onEditItem('schedule', item)}
                          className="neu-card-sm px-2 py-1 text-xs text-indigo-200 hover:text-white rounded-xl border border-[#2b3a9e]/40"
                        >
                          수정
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs neu-inset p-3 rounded-xl border border-[#243387]/40">
                      <div>
                        <span className="text-indigo-400 font-medium">사전 준비: </span>
                        <span className="text-indigo-100">{item.preparation}</span>
                      </div>
                      <div>
                        <span className="text-indigo-400 font-medium">후속 조치: </span>
                        <span className="text-indigo-100">{item.followUp}</span>
                      </div>
                    </div>

                    {item.sources && item.sources.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        {item.sources.map((src, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => onOpenSource(src)}
                            className="neu-card-sm inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-indigo-300 text-[10px] font-medium border border-[#2b3a9e]/30 hover:border-cyan-400/40"
                          >
                            <Bookmark className="w-2.5 h-2.5 text-cyan-400" />
                            <span>{src.fileName} [{src.location}]</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Ongoing Issues Tab */}
          {activeTab === 'issues' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#243387]/50 text-xs text-indigo-300">
                <span className="font-bold text-white">
                  진행 현안 및 리스크 관리 카드 ({draft.ongoingIssues.length}건)
                </span>
              </div>

              <div className="space-y-4">
                {draft.ongoingIssues.map((issue) => (
                  <div key={issue.id} className="neu-card rounded-2xl p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#243387]/50">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-extrabold text-white">
                          {issue.title}
                        </h4>
                        {getStatusBadge(issue.status)}
                        {getConfidenceBadge(issue.confidence)}
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={issue.status}
                          onChange={(e) =>
                            handleQuickStatusChange('ongoingIssues', issue.id, e.target.value as ItemStatus)
                          }
                          className="neu-inset text-xs px-2 py-1 rounded-xl text-white border border-[#2b3a9e]/50 focus:outline-hidden"
                        >
                          <option value="AI 초안" className="bg-[#101642]">AI 초안</option>
                          <option value="검토 중" className="bg-[#101642]">검토 중</option>
                          <option value="확인 필요" className="bg-[#101642]">확인 필요</option>
                          <option value="검토 완료" className="bg-[#101642]">검토 완료</option>
                        </select>
                        <button
                          onClick={() => onEditItem('issue', issue)}
                          className="neu-card-sm px-2.5 py-1 text-xs text-indigo-200 rounded-xl border border-[#2b3a9e]/40"
                        >
                          수정
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-bold text-indigo-200">현재 현황: </span>
                        <span className="text-indigo-100">{issue.currentStatus}</span>
                      </div>
                      <div>
                        <span className="font-bold text-indigo-200">진행 경과: </span>
                        <span className="text-indigo-100/90">{issue.history}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 neu-inset p-3 rounded-xl border border-[#243387]/40">
                        <div>
                          <div className="font-bold text-cyan-300 mb-1">남은 일:</div>
                          <p className="text-indigo-100">{issue.remainingWork}</p>
                        </div>
                        <div>
                          <div className="font-bold text-purple-300 mb-1">다음 조치:</div>
                          <p className="text-indigo-100">{issue.nextStep}</p>
                        </div>
                      </div>

                      {/* Cautions */}
                      <div className="neu-inset p-3 rounded-xl border border-rose-500/40 text-rose-200">
                        <div className="font-bold text-rose-300 flex items-center gap-1.5 mb-1">
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                          주의사항 및 위험요소
                        </div>
                        <p>{issue.cautions}</p>
                      </div>
                    </div>

                    {/* Sources */}
                    {issue.sources && issue.sources.length > 0 && (
                      <div className="pt-2 border-t border-[#243387]/40 flex items-center gap-2 flex-wrap">
                        {issue.sources.map((src, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => onOpenSource(src)}
                            className="neu-card-sm text-[10px] text-indigo-200 px-2.5 py-1 rounded-xl border border-[#2b3a9e]/30 hover:border-cyan-400/40"
                          >
                            출처: {src.fileName} [{src.location}]
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Stakeholders Tab */}
          {activeTab === 'stakeholders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#243387]/50 text-xs text-indigo-300">
                <span className="font-bold text-white">
                  협의 및 연락처 관계망 ({draft.stakeholders.length}건)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {draft.stakeholders.map((stk) => (
                  <div key={stk.id} className="neu-card rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-[#243387]/40">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-xs font-bold text-white">
                          {stk.nameOrOrg}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {getStatusBadge(stk.status)}
                        <button
                          onClick={() => onEditItem('stakeholder', stk)}
                          className="neu-card-sm px-2 py-0.5 text-[11px] text-indigo-200 rounded-lg border border-[#2b3a9e]/30"
                        >
                          수정
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-indigo-100">
                      <div>
                        <span className="text-indigo-400">협의 목적: </span>
                        <strong className="text-white">{stk.purpose}</strong>
                      </div>
                      <div>
                        <span className="text-indigo-400">협의 시점: </span>
                        <span>{stk.timingOrTask}</span>
                      </div>
                      <div>
                        <span className="text-indigo-400">연락처: </span>
                        <span className={stk.contactInfo.includes('확인되지 않음') ? 'text-rose-400 font-bold' : 'text-cyan-300'}>
                          {stk.contactInfo}
                        </span>
                      </div>
                    </div>

                    {stk.sources && stk.sources.length > 0 && (
                      <div className="pt-2 border-t border-[#243387]/30">
                        {stk.sources.map((src, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => onOpenSource(src)}
                            className="neu-card-sm text-[10px] text-indigo-300 px-2 py-0.5 rounded-lg border border-[#2b3a9e]/30"
                          >
                            출처: {src.fileName} ({src.location})
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. References Tab */}
          {activeTab === 'references' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#243387]/50 text-xs text-indigo-300">
                <span className="font-bold text-white">
                  관련 규정, 지침 및 법령 근거 ({draft.references.length}건)
                </span>
              </div>

              <div className="space-y-3">
                {draft.references.map((ref) => (
                  <div key={ref.id} className="neu-card rounded-2xl p-4 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-purple-400 shrink-0" />
                        <h4 className="font-bold text-white text-sm">
                          {ref.docTitle}
                        </h4>
                      </div>
                      <p className="text-indigo-200">
                        <strong className="text-indigo-400">연결 업무:</strong> {ref.relatedWork}
                      </p>
                      <p className="text-indigo-300/70 text-[11px]">
                        위치 / 출처: {ref.locationOrLink}
                      </p>
                    </div>

                    {ref.sources && ref.sources.length > 0 && (
                      <button
                        onClick={() => onOpenSource(ref.sources[0])}
                        className="neu-card-sm px-2.5 py-1 text-cyan-300 rounded-xl border border-[#2b3a9e]/40 text-xs shrink-0"
                      >
                        출처 확인
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Conflicts & Missing Info Tab */}
          {activeTab === 'conflicts' && (
            <div className="space-y-6">
              {/* Conflicts */}
              <div>
                <h3 className="text-sm font-extrabold text-rose-300 mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  문서 간 불일치 및 상충 사항 ({draft.conflicts.length}건)
                </h3>
                <p className="text-xs text-indigo-300/80 mb-4">
                  여러 등록 문서에서 일정이나 수치가 상충하는 항목입니다. AI가 임의로 선택하지 않고 양쪽 원문 근거를 대조하여 전임자의 결정을 구합니다.
                </p>

                {draft.conflicts.length === 0 ? (
                  <div className="neu-inset p-4 rounded-2xl border border-emerald-500/30 text-xs text-emerald-300">
                    등록된 문서 간 명시적인 불일치가 발견되지 않았습니다.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {draft.conflicts.map((conf) => (
                      <div key={conf.id} className="neu-card rounded-2xl p-5 space-y-3 border border-rose-500/30">
                        <div className="flex items-center justify-between pb-2 border-b border-[#243387]/40">
                          <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                            {conf.topic}
                          </h4>
                          <button
                            onClick={() => onEditItem('conflict', conf)}
                            className="neu-card-sm px-2.5 py-1 text-xs text-indigo-200 rounded-xl border border-[#2b3a9e]/30"
                          >
                            결정 메모 수정
                          </button>
                        </div>

                        <p className="text-xs text-indigo-100">
                          {conf.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="neu-inset p-3.5 rounded-xl border border-blue-500/30">
                            <span className="font-bold text-cyan-300 block mb-1">
                              자료 A 기재 내용:
                            </span>
                            <p className="text-indigo-100 mb-2">{conf.optionA.content}</p>
                            {conf.optionA.source && (
                              <button
                                onClick={() => onOpenSource(conf.optionA.source)}
                                className="neu-card-sm text-[10px] text-cyan-300 px-2 py-0.5 rounded-lg border border-[#2b3a9e]/30"
                              >
                                출처: {conf.optionA.source.fileName} [{conf.optionA.source.location}]
                              </button>
                            )}
                          </div>

                          <div className="neu-inset p-3.5 rounded-xl border border-rose-500/30">
                            <span className="font-bold text-rose-300 block mb-1">
                              자료 B 기재 내용 (상충):
                            </span>
                            <p className="text-indigo-100 mb-2">{conf.optionB.content}</p>
                            {conf.optionB.source && (
                              <button
                                onClick={() => onOpenSource(conf.optionB.source)}
                                className="neu-card-sm text-[10px] text-rose-300 px-2 py-0.5 rounded-lg border border-[#2b3a9e]/30"
                              >
                                출처: {conf.optionB.source.fileName} [{conf.optionB.source.location}]
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="neu-inset p-3 rounded-xl border border-amber-500/30 text-xs text-amber-200">
                          <span className="font-bold text-amber-300">전임자 판단 메모: </span>
                          <span>{conf.resolutionNote}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Missing Information */}
              <div>
                <h3 className="text-sm font-extrabold text-amber-300 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  정보 부족 및 전임자 확인 필요 사항 ({draft.missingInformation.length}건)
                </h3>

                <div className="neu-inset rounded-2xl overflow-hidden divide-y divide-[#233180]/40 text-xs">
                  {draft.missingInformation.map((miss) => (
                    <div key={miss.id} className="p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">
                          [{miss.category}] {miss.item}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          전임자 보완 필요
                        </span>
                      </div>
                      <p className="text-indigo-200">
                        <strong className="text-indigo-400">사유:</strong> {miss.reason}
                      </p>
                      <p className="text-cyan-300 font-medium">
                        💡 권고 조치: {miss.suggestedAction}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 8. Sources Tab */}
          {activeTab === 'sources' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#243387]/50 text-xs text-indigo-300">
                <span className="font-bold text-white">
                  추출 원문 조각 목록 (총 {allChunks.length}개)
                </span>
              </div>

              <div className="neu-inset rounded-2xl overflow-hidden divide-y divide-[#233180]/40 max-h-[500px] overflow-y-auto">
                {allChunks.map((c, idx) => (
                  <div key={c.sourceId || idx} className="p-3 text-xs hover:bg-white/5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{c.fileName}</span>
                        <span className="px-1.5 py-0.2 rounded-md bg-[#1b2361] text-cyan-300 text-[10px] uppercase font-mono font-bold">
                          {c.fileType}
                        </span>
                      </div>
                      <span className="text-[11px] text-indigo-300 font-mono">
                        위치: {c.location || '상세 위치 확인 불가'}
                      </span>
                    </div>
                    <p className="text-indigo-200/80 line-clamp-2">
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
