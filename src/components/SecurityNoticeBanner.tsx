import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, X, ChevronDown, ChevronUp, Lock } from 'lucide-react';

interface SecurityNoticeBannerProps {
  onAcknowledge?: () => void;
}

export const SecurityNoticeBanner: React.FC<SecurityNoticeBannerProps> = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="neu-card rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 border border-amber-500/30 bg-gradient-to-r from-[#171e54] via-[#151c4d] to-[#1a1c4a] shadow-[0_0_20px_rgba(245,158,11,0.08)]">
      <div className="flex items-start justify-between gap-3 text-xs text-amber-200">
        <div className="flex items-start gap-2.5 flex-1">
          <div className="p-1.5 rounded-lg neu-inset text-amber-400 mt-0.5 shrink-0">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="space-y-1 w-full">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-amber-300 tracking-wide">
                [보안 및 개인정보 유의사항]
              </span>
              <span className="text-indigo-200/90">
                시제품(PoC) 환경으로 개인정보·비공개 비밀문서의 직접 입력을 엄격히 금합니다.
              </span>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-cyan-400 hover:text-cyan-300 font-semibold underline inline-flex items-center gap-0.5 ml-1 transition-colors"
              >
                {isExpanded ? '간략히' : '전체 보안 지침 확인'}
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-[#2d3a8c]/60 grid grid-cols-1 md:grid-cols-3 gap-3 text-indigo-100">
                <div className="neu-inset p-3 rounded-xl border border-[#2b3a96]/40">
                  <div className="font-bold flex items-center gap-1.5 text-cyan-300 mb-1">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                    권장 시연 자료
                  </div>
                  <p className="text-[11px] leading-relaxed text-indigo-200/80">
                    공개 서식, 업무 추진계획 지침, 규정 등 민감정보가 없는 자료 또는 제공되는 <strong>「데모 데이터」</strong>를 활용하십시오.
                  </p>
                </div>

                <div className="neu-inset p-3 rounded-xl border border-rose-500/30">
                  <div className="font-bold flex items-center gap-1.5 text-rose-300 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    입력 금지 대상
                  </div>
                  <p className="text-[11px] leading-relaxed text-rose-200/80">
                    주민등록번호, 전화번호, 개인 인사평가, 대외비·비밀 업무자료, 시스템 계정 비밀번호는 등록하지 마십시오.
                  </p>
                </div>

                <div className="neu-inset p-3 rounded-xl border border-indigo-500/30">
                  <div className="font-bold flex items-center gap-1.5 text-indigo-300 mb-1">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    세션 메모리 처리
                  </div>
                  <p className="text-[11px] leading-relaxed text-indigo-200/80">
                    업로드된 파일 원본과 추출 텍스트는 브라우저 영구 저장소에 자동 저장되지 않으며, 세션 종료 시 안전하게 초기화됩니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-indigo-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          title="안내 숨기기"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const SecurityInfoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="neu-frame bg-[#101642] rounded-3xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto border border-[#2d3d99]/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between pb-3 border-b border-[#28388c]/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl neu-inset text-cyan-400">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                공공업무 시스템 보안 및 운영 가이드라인
              </h3>
              <p className="text-[11px] text-indigo-300">
                보안 안전성 및 데이터 처리 원칙
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

        <div className="mt-4 space-y-3.5 text-xs text-indigo-200/90 leading-relaxed">
          <div className="neu-inset p-3.5 rounded-2xl border border-[#26378a]/50">
            <h4 className="font-bold text-white mb-1 flex items-center gap-1.5 text-cyan-300">
              1. 시제품(PoC) 운영 원칙
            </h4>
            <p>
              본 시스템은 전임자의 업무 자료를 분석하여 인수인계서 초안을 자동으로 생성하고,
              원문 출처와 근거를 검증할 수 있도록 지원하는 공공업무 생산성 보조 도구입니다.
            </p>
          </div>

          <div className="neu-inset p-3.5 rounded-2xl border border-rose-500/30">
            <h4 className="font-bold text-rose-300 mb-1 flex items-center gap-1.5">
              2. 민감정보 및 개인정보 보호
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-rose-200/80">
              <li>실제 개인정보(주민등록번호, 연락처, 금융계좌 등)가 포함된 문서는 마스킹 또는 제거 후 등록해야 합니다.</li>
              <li>공공기관 보안업무규정상 비공개 또는 대외비 문서는 본 웹 시제품에 업로드할 수 없습니다.</li>
              <li>기능 테스트 시 상단의 <strong>[데모 데이터 불러오기]</strong> 기능을 권장합니다.</li>
            </ul>
          </div>

          <div className="neu-inset p-3.5 rounded-2xl border border-indigo-500/30">
            <h4 className="font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
              3. 파일 및 텍스트 데이터의 세션 관리
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-indigo-200/80">
              <li>사용자가 업로드한 원본 파일은 사용자 PC에서 읽기 전용으로 취급되며, 어떠한 경우에도 원본 파일을 수정·삭제하지 않습니다.</li>
              <li>텍스트 추출 데이터는 브라우저 영구 저장소에 남지 않으며, 현재 세션 메모리에서만 유지됩니다.</li>
              <li>검토가 완료된 인수인계 결과는 <strong>Markdown, JSON, CSV</strong> 파일로 직접 내보내기하여 안전하게 보관하십시오.</li>
            </ul>
          </div>

          <div className="neu-inset p-3.5 rounded-2xl border border-cyan-500/30">
            <h4 className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
              4. AI 모델 추론 및 신뢰성 검증
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-cyan-200/80">
              <li>AI는 반드시 등록된 문서에 명시된 내용을 우선 근거로 초안을 구조화합니다.</li>
              <li>자료에서 확인되지 않는 항목은 <strong>「자료에서 확인되지 않음」</strong> 또는 <strong>「전임자 확인 필요」</strong>로 명시됩니다.</li>
              <li>AI 초안은 참고용이며, 최종 확정은 반드시 전임자가 각 항목의 출처를 검토하고 [검토 완료]를 승인해야 합니다.</li>
            </ul>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="neu-pill-active px-5 py-2 text-white rounded-xl text-xs font-bold hover:opacity-95 transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)]"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
