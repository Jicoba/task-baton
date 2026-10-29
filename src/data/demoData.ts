import { DocumentChunk, HandoverDraft, UploadedDocument } from '../types/handover';

export const DEMO_DOCUMENTS: UploadedDocument[] = [
  {
    id: 'demo-doc-1',
    name: '2026_스마트행정혁신_추진계획.docx',
    size: 245760,
    type: 'docx',
    status: 'success',
    charCount: 3840,
    chunkCount: 8,
    isDemo: true,
    chunks: [
      {
        sourceId: 'chunk-1-1',
        fileName: '2026_스마트행정혁신_추진계획.docx',
        fileType: 'docx',
        location: '제1장 총칙 > 1. 추진 배경 (1문단)',
        text: '본 계획은 2026년도 행정안전 혁신 추진 지침에 의거하여, 디지털 기반의 대민 행정서비스 고도화 및 부서 간 데이터 연계망 구축을 목적으로 한다. 담당 부서는 디지털혁신과이며 총괄 책임자는 혁신기획팀장이다.'
      },
      {
        sourceId: 'chunk-1-2',
        fileName: '2026_스마트행정혁신_추진계획.docx',
        fileType: 'docx',
        location: '제2장 핵심 과제 > 과제 1 (3문단)',
        text: '월별 실적 취합 및 보고: 매월 25일까지 각 실·과별 디지털 혁신 추진 실적을 종합행정포털을 통해 취합하고, 익월 5일까지 시도합동평가 지표 연계 보고서를 작성하여 부단체장 결재를 득한다.'
      },
      {
        sourceId: 'chunk-1-3',
        fileName: '2026_스마트행정혁신_추진계획.docx',
        fileType: 'docx',
        location: '제2장 핵심 과제 > 과제 2 (5문단)',
        text: '연간 계획 수립 및 평가: 매년 11월 차년도 중점 과제 수요조사를 실시하고, 12월 말까지 본예산 연계 사업계획서를 확정한다. 중간 점검은 상반기 종료 시점인 6월 말 실시한다.'
      },
      {
        sourceId: 'chunk-1-4',
        fileName: '2026_스마트행정혁신_추진계획.docx',
        fileType: 'docx',
        location: '제3장 협의체 운영 (8문단)',
        text: '관련 부서 실무협의회는 분기별 1회(3월, 6월, 9월, 12월 셋째 주 수요일) 개최를 원칙으로 하며, 기획예산과 및 정보통신과 담당자와 정례 안건을 사전 조율해야 한다.'
      },
      {
        sourceId: 'chunk-1-5',
        fileName: '2026_스마트행정혁신_추진계획.docx',
        fileType: 'docx',
        location: '제4장 예산 집행 계획 (11문단)',
        text: '차세대 행정시스템 연계 솔루션 라이선스 비용 총 1억 2천만 원은 상반기 조기집행 대상(60% 이상)으로 편성되어 있으며, 1차 기성금 지급은 5월 31일 이전 완료되어야 한다.'
      }
    ]
  },
  {
    id: 'demo-doc-2',
    name: '주간업무보고_및_현안관리카드.pdf',
    size: 512000,
    type: 'pdf',
    status: 'success',
    charCount: 2950,
    chunkCount: 5,
    isDemo: true,
    chunks: [
      {
        sourceId: 'chunk-2-1',
        fileName: '주간업무보고_및_현안관리카드.pdf',
        fileType: 'pdf',
        location: '1쪽 [상단]',
        text: '[주요 현안] 온프레미스 레거시 행정망과 클라우드 연계망 간 SSL 인증서 갱신 및 보안성 검토 지연. 국가정보자원관리원과의 방화벽 정책 협의가 지연되어 2차 데이터 마이그레이션이 2주간 순연됨.'
      },
      {
        sourceId: 'chunk-2-2',
        fileName: '주간업무보고_및_현안관리카드.pdf',
        fileType: 'pdf',
        location: '2쪽 [진행 현황 및 잔여 작업]',
        text: '현재 암호화 모듈 검증(KCMVP) 인증 확인 단계에 도달하였으며, 남은 조치는 한국지역정보개발원(KLID) 기술지원팀과의 합동 패킷 테스트이다. 다음 조치로 11월 둘째 주 현장 보안감사를 수검할 예정이다.'
      },
      {
        sourceId: 'chunk-2-3',
        fileName: '주간업무보고_및_현안관리카드.pdf',
        fileType: 'pdf',
        location: '2쪽 [주의사항 및 리스크]',
        text: '주의사항: 보안감사 미통과 시 행정업무망 연계 포트가 차단될 수 있으므로, 감사 3일 전까지 테스트 로그 및 망연계 결재문서 일체를 보안담당관에게 제출해야 함. (담당자: 가상 인물 김주무관)'
      },
      {
        sourceId: 'chunk-2-4',
        fileName: '주간업무보고_및_현안관리카드.pdf',
        fileType: 'pdf',
        location: '3쪽 [특이사항]',
        text: '보안감사 예정일정: 당초 10월 28일에서 11월 12일로 변경 합의됨. (시스템 일정표와 상이할 수 있으므로 최종 공문 확인 필수)'
      }
    ]
  },
  {
    id: 'demo-doc-3',
    name: '2026_상반기_부서_업무일정표.xlsx',
    size: 118784,
    type: 'xlsx',
    status: 'success',
    charCount: 1820,
    chunkCount: 4,
    isDemo: true,
    chunks: [
      {
        sourceId: 'chunk-3-1',
        fileName: '2026_상반기_부서_업무일정표.xlsx',
        fileType: 'xlsx',
        location: '정기업무 시트 (3~6행)',
        text: '구분: 월간 | 업무명: 실적 취합 및 지표 보고 | 마감일: 매월 25일 | 사전 준비: 취합 서식 배포(매월 20일) | 후속 조치: 부단체장 보고서 등록 및 내부결재 | 담당: 디지털혁신담당'
      },
      {
        sourceId: 'chunk-3-2',
        fileName: '2026_상반기_부서_업무일정표.xlsx',
        fileType: 'xlsx',
        location: '정기업무 시트 (8~10행)',
        text: '구분: 분기 | 업무명: 실무협의회 안건 상정 | 마감일: 분기 말월 셋째 주 | 사전 준비: 안건 취합 및 회의실 예약 | 후속 조치: 회의록 작성 및 공람'
      },
      {
        sourceId: 'chunk-3-3',
        fileName: '2026_상반기_부서_업무일정표.xlsx',
        fileType: 'xlsx',
        location: '프로젝트일정 시트 (14행)',
        text: '과제명: 클라우드 연계망 현장 보안감사 수검 | 마감일: 2026년 10월 28일 (감사원/보안담당관실 합동) | 비고: 사전 모의점검 완료 요망'
      }
    ]
  },
  {
    id: 'demo-doc-4',
    name: '유관기관_협조처_연락망_및_근거규정.csv',
    size: 65536,
    type: 'csv',
    status: 'success',
    charCount: 1420,
    chunkCount: 3,
    isDemo: true,
    chunks: [
      {
        sourceId: 'chunk-4-1',
        fileName: '유관기관_협조처_연락망_및_근거규정.csv',
        fileType: 'csv',
        location: '2행',
        text: '기관명: 한국지역정보개발원(KLID) 기술지원단 | 협의목적: 클라우드 연계모듈 및 SSL 인증서 갱신 기술지원 | 협의시점: 수시 및 패킷 테스트 시 | 담당창구: 가상 기술지원데스크 (내선 9870, 이메일 tech@klid.mock.kr)'
      },
      {
        sourceId: 'chunk-4-2',
        fileName: '유관기관_협조처_연락망_및_근거규정.csv',
        fileType: 'csv',
        location: '3행',
        text: '기관명: 기획예산과 예산팀 | 협의목적: 스마트혁신과제 상반기 신속집행 실적 및 라이선스 대금 지급 품의 | 협의시점: 매월 10일 전후 | 비고: 조기집행 목표율(60%) 점검'
      },
      {
        sourceId: 'chunk-4-3',
        fileName: '유관기관_협조처_연락망_및_근거규정.csv',
        fileType: 'csv',
        location: '4행',
        text: '관련근거: 「전자정부법」 제35조(행정정보의 공동이용), 「지능정보화 기본법」 제11조 및 「공공기록물 관리에 관한 법률 시행령」 제20조 | 적용업무: 데이터 연계망 구축 및 감사 증빙 문서 보존 의무'
      }
    ]
  }
];

