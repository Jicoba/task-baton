import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SecurityNoticeBanner, SecurityInfoModal } from './components/SecurityNoticeBanner';
import { DocumentUploadSection } from './components/DocumentUploadSection';
import { HandoverWorkspace } from './components/HandoverWorkspace';
import { SourceDrawer } from './components/SourceDrawer';
import { EditItemModal } from './components/EditItemModal';
import { ExportModal } from './components/ExportModal';
import { ChunksPreviewModal } from './components/ChunksPreviewModal';
import { DEMO_DOCUMENTS, DEMO_HANDOVER_DRAFT } from './data/demoData';
import { parseUploadedFile } from './utils/fileParser';
import {
  HandoverDraft,
  SourceReference,
  UploadedDocument,
  DocumentChunk
} from './types/handover';
import { AlertCircle, Sparkles, FolderSync, Layers } from 'lucide-react';

export default function App() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [draft, setDraft] = useState<HandoverDraft | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Metadata
  const [department, setDepartment] = useState<string>('');
  const [predecessor, setPredecessor] = useState<string>('');
  const [successor, setSuccessor] = useState<string>('');
  const [customNotes, setCustomNotes] = useState<string>('');

  // Modals & Panels
  const [selectedSource, setSelectedSource] = useState<SourceReference | null>(null);
  const [isSourceDrawerOpen, setIsSourceDrawerOpen] = useState<boolean>(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [isChunksModalOpen, setIsChunksModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Edit item state
  const [editModalState, setEditModalState] = useState<{
    isOpen: boolean;
    type: 'work' | 'schedule' | 'issue' | 'stakeholder' | 'reference' | 'conflict' | 'missing';
    item: any;
  }>({
    isOpen: false,
    type: 'work',
    item: null
  });

  // Check health on mount
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .catch(err => console.warn('Backend health check notification:', err));
  }, []);

  // Compute all valid chunks across registered documents
  const allChunks: DocumentChunk[] = documents
    .filter(d => d.status === 'success')
    .flatMap(d => d.chunks);

  // Determine stage
  const getStage = (): 'empty' | 'analyzing' | 'review_needed' | 'completed' => {
    if (isGenerating) return 'analyzing';
    if (!draft) return 'empty';
    if (draft.isFullyReviewed) return 'completed';
    return 'review_needed';
  };

  // Compute unreviewed count
  const unreviewedCount = draft
    ? [
        ...draft.workItems,
        ...draft.schedule,
        ...draft.ongoingIssues,
        ...draft.stakeholders,
        ...draft.references,
        ...draft.conflicts
      ].filter(i => i.status !== '검토 완료').length
    : 0;

  // Load Demo Data
  const handleLoadDemo = () => {
    setDocuments(DEMO_DOCUMENTS);
    setDepartment('디지털혁신과 스마트기획팀');
    setPredecessor('홍길동 주무관 (가상 인물)');
    setSuccessor('이몽룡 주무관 (가상 인물)');
    setCustomNotes('상반기 조기집행 및 클라우드 연계망 보안감사 현안 중점');
    setDraft(DEMO_HANDOVER_DRAFT);
    setIsDemoActive(true);
    setGenerationError(null);
  };

  // Handle file uploads
  const handleFilesSelected = async (files: FileList | File[]) => {
    setIsDemoActive(false);
    setGenerationError(null);

    const fileArray = Array.from(files);
    const newDocs: UploadedDocument[] = [];

    for (const file of fileArray) {
      const parsed = await parseUploadedFile(file);
      newDocs.push(parsed);
    }

    setDocuments(prev => [...prev, ...newDocs]);
  };

  // Remove document from analysis
  const handleRemoveDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  // Run AI Handover Generation
  const handleGenerateDraft = async () => {
    if (allChunks.length === 0) {
      setGenerationError('분석 가능한 텍스트 조각이 없습니다. 유효한 PDF, DOCX, XLSX, CSV, TXT 파일을 먼저 등록해 주세요.');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/handover/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chunks: allChunks,
          department,
          predecessor,
          successor,
          userPrompt: customNotes
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'AI 인수인계 초안 생성 중 오류가 발생했습니다.');
      }

      setDraft(data.draft);
      setIsDemoActive(false);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Generation error:', err);
      setGenerationError(
        err.message || '인수인계 초안을 생성하는 중 서버 통신 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset workspace
  const handleReset = () => {
    if (documents.length > 0 || draft) {
      const confirmReset = window.confirm(
        '등록된 자료와 작성 중인 인수인계 초안이 세션 메모리에서 초기화됩니다. 계속하시겠습니까?'
      );
      if (!confirmReset) return;
    }
    setDocuments([]);
    setDraft(null);
    setIsDemoActive(false);
    setGenerationError(null);
    setDepartment('');
    setPredecessor('');
    setSuccessor('');
    setCustomNotes('');
  };

  // Open source panel
  const handleOpenSource = (source: SourceReference) => {
    setSelectedSource(source);
    setIsSourceDrawerOpen(true);
  };

  // Open Edit Item modal
  const handleEditItem = (
    type: 'work' | 'schedule' | 'issue' | 'stakeholder' | 'reference' | 'conflict' | 'missing',
    item: any
  ) => {
    setEditModalState({
      isOpen: true,
      type,
      item
    });
  };

  // Save edited item
  const handleSaveEditedItem = (updatedItem: any) => {
    if (!draft) return;

    const typeToKeyMap: Record<string, keyof HandoverDraft> = {
      work: 'workItems',
      schedule: 'schedule',
      issue: 'ongoingIssues',
      stakeholder: 'stakeholders',
      reference: 'references',
      conflict: 'conflicts',
      missing: 'missingInformation'
    };

    const targetKey = typeToKeyMap[editModalState.type];
    if (targetKey && Array.isArray(draft[targetKey])) {
      const updatedArray = (draft[targetKey] as any[]).map(item =>
        item.id === updatedItem.id ? updatedItem : item
      );

      setDraft({
        ...draft,
        [targetKey]: updatedArray,
        updatedAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#070a21] text-indigo-100 font-sans p-3 sm:p-5 lg:p-7 antialiased selection:bg-cyan-500/30 selection:text-white">
      {/* Outer Dashboard Bezel Frame matching reference tablet style */}
      <div className="max-w-[1600px] mx-auto neu-frame rounded-[2.5rem] p-4 sm:p-6 lg:p-8 relative">
        {/* Top Header */}
        <Header
          currentStage={getStage()}
          unreviewedCount={unreviewedCount}
          isDemoActive={isDemoActive}
          onLoadDemo={handleLoadDemo}
          onReset={handleReset}
          onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
        />

        {/* Security Warning Banner */}
        <SecurityNoticeBanner />

        {/* Demo Active Notice */}
        {isDemoActive && (
          <div className="neu-card rounded-2xl p-4 mb-5 border border-amber-500/40 text-xs text-amber-200 flex items-start justify-between gap-3 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-extrabold text-amber-300">
                  [가상 시연용 모의데이터가 로드되었습니다]
                </strong>
                <p className="mt-0.5 text-indigo-100/90 leading-relaxed">
                  실제 공공기관 정보가 아닌 4건의 가상 업무자료(DOCX, PDF, XLSX, CSV)와 이에 근거한 인수인계 초안이 활성화되었습니다.
                  좌측 네비게이션을 통해 항목별 출처와 원문 발췌문을 확인해 보세요.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDemoActive(false)}
              className="text-amber-400 hover:text-white font-bold underline shrink-0 cursor-pointer"
            >
              닫기
            </button>
          </div>
        )}

        {/* Generation Error Alert */}
        {generationError && (
          <div className="neu-card rounded-2xl p-4 mb-5 border border-rose-500/50 text-xs text-rose-200 flex items-start justify-between gap-3 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-extrabold text-rose-300">초안 생성 실패:</strong>
                <p className="mt-0.5 text-rose-100">{generationError}</p>
                <p className="mt-1 text-[11px] text-rose-300/80">
                  ※ 등록된 파일의 텍스트가 정상 추출되었는지 [추출 텍스트 미리보기]로 확인 후 재시도하거나, 상단의 [데모 불러오기]를 통해 먼저 시연해 보실 수 있습니다.
                </p>
              </div>
            </div>
            <button
              onClick={() => setGenerationError(null)}
              className="text-rose-300 hover:text-white font-bold underline shrink-0 cursor-pointer"
            >
              닫기
            </button>
          </div>
        )}

        {/* Section 1: Document Upload */}
        <div className="mb-6">
          <DocumentUploadSection
            documents={documents}
            onFilesSelected={handleFilesSelected}
            onRemoveDocument={handleRemoveDocument}
            onPreviewChunks={() => setIsChunksModalOpen(true)}
            onGenerateDraft={handleGenerateDraft}
            isGenerating={isGenerating}
            department={department}
            setDepartment={setDepartment}
            predecessor={predecessor}
            setPredecessor={setPredecessor}
            successor={successor}
            setSuccessor={setSuccessor}
            customNotes={customNotes}
            setCustomNotes={setCustomNotes}
          />
        </div>

        {/* Section 2: Results & Handover Workspace */}
        {draft ? (
          <HandoverWorkspace
            draft={draft}
            onUpdateDraft={setDraft}
            onOpenSource={handleOpenSource}
            onEditItem={handleEditItem}
            onOpenExport={() => setIsExportModalOpen(true)}
            allChunks={allChunks}
          />
        ) : (
          <div className="neu-card rounded-3xl p-12 text-center shadow-lg border border-[#2b3a9e]/40">
            <div className="w-16 h-16 rounded-2xl neu-inset text-cyan-400 mx-auto flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Sparkles className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-base font-extrabold text-white mb-2 tracking-wide">
              아직 인수인계 초안이 생성되지 않았습니다
            </h3>
            <p className="text-xs text-indigo-300/70 max-w-lg mx-auto mb-6 leading-relaxed">
              위 영역에 업무 문서(PDF, DOCX, XLSX, CSV, TXT)를 등록하고 <strong>[인수인계 초안 생성 실행]</strong>을 누르거나,
              우측 상단의 <strong>[데모 불러오기]</strong> 버튼을 눌러 모의데이터로 시스템을 즉시 경험해 보세요.
            </p>
            <button
              onClick={handleLoadDemo}
              className="neu-pill-active px-6 py-3 text-white rounded-xl text-xs font-extrabold shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:opacity-95 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <FolderSync className="w-4 h-4 text-cyan-300" />
              시연용 가상 데모 데이터 불러오기
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 pt-5 border-t border-[#233180]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-indigo-400/80">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
            <span>「업무 바통」 AI 기반 인수인계 초안 작성 시스템</span>
          </div>
          <span className="text-[11px] text-indigo-400/60 font-mono">
            NEUMORPHIC DARK THEME · SESSION MEMORY BASED
          </span>
        </footer>
      </div>

      {/* Modals & Drawers */}
      <SourceDrawer
        isOpen={isSourceDrawerOpen}
        onClose={() => setIsSourceDrawerOpen(false)}
        selectedSource={selectedSource}
        allChunks={allChunks}
      />

      <EditItemModal
        isOpen={editModalState.isOpen}
        onClose={() => setEditModalState({ ...editModalState, isOpen: false, item: null })}
        itemType={editModalState.type}
        initialItem={editModalState.item}
        onSave={handleSaveEditedItem}
      />

      {draft && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          draft={draft}
        />
      )}

      <ChunksPreviewModal
        isOpen={isChunksModalOpen}
        onClose={() => setIsChunksModalOpen(false)}
        chunks={allChunks}
      />

      <SecurityInfoModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </div>
  );
}
