export type ItemStatus = 'AI 초안' | '검토 중' | '확인 필요' | '검토 완료';
export type ConfidenceLevel = '근거 충분' | '일부 근거' | '근거 부족';

export interface SourceReference {
  sourceId: string;
  fileName: string;
  fileType: string;
  location: string; // e.g. "3쪽", "2문단", "일정표 시트 (12행)", "14행", "상세 위치 확인 불가"
  excerpt: string; // Verbatim quoted snippet
}

export interface DocumentChunk {
  sourceId: string;
  fileName: string;
  fileType: string;
  location: string;
  text: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: 'pdf' | 'docx' | 'xlsx' | 'csv' | 'txt' | 'unsupported';
  status: 'pending' | 'parsing' | 'success' | 'error';
  charCount: number;
  chunkCount: number;
  errorMessage?: string;
  warning?: string;
  chunks: DocumentChunk[];
  isDemo?: boolean;
}

export interface WorkItem {
  id: string;
  title: string;
  purpose: string;
  frequency: string; // '정기 (월별)', '비정기', '수시', '확인 필요'
  role: string;
  procedure: string[];
  nextActions: string[];
  status: ItemStatus;
  confidence: ConfidenceLevel;
  sources: SourceReference[];
  needsReview: boolean;
  reviewNote: string;
  isUserModified?: boolean;
}

export interface ScheduleItem {
  id: string;
  timing: string; // e.g. '매월 25일', '상반기(6월)', '수시'
  task: string;
  deadline: string; // Exact date or '자료에서 확인되지 않음'
  preparation: string;
  followUp: string;
  status: ItemStatus;
  confidence: ConfidenceLevel;
  sources: SourceReference[];
  needsReview: boolean;
  reviewNote: string;
  isUserModified?: boolean;
}

export interface OngoingIssue {
  id: string;
  title: string;
  currentStatus: string;
  history: string;
  remainingWork: string;
  nextStep: string;
  cautions: string;
  status: ItemStatus;
  confidence: ConfidenceLevel;
  sources: SourceReference[];
  needsReview: boolean;
  reviewNote: string;
  isUserModified?: boolean;
}

export interface Stakeholder {
  id: string;
  nameOrOrg: string;
  purpose: string;
  timingOrTask: string;
  contactInfo: string;
  status: ItemStatus;
  confidence: ConfidenceLevel;
  sources: SourceReference[];
  needsReview: boolean;
  reviewNote: string;
  isUserModified?: boolean;
}

export interface ReferenceDoc {
  id: string;
  docTitle: string;
  relatedWork: string;
  locationOrLink: string;
  status: ItemStatus;
  sources: SourceReference[];
  needsReview: boolean;
  reviewNote?: string;
  isUserModified?: boolean;
}

export interface ConflictItem {
  id: string;
  topic: string;
  description: string;
  optionA: {
    content: string;
    source: SourceReference;
  };
  optionB: {
    content: string;
    source: SourceReference;
  };
  status: ItemStatus;
  resolutionNote: string;
  isUserModified?: boolean;
}

export interface MissingInformationItem {
  id: string;
  category: string;
  item: string;
  reason: string;
  suggestedAction: string;
  status: ItemStatus;
  isUserModified?: boolean;
}

export interface HandoverSummary {
  purpose: string;
  coreTasks: string[];
  immediatePriorities: string[];
  overallNotes: string;
}

export interface HandoverDraft {
  id: string;
  title: string;
  department: string;
  predecessor: string;
  successor: string;
  createdAt: string;
  updatedAt: string;
  summary: HandoverSummary;
  workItems: WorkItem[];
  schedule: ScheduleItem[];
  ongoingIssues: OngoingIssue[];
  stakeholders: Stakeholder[];
  references: ReferenceDoc[];
  conflicts: ConflictItem[];
  missingInformation: MissingInformationItem[];
  isFullyReviewed: boolean;
  generationSourceCount: number;
}