export const DEMO_HANDOVER_DRAFT: HandoverDraft = {
  id: 'handover-demo-2026',
  title: '디지털혁신과 행정혁신·데이터연계망 인수인계서',
  department: '디지털혁신과 혁신기획팀',
  predecessor: '홍길동 주무관 (가상 인물)',
  successor: '이몽룡 주무관 (가상 인물)',
  createdAt: '2026-10-28 14:30',
  updatedAt: '2026-10-28 15:45',
  generationSourceCount: 4,
  isFullyReviewed: false,
  summary: {
    purpose: '디지털 기반 대민 행정서비스 고도화 및 온프레미스·클라우드 간 행정데이터 연계망 구축의 연속성 확보',
    coreTasks: [
      '월별 디지털 혁신 실적 취합 및 시도합동평가 지표 보고',
      '차년도 스마트행정혁신 중점 추진계획 수립 및 본예산 편성',
      '상반기 조기집행(총 1.2억 원 규모 라이선스 대금) 예산 관리',
      '온프레미스 레거시-클라우드 연계망 현장 보안감사 수검 및 KCMVP 인증'
    ],
    immediatePriorities: [
      '현장 보안감사 일정 상충 확인(10월 28일 vs 11월 12일 공문 재확인 필수)',
      '감사 3일 전 테스트 로그 및 망연계 결재문서 보안담당관실 사전 제출',
      '매월 20일 실적 취합 서식 배포 및 25일 취합 마감 관리'
    ],
    overallNotes: '※ 본 초안은 4개 등록 자료(DOCX, PDF, XLSX, CSV)를 바탕으로 생성된 가상 시연용 데이터입니다. 실제 인물이나 공공기관 정보가 아니며, 검토 후 수정사항은 세션 메모리에 보존됩니다.'
  },
  workItems: [
    {
      id: 'work-001',
      title: '월별 디지털 혁신 실적 취합 및 평가 보고',
      purpose: '실·과별 추진 실적을 통합 집계하고 시도합동평가 지표와 연계하여 부단체장 결재 및 대외 보고 완료',
      frequency: '정기 (매월)',
      role: '디지털혁신과 담당 주무관',
      procedure: [
        '매월 20일: 종합행정포털을 통해 부서별 실적 취합 서식 배포',
        '매월 25일: 각 실·과 제출 실적 취합 및 누락 부서 독려',
        '익월 5일: 시도합동평가 지표 연계 분석보고서 작성 및 부단체장 결재'
      ],
      nextActions: [
        '당월 취합 미제출 2개 부서(교통과, 환경과) 추가 독려 요망',
        '익월 보고서 템플릿 최신 평가지표 서식 반영 여부 확인'
      ],
      status: 'AI 초안',
      confidence: '근거 충분',
      sources: [
        {
          sourceId: 'chunk-1-2',
          fileName: '2026_스마트행정혁신_추진계획.docx',
          fileType: 'docx',
          location: '제2장 핵심 과제 > 과제 1 (3문단)',
          excerpt: '월별 실적 취합 및 보고: 매월 25일까지 각 실·과별 디지털 혁신 추진 실적을 종합행정포털을 통해 취합하고, 익월 5일까지 시도합동평가 지표 연계 보고서를 작성하여 부단체장 결재를 득한다.'
        },
        {
          sourceId: 'chunk-3-1',
          fileName: '2026_상반기_부서_업무일정표.xlsx',
          fileType: 'xlsx',
          location: '정기업무 시트 (3~6행)',
          excerpt: '구분: 월간 | 업무명: 실적 취합 및 지표 보고 | 마감일: 매월 25일 | 사전 준비: 취합 서식 배포(매월 20일)'
        }
      ],
      needsReview: false,
      reviewNote: '절차 및 일정이 두 문서(DOCX, XLSX)에서 일치함.'
    },
    {
      id: 'work-002',
      title: '연간 스마트행정혁신 추진계획 수립 및 중간점검',
      purpose: '차년도 중점 혁신 과제 수요조사 및 본예산 연계 사업계획서 확정',
      frequency: '정기 (연간 / 반기)',
      role: '혁신기획팀 총괄 및 주무관',
      procedure: [
        '6월 말: 상반기 추진과제 중간 점검 및 부진사업 개선대책 수립',
        '11월: 전 부서 대상 차년도 중점 과제 수요조사 실시',
        '12월 말: 기획예산과 협의 후 본예산 연계 사업계획서 최종 확정'
      ],
      nextActions: [
        '6월 말 중간점검 결과보고서 서식 사전 점검',
        '기획예산과 예산심의 일정 사전 통보 요청'
      ],
      status: 'AI 초안',
      confidence: '근거 충분',
      sources: [
        {
          sourceId: 'chunk-1-3',
          fileName: '2026_스마트행정혁신_추진계획.docx',
          fileType: 'docx',
          location: '제2장 핵심 과제 > 과제 2 (5문단)',
          excerpt: '매년 11월 차년도 중점 과제 수요조사를 실시하고, 12월 말까지 본예산 연계 사업계획서를 확정한다. 중간 점검은 상반기 종료 시점인 6월 말 실시한다.'
        }
      ],
      needsReview: false,
      reviewNote: '추진계획 원문에 근거함.'
    },
    {
      id: 'work-003',
      title: '분기별 실무협의회 안건 상정 및 운영',
      purpose: '기획예산과, 정보통신과 등 유관 부서 간 정례 안건 협의 및 정책 조율',
      frequency: '정기 (분기별 1회)',
      role: '실무협의회 간사 (담당 주무관)',
      procedure: [
        '분기 말월 1주 전: 안건 사전 취합 및 회의실 예약',
        '분기 말월 셋째 주 수요일: 회의 주재 및 협의 진행',
        '회의 종료 후 3일 이내: 회의록 작성 및 내부결재 공람'
      ],
      nextActions: [
        '차기 2분기 협의회 일정(6월 셋째 주) 안건 공문 발송'
      ],
      status: 'AI 초안',
      confidence: '근거 충분',
      sources: [
        {
          sourceId: 'chunk-1-4',
          fileName: '2026_스마트행정혁신_추진계획.docx',
          fileType: 'docx',
          location: '제3장 협의체 운영 (8문단)',
          excerpt: '관련 부서 실무협의회는 분기별 1회(3월, 6월, 9월, 12월 셋째 주 수요일) 개최를 원칙으로 하며...'
        },
        {
          sourceId: 'chunk-3-2',
          fileName: '2026_상반기_부서_업무일정표.xlsx',
          fileType: 'xlsx',
          location: '정기업무 시트 (8~10행)',
          excerpt: '구분: 분기 | 업무명: 실무협의회 안건 상정 | 마감일: 분기 말월 셋째 주'
        }
      ],
      needsReview: false,
      reviewNote: '협의체 일정 및 준비 절차 확인 완료.'
    },
    {
      id: 'work-004',
      title: '행정시스템 연계 솔루션 라이선스 예산 조기집행 관리',
      purpose: '상반기 조기집행 목표 달성 및 솔루션 기성금 지급 품의',
      frequency: '비정기 / 특정 시기 집중',
      role: '예산 집행 실무자',
      procedure: [
        '5월 중순: 솔루션 납품 검수조서 작성 및 정보통신과 기술확인',
        '5월 31일 이전: 1차 기성금(총 1.2억 원 중 60% 이상) 지급 품의 완료',
        '매월 10일 전후: 기획예산과 예산팀에 조기집행 추진실적 제출'
      ],
      nextActions: [
        '1차 기성금 세금계산서 청구 일정 업체와 사전 협의 필요',
        '검수위원(2인 이상) 내부 결재 기안'
      ],
      status: '검토 중',
      confidence: '일부 근거',
      sources: [
        {
          sourceId: 'chunk-1-5',
          fileName: '2026_스마트행정혁신_추진계획.docx',
          fileType: 'docx',
          location: '제4장 예산 집행 계획 (11문단)',
          excerpt: '차세대 행정시스템 연계 솔루션 라이선스 비용 총 1억 2천만 원은 상반기 조기집행 대상(60% 이상)으로 편성되어 있으며, 1차 기성금 지급은 5월 31일 이전 완료되어야 한다.'
        },
        {
          sourceId: 'chunk-4-2',
          fileName: '유관기관_협조처_연락망_및_근거규정.csv',
          fileType: 'csv',
          location: '3행',
          excerpt: '기관명: 기획예산과 예산팀 | 협의목적: 스마트혁신과제 상반기 신속집행 실적 및 라이선스 대금 지급 품의 | 협의시점: 매월 10일 전후'
        }
      ],
      needsReview: true,
      reviewNote: '검수위원 구성 세부 규정 및 업체 계좌정보는 자료에 명시되지 않아 전임자 추가 확인 필요.'
    }
  ],
  schedule: [
    {
      id: 'sched-001',
      timing: '매월 20일 ~ 25일',
      task: '월별 디지털 혁신 실적 취합',
      deadline: '매월 25일 18:00',
      preparation: '종합행정포털 공지 및 부서별 서식 사전 배포',
      followUp: '미제출 부서 유선 독려 및 통계 검증',
      status: 'AI 초안',
      confidence: '근거 충분',
      sources: [
        {
          sourceId: 'chunk-1-2',
          fileName: '2026_스마트행정혁신_추진계획.docx',
          fileType: 'docx',
          location: '과제 1 (3문단)',
          excerpt: '매월 25일까지 각 실·과별 디지털 혁신 추진 실적을 종합행정포털을 통해 취합하고'
        }
      ],
      needsReview: false,
      reviewNote: '정기 일정'
    },
    {
      id: 'sched-002',
      timing: '익월 5일',
      task: '시도합동평가 연계 분석보고서 부단체장 결재',
      deadline: '익월 5일 (공휴일인 경우 익일)',
      preparation: '통계 수치 교차검증 및 전월 대비 증감 분석표 첨부',
      followUp: '시도 주관부서 시스템 실적 업로드',
      status: 'AI 초안',
      confidence: '근거 충분',
      sources: [
        {
          sourceId: 'chunk-1-2',
          fileName: '2026_스마트행정혁신_추진계획.docx',
          fileType: 'docx',
          location: '과제 1 (3문단)',
          excerpt: '익월 5일까지 시도합동평가 지표 연계 보고서를 작성하여 부단체장 결재를 득한다.'
        }
      ],
      needsReview: false,
      reviewNote: '결재선 확인 완료'
    },
    {
      id: 'sched-003',
      timing: '5월 31일 이전',
      task: '연계 솔루션 라이선스 1차 기성금 지급',
      deadline: '5월 31일',
      preparation: '납품 검수조서 확인 및 세금계산서 청구 접수',
      followUp: '지출결의서 발송 및 조기집행 실적 통보',
      status: 'AI 초안',
      confidence: '근거 충분',
      sources: [
        {
          sourceId: 'chunk-1-5',
          fileName: '2026_스마트행정혁신_추진계획.docx',
          fileType: 'docx',
          location: '11문단',
          excerpt: '1차 기성금 지급은 5월 31일 이전 완료되어야 한다.'
        }
      ],
      needsReview: false,
      reviewNote: '상반기 조기집행 대상'
    },
    {
      id: 'sched-004',
      timing: '10월 28일 vs 11월 12일 [상충]',
      task: '클라우드 연계망 합동 현장 보안감사 수검',
      deadline: '자료 간 상충 (확인 필요)',
      preparation: '감사 3일 전 테스트 로그 및 망연계 결재문서 일체 제출',
      followUp: '감사 지적사항 조치계획서 작성 및 7일 이내 제출',
      status: '확인 필요',
      confidence: '일부 근거',
      sources: [
        {
          sourceId: 'chunk-2-4',
          fileName: '주간업무보고_및_현안관리카드.pdf',
          fileType: 'pdf',
          location: '3쪽 [특이사항]',
          excerpt: '보안감사 예정일정: 당초 10월 28일에서 11월 12일로 변경 합의됨.'
        },
        {
          sourceId: 'chunk-3-3',
          fileName: '2026_상반기_부서_업무일정표.xlsx',
          fileType: 'xlsx',
          location: '프로젝트일정 시트 (14행)',
          excerpt: '과제명: 클라우드 연계망 현장 보안감사 수검 | 마감일: 2026년 10월 28일'
        }
      ],
      needsReview: true,
      reviewNote: '일정표(XLSX)와 주간보고(PDF)의 일정이 상충하므로 공문 발송본을 반드시 확인해야 함.'
    }
  ],
  ongoingIssues: [
    {
      id: 'issue-001',
      title: '온프레미스 레거시 행정망-클라우드 간 데이터 연계망 보안감사 및 KCMVP 인증',
      currentStatus: 'SSL 인증서 갱신 완료 및 암호화 모듈(KCMVP) 인증 확인 단계 도달. 다만 국가정보자원관리원 방화벽 정책 협의 지연으로 전체 일정이 2주 순연됨.',
      history: '레거시 연계 포트 오픈 요청 -> 방화벽 심의 지연 -> 패킷 암호화 모듈 추가 요구 발생 -> KCMVP 인증 모듈 탑재 완료',
      remainingWork: '한국지역정보개발원(KLID) 기술지원팀과의 합동 패킷 테스트 및 방화벽 통과 로그 확보',
      nextStep: '보안감사 3일 전까지 테스트 로그 및 망연계 결재문서 일체를 보안담당관에게 제출',
      cautions: '보안감사 미통과 시 행정업무망 연계 포트가 즉시 차단될 수 있으므로, 감사관 질의응답 대응 시트 사전 준비 필수',
      status: '확인 필요',
      confidence: '근거 충분',
      sources: [
        {
          sourceId: 'chunk-2-1',
          fileName: '주간업무보고_및_현안관리카드.pdf',
          fileType: 'pdf',
          location: '1쪽 [상단]',
          excerpt: '온프레미스 레거시 행정망과 클라우드 연계망 간 SSL 인증서 갱신 및 보안성 검토 지연... 2차 데이터 마이그레이션이 2주간 순연됨.'
        },
        {
          sourceId: 'chunk-2-3',
          fileName: '주간업무보고_및_현안관리카드.pdf',
          fileType: 'pdf',
          location: '2쪽 [주의사항 및 리스크]',
          excerpt: '주의사항: 보안감사 미통과 시 행정업무망 연계 포트가 차단될 수 있으므로, 감사 3일 전까지 테스트 로그 및 망연계 결재문서 일체를 보안담당관에게 제출해야 함.'
        }
      ],
      needsReview: true,
      reviewNote: '가장 시급한 현안 과제로, 후임자가 가장 먼저 점검해야 할 사항임.'
    }
  ],
  stakeholders: [
    {
      id: 'stake-001',
      nameOrOrg: '한국지역정보개발원(KLID) 기술지원단',
      purpose: '클라우드 연계모듈 패킷 검증 및 SSL 인증서 갱신 기술지원',
      timingOrTask: '합동 패킷 테스트 시 및 시스템 오류 발생 시',
      contactInfo: '가상 기술지원데스크 (내선 9870, 이메일 tech@klid.mock.kr)',
      status: 'AI 초안',
      confidence: '근거 충분',
      sources: [
        {
          sourceId: 'chunk-4-1',
          fileName: '유관기관_협조처_연락망_및_근거규정.csv',
          fileType: 'csv',
          location: '2행',
          excerpt: '한국지역정보개발원(KLID) 기술지원단 | 협의목적: 클라우드 연계모듈 및 SSL 인증서 갱신 기술지원 | 내선 9870, 이메일 tech@klid.mock.kr'
        }
      ],
      needsReview: false,
      reviewNote: 'CSV 자료에 연락처 명시됨'
    },
    {
      id: 'stake-002',
      nameOrOrg: '기획예산과 예산팀',
      purpose: '스마트혁신과제 상반기 신속집행 실적 제출 및 라이선스 기성금 품의 협의',
      timingOrTask: '매월 10일 전후 및 5월 기성금 지급 시점',
      contactInfo: '자료에서 확인되지 않음 (전임자 확인 필요)',
      status: '확인 필요',
      confidence: '일부 근거',
      sources: [
        {
          sourceId: 'chunk-4-2',
          fileName: '유관기관_협조처_연락망_및_근거규정.csv',
          fileType: 'csv',
          location: '3행',
          excerpt: '기획예산과 예산팀 | 협의목적: 스마트혁신과제 상반기 신속집행 실적 및 라이선스 대금 지급 품의'
        }
      ],
      needsReview: true,
      reviewNote: '예산팀 담당 주무관 성명 및 내선번호 확인 필요'
    },
    {
      id: 'stake-003',
      nameOrOrg: '국가정보자원관리원 방화벽 운영팀',
      purpose: '망연계 포트 허용 정책 및 방화벽 통과 승인',
      timingOrTask: '보안감사 전 망연계 포트 정책 협의',
      contactInfo: '자료에서 확인되지 않음 (전임자 확인 필요)',
      status: '확인 필요',
      confidence: '일부 근거',
      sources: [
        {
          sourceId: 'chunk-2-1',
          fileName: '주간업무보고_및_현안관리카드.pdf',
          fileType: 'pdf',
          location: '1쪽 [상단]',
          excerpt: '국가정보자원관리원과의 방화벽 정책 협의가 지연되어 2차 데이터 마이그레이션이 2주간 순연됨.'
        }
      ],
      needsReview: true,
      reviewNote: '업무보고서에 기관명만 존재하며 담당자 연락처 누락됨'
    }
  ],
  references: [
    {
      id: 'ref-001',
      docTitle: '「전자정부법」 제35조 (행정정보의 공동이용)',
      relatedWork: '부서 간 데이터 연계망 구축 및 대외 행정데이터 공유 근거',
      locationOrLink: '국가법령정보센터 / CSV 4행 참조',
      status: 'AI 초안',
      sources: [
        {
          sourceId: 'chunk-4-3',
          fileName: '유관기관_협조처_연락망_및_근거규정.csv',
          fileType: 'csv',
          location: '4행',
          excerpt: '관련근거: 「전자정부법」 제35조(행정정보의 공동이용), 「지능정보화 기본법」 제11조 및 「공공기록물 관리에 관한 법률 시행령」 제20조'
        }
      ],
      needsReview: false
    },
    {
      id: 'ref-002',
      docTitle: '2026년도 행정안전 혁신 추진 지침',
      relatedWork: '연간 스마트행정혁신 중점 추진계획 수립 지침',
      locationOrLink: '2026_스마트행정혁신_추진계획.docx 1문단',
      status: 'AI 초안',
      sources: [
        {
          sourceId: 'chunk-1-1',
          fileName: '2026_스마트행정혁신_추진계획.docx',
          fileType: 'docx',
          location: '제1장 총칙 > 1. 추진 배경 (1문단)',
          excerpt: '2026년도 행정안전 혁신 추진 지침에 의거하여...'
        }
      ],
      needsReview: false
    }
  ],
  conflicts: [
    {
      id: 'conf-001',
      topic: '클라우드 연계망 합동 현장 보안감사 수검 일정 불일치',
      description: '부서 업무일정표(XLSX)에는 보안감사 수검일이 2026년 10월 28일로 기재되어 있으나, 주간업무보고(PDF)에는 당초 10월 28일에서 11월 12일로 변경 합의되었다고 기술되어 있음.',
      optionA: {
        content: '마감일: 2026년 10월 28일 (감사원/보안담당관실 합동)',
        source: {
          sourceId: 'chunk-3-3',
          fileName: '2026_상반기_부서_업무일정표.xlsx',
          fileType: 'xlsx',
          location: '프로젝트일정 시트 (14행)',
          excerpt: '과제명: 클라우드 연계망 현장 보안감사 수검 | 마감일: 2026년 10월 28일'
        }
      },
      optionB: {
        content: '보안감사 예정일정: 당초 10월 28일에서 11월 12일로 변경 합의됨',
        source: {
          sourceId: 'chunk-2-4',
          fileName: '주간업무보고_및_현안관리카드.pdf',
          fileType: 'pdf',
          location: '3쪽 [특이사항]',
          excerpt: '보안감사 예정일정: 당초 10월 28일에서 11월 12일로 변경 합의됨. (시스템 일정표와 상이할 수 있으므로 최종 공문 확인 필수)'
        }
      },
      status: '확인 필요',
      resolutionNote: '전임자 확인 필요: 최종 시행된 감사일정 변경 공문 수신번호를 확인하여 후임자에게 안내 요망.'
    }
  ],
  missingInformation: [
    {
      id: 'miss-001',
      category: '일정 및 담당자 불명',
      item: '국가정보자원관리원 방화벽 운영팀 담당자 정보',
      reason: '주간업무보고서에 협의 지연 사실만 기술되어 있고 담당 부서 직통 내선 및 담당관 성명이 기재되지 않음',
      suggestedAction: '방화벽 정책 신청 공문 문서번호 및 담당 주무관 연락처를 인수인계 비고란에 추가 작성 요망',
      status: '확인 필요'
    },
    {
      id: 'miss-002',
      category: '절차 누락',
      item: '라이선스 기성금 검수위원회 구성 규정',
      reason: '1.2억 원 규모 라이선스 대금 지급을 위한 검수위원(2인 이상) 위촉 절차 및 서식이 문서에 미포함됨',
      suggestedAction: '기존 과년도 검수조서 기안문 예시(문서번호)를 참고자료 목록에 링크 필요',
      status: '확인 필요'
    }
  ]
};
