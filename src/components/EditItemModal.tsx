import React, { useState, useEffect } from 'react';
import { X, Edit3, Save, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ItemStatus } from '../types/handover';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: 'work' | 'schedule' | 'issue' | 'stakeholder' | 'reference' | 'conflict' | 'missing';
  initialItem: any;
  onSave: (updatedItem: any) => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  onClose,
  itemType,
  initialItem,
  onSave
}) => {
  const [formData, setFormData] = useState<any>({});
  const [status, setStatus] = useState<ItemStatus>('검토 중');

  useEffect(() => {
    if (initialItem) {
      setFormData({ ...initialItem });
      setStatus(initialItem.status || '검토 중');
    }
  }, [initialItem]);

  if (!isOpen || !initialItem) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      status,
      isUserModified: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="neu-frame bg-[#101642] rounded-3xl max-w-2xl w-full p-6 max-h-[92vh] overflow-y-auto border border-[#2d3d99]/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#243387]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl neu-inset text-cyan-400 flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-wide">
                인수인계 항목 내용 수정
              </h3>
              <p className="text-xs text-indigo-300">
                수정사항은 현재 세션 메모리에 반영되며, 원본 출처 링크는 안전하게 보존됩니다.
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

        {/* Warning Banner */}
        <div className="my-3 neu-inset p-3 rounded-2xl border border-amber-500/40 flex items-start gap-2.5 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            문구를 수정할 경우 원래 원문 근거와 의미가 달라질 수 있습니다.
            수정 후 <strong>「사용자 수정」</strong> 배지가 부여되며, 필요 시 출처 적합성을 재확인하십시오.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Status Selection Buttons */}
          <div>
            <label className="block font-bold text-indigo-200 mb-2">
              검토 상태 변경
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['AI 초안', '검토 중', '확인 필요', '검토 완료'] as ItemStatus[]).map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`py-2 px-3 rounded-xl font-bold text-xs border text-center transition-all cursor-pointer ${
                    status === st
                      ? st === '검토 완료'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                        : st === '확인 필요'
                        ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                        : st === '검토 중'
                        ? 'bg-amber-600 text-white border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                        : 'bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                      : 'neu-card-sm text-indigo-300 border-[#2b3a9e]/40 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Type-specific Fields */}
          {itemType === 'work' && (
            <>
              <div>
                <label className="block font-bold text-indigo-200 mb-1">업무명</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-indigo-200 mb-1">주기 / 빈도</label>
                  <input
                    type="text"
                    value={formData.frequency || ''}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-indigo-200 mb-1">담당 역할</label>
                  <input
                    type="text"
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-indigo-200 mb-1">업무 목적 및 개요</label>
                <textarea
                  rows={2}
                  value={formData.purpose || ''}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-indigo-200 mb-1">
                  처리 절차 (줄바꿈으로 단계 구분)
                </label>
                <textarea
                  rows={4}
                  value={Array.isArray(formData.procedure) ? formData.procedure.join('\n') : formData.procedure || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      procedure: e.target.value.split('\n').filter(Boolean)
                    })
                  }
                  className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-indigo-200 mb-1">
                  후속 조치 (줄바꿈으로 항목 구분)
                </label>
                <textarea
                  rows={2}
                  value={Array.isArray(formData.nextActions) ? formData.nextActions.join('\n') : formData.nextActions || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nextActions: e.target.value.split('\n').filter(Boolean)
                    })
                  }
                  className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-indigo-200 mb-1">전임자 확인 메모</label>
                <input
                  type="text"
                  value={formData.reviewNote || ''}
                  onChange={(e) => setFormData({ ...formData, reviewNote: e.target.value })}
                  className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
                />
              </div>
            </>
          )}

          {itemType === 'schedule' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-indigo-200 mb-1">시기 / 주기</label>
                  <input
                    type="text"
                    value={formData.timing || ''}
                    onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                    className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-indigo-200 mb-1">마감일</label>
                  <input
                    type="text"
                    value={formData.deadline || ''}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-indigo-200 mb-1">업무명</label>
                <input
                  type="text"
                  value={formData.task || ''}
                  onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                  className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-indigo-200 mb-1">사전 준비사항</label>
                <textarea
                  rows={2}
                  value={formData.preparation || ''}
                  onChange={(e) => setFormData({ ...formData, preparation: e.target.value })}
                  className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-indigo-200 mb-1">후속 조치</label>
                <textarea
                  rows={2}
                  value={formData.followUp || ''}
                  onChange={(e) => setFormData({ ...formData, followUp: e.target.value })}
                  className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
                />
              </div>
            </>
          )}

          {itemType === 'issue' && (
            <>
              <div>
                <label className="block font-bold text-indigo-200 mb-1">현안 과제명</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-indigo-200 mb-1">현재 상태 (현황)</label>
                <textarea
                  rows={2}
                  value={formData.currentStatus || ''}
                  onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
                  className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-indigo-200 mb-1">남은 일</label>
                  <textarea
                    rows={2}
                    value={formData.remainingWork || ''}
                    onChange={(e) => setFormData({ ...formData, remainingWork: e.target.value })}
                    className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-indigo-200 mb-1">다음 조치</label>
                  <textarea
                    rows={2}
                    value={formData.nextStep || ''}
                    onChange={(e) => setFormData({ ...formData, nextStep: e.target.value })}
                    className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-rose-300 mb-1">주의사항 및 위험요소</label>
                <textarea
                  rows={2}
                  value={formData.cautions || ''}
                  onChange={(e) => setFormData({ ...formData, cautions: e.target.value })}
                  className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-rose-500/40 focus:border-rose-400 focus:outline-hidden"
                />
              </div>
            </>
          )}

          {itemType === 'stakeholder' && (
            <>
              <div>
                <label className="block font-bold text-indigo-200 mb-1">기관 / 부서 / 역할명</label>
                <input
                  type="text"
                  value={formData.nameOrOrg || ''}
                  onChange={(e) => setFormData({ ...formData, nameOrOrg: e.target.value })}
                  className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-indigo-200 mb-1">협의 목적</label>
                <input
                  type="text"
                  value={formData.purpose || ''}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-indigo-200 mb-1">협의 시점</label>
                  <input
                    type="text"
                    value={formData.timingOrTask || ''}
                    onChange={(e) => setFormData({ ...formData, timingOrTask: e.target.value })}
                    className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-indigo-200 mb-1">연락처</label>
                  <input
                    type="text"
                    value={formData.contactInfo || ''}
                    onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                    className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
                  />
                </div>
              </div>
            </>
          )}

          {itemType === 'conflict' && (
            <>
              <div>
                <label className="block font-bold text-indigo-200 mb-1">상충 주제</label>
                <input
                  type="text"
                  value={formData.topic || ''}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-bold text-indigo-200 mb-1">
                  전임자 최종 결정 및 조치 메모
                </label>
                <textarea
                  rows={3}
                  value={formData.resolutionNote || ''}
                  onChange={(e) => setFormData({ ...formData, resolutionNote: e.target.value })}
                  className="neu-inset w-full text-xs px-3.5 py-2.5 rounded-xl text-white border border-[#2b3a9e]/40 focus:border-cyan-400 focus:outline-hidden"
                />
              </div>
            </>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#243387]/50 flex items-center justify-between">
            <span className="text-[11px] text-indigo-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              출처 연결 메타데이터는 유지됩니다.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="neu-card-sm px-4 py-2 text-indigo-200 hover:text-white rounded-xl font-medium border border-[#2b3a9e]/40"
              >
                취소
              </button>
              <button
                type="submit"
                className="neu-pill-active px-5 py-2 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.5)] cursor-pointer"
              >
                <Save className="w-4 h-4" />
                수정사항 반영
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
