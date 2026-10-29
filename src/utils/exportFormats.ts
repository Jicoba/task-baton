import { HandoverDraft } from '../types/handover';

export function exportToMarkdown(draft: HandoverDraft): string {
  const lines: string[] = [];

  lines.push(`# ${draft.title || '업무 인수인계서'}`);
  lines.push('');
  lines.push(`- **담당 부서**: ${draft.department || '미지정'}`);
  lines.push(`- **전임자(작성자)**: ${draft.predecessor || '미지정'}`);
  lines.push(`- **후임자(인수자)**: ${draft.successor || '미지정'}`);
  lines.push(`- **작성 일시**: ${draft.createdAt} (최근 수정: ${draft.updatedAt})`);
  lines.push(`- **검토 상태**: ${draft.isFullyReviewed ? '✅ 전체 검토 완료' : '⚠️ 검토 진행 중'}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // 1. 인수인계 종합 요약
  lines.push('## 1. 인수인계 종합 요약');
  lines.push('');
  lines.push(`### 1.1 업무 목적 및 배경`);
  lines.push(draft.summary.purpose || '자료에서 확인되지 않음');
  lines.push('');
  lines.push(`### 1.2 핵심 업무`);
  if (draft.summary.coreTasks && draft.summary.coreTasks.length > 0) {
    draft.summary.coreTasks.forEach(task => lines.push(`- ${task}`));
  } else {
    lines.push('- 등록된 핵심 업무가 없습니다.');
  }
  lines.push('');
  lines.push(`### 1.3 가장 먼저 확인할 사항 (우선 조치)`);
  if (draft.summary.immediatePriorities && draft.summary.immediatePriorities.length > 0) {
    draft.summary.immediatePriorities.forEach(item => lines.push(`- ⚡ ${item}`));
  } else {
    lines.push('- 즉시 조치 사항 없음');
  }
  lines.push('');
  if (draft.summary.overallNotes) {
    lines.push(`> 💡 **종합 안내사항**:\n> ${draft.summary.overallNotes.replace(/\n/g, '\n> ')}`);
    lines.push('');
  }

  // 2. 담당 업무 목록
  lines.push('## 2. 담당 업무 목록');
  lines.push('');
  draft.workItems.forEach((work, idx) => {
    lines.push(`### 2.${idx + 1} ${work.title} [${work.status}]`);
    lines.push(`- **업무 목적**: ${work.purpose}`);
    lines.push(`- **주기 / 빈도**: ${work.frequency}`);
    lines.push(`- **담당 역할**: ${work.role || '담당자'}`);
    lines.push(`- **신뢰도 / 근거**: ${work.confidence}${work.isUserModified ? ' (사용자 수정)' : ''}`);
    lines.push('- **처리 절차**:');
    work.procedure.forEach(p => lines.push(`  1. ${p}`));
    if (work.nextActions && work.nextActions.length > 0) {
      lines.push('- **후속 조치**:');
      work.nextActions.forEach(a => lines.push(`  - ${a}`));
    }
    if (work.reviewNote) {
      lines.push(`- ⚠️ **전임자 확인 메모**: ${work.reviewNote}`);
    }
    if (work.sources && work.sources.length > 0) {
      lines.push('- **근거 출처**:');
      work.sources.forEach(s => {
        lines.push(`  - 📄 \`${s.fileName}\` [${s.location}]: "${s.excerpt}"`);
      });
    }
    lines.push('');
  });

  // 3. 연간·월별 업무 일정
  lines.push('## 3. 연간 및 월별 업무 일정');
  lines.push('');
  lines.push('| 시기 | 업무명 | 마감일 | 사전 준비 | 후속 조치 | 상태 | 출처 |');
  lines.push('|:---|:---|:---|:---|:---|:---|:---|');
  draft.schedule.forEach(s => {
    const src = s.sources.map(srcItem => `${srcItem.fileName}(${srcItem.location})`).join(', ') || '-';
    lines.push(`| ${s.timing} | ${s.task} | ${s.deadline} | ${s.preparation} | ${s.followUp} | ${s.status} | ${src} |`);
  });
  lines.push('');

  // 4. 진행 중인 현안
  lines.push('## 4. 진행 중인 현안 및 리스크');
  lines.push('');
  draft.ongoingIssues.forEach((issue, idx) => {
    lines.push(`### 4.${idx + 1} ${issue.title} [${issue.status}]`);
    lines.push(`- **현재 상황**: ${issue.currentStatus}`);
    lines.push(`- **지금까지의 진행 경과**: ${issue.history}`);
    lines.push(`- **남은 일**: ${issue.remainingWork}`);
    lines.push(`- **다음 조치사항**: ${issue.nextStep}`);
    lines.push(`- 🚨 **주의사항 및 위험요소**: ${issue.cautions}`);
    if (issue.reviewNote) {
      lines.push(`- ⚠️ **확인 필요 사항**: ${issue.reviewNote}`);
    }
    if (issue.sources && issue.sources.length > 0) {
      lines.push('- **출처 근거**:');
      issue.sources.forEach(s => {
        lines.push(`  - 📄 \`${s.fileName}\` [${s.location}]: "${s.excerpt}"`);
      });
    }
    lines.push('');
  });

  // 5. 협의 및 연락 관계
  lines.push('## 5. 협의 및 연락 관계 (유관기관/부서)');
  lines.push('');
  lines.push('| 기관 / 부서 / 역할 | 협의 목적 | 협의 시점 / 관련 업무 | 연락처 | 상태 | 출처 |');
  lines.push('|:---|:---|:---|:---|:---|:---|');
  draft.stakeholders.forEach(stk => {
    const src = stk.sources.map(srcItem => `${srcItem.fileName}(${srcItem.location})`).join(', ') || '-';
    lines.push(`| ${stk.nameOrOrg} | ${stk.purpose} | ${stk.timingOrTask} | ${stk.contactInfo} | ${stk.status} | ${src} |`);
  });
  lines.push('');

  // 6. 관련 규정 및 참고자료
  lines.push('## 6. 관련 규정 및 참고자료');
  lines.push('');
  draft.references.forEach((ref, idx) => {
    lines.push(`- **[${idx + 1}] ${ref.docTitle}**`);
    lines.push(`  - 연결 업무: ${ref.relatedWork}`);
    lines.push(`  - 위치/출처: ${ref.locationOrLink}`);
    if (ref.sources && ref.sources.length > 0) {
      lines.push(`  - 근거: ${ref.sources.map(s => `${s.fileName} [${s.location}]`).join(', ')}`);
    }
  });
  lines.push('');

  // 7. 자료 간 상충 사항
  if (draft.conflicts && draft.conflicts.length > 0) {
    lines.push('## 7. 자료 간 불일치 및 상충 사항 (전임자 판단 필요)');
    lines.push('');
    draft.conflicts.forEach((c, idx) => {
      lines.push(`### 7.${idx + 1} ${c.topic}`);
      lines.push(`> ${c.description}`);
      lines.push('');
      lines.push(`- **항목 A**: ${c.optionA.content} (출처: \`${c.optionA.source.fileName}\` [${c.optionA.source.location}])`);
      lines.push(`- **항목 B**: ${c.optionB.content} (출처: \`${c.optionB.source.fileName}\` [${c.optionB.source.location}])`);
      lines.push(`- ⚠️ **조치 메모**: ${c.resolutionNote}`);
      lines.push('');
    });
  }

  // 8. 정보 누락 및 전임자 확인 필요 사항
  if (draft.missingInformation && draft.missingInformation.length > 0) {
    lines.push('## 8. 정보 누락 및 확인 필요 사항');
    lines.push('');
    lines.push('| 구분 | 누락/불분명 항목 | 원인 / 사유 | 권고 조치사항 |');
    lines.push('|:---|:---|:---|:---|');
    draft.missingInformation.forEach(m => {
      lines.push(`| ${m.category} | ${m.item} | ${m.reason} | ${m.suggestedAction} |`);
    });
    lines.push('');
  }

  lines.push('---');
  lines.push('*본 문서는 「업무 바통」 AI 기반 인수인계 초안 도구를 통해 전임자의 등록 문서를 분석·검토하여 생성되었습니다.*');

  return lines.join('\n');
}

export function exportToJson(draft: HandoverDraft): string {
  return JSON.stringify(draft, null, 2);
}

function escapeCsvField(val: string): string {
  if (val === undefined || val === null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export function exportWorkItemsToCsv(draft: HandoverDraft): string {
  const headers = [
    '고유ID',
    '업무명',
    '업무목적',
    '주기/빈도',
    '담당역할',
    '처리절차',
    '후속조치',
    '검토상태',
    '신뢰도',
    '출처목록',
    '전임자확인사항'
  ];

  const rows: string[] = [headers.map(escapeCsvField).join(',')];

  draft.workItems.forEach(item => {
    const sourcesStr = item.sources
      .map(s => `${s.fileName} [${s.location}]: ${s.excerpt}`)
      .join(' ; ');

    rows.push(
      [
        escapeCsvField(item.id),
        escapeCsvField(item.title),
        escapeCsvField(item.purpose),
        escapeCsvField(item.frequency),
        escapeCsvField(item.role),
        escapeCsvField(item.procedure.join(' -> ')),
        escapeCsvField(item.nextActions.join(', ')),
        escapeCsvField(item.status),
        escapeCsvField(item.confidence),
        escapeCsvField(sourcesStr),
        escapeCsvField(item.reviewNote)
      ].join(',')
    );
  });

  // Prepend UTF-8 BOM so Excel opens Korean correctly
  return '\uFEFF' + rows.join('\r\n');
}

export function exportScheduleToCsv(draft: HandoverDraft): string {
  const headers = [
    '고유ID',
    '시기',
    '업무명',
    '마감일',
    '사전준비',
    '후속조치',
    '검토상태',
    '신뢰도',
    '출처목록',
    '확인메모'
  ];

  const rows: string[] = [headers.map(escapeCsvField).join(',')];

  draft.schedule.forEach(s => {
    const sourcesStr = s.sources
      .map(src => `${src.fileName} [${src.location}]`)
      .join(' ; ');

    rows.push(
      [
        escapeCsvField(s.id),
        escapeCsvField(s.timing),
        escapeCsvField(s.task),
        escapeCsvField(s.deadline),
        escapeCsvField(s.preparation),
        escapeCsvField(s.followUp),
        escapeCsvField(s.status),
        escapeCsvField(s.confidence),
        escapeCsvField(sourcesStr),
        escapeCsvField(s.reviewNote)
      ].join(',')
    );
  });

  return '\uFEFF' + rows.join('\r\n');
}

export function triggerDownload(content: string, filename: string, mimeType: string): void {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('File download error:', err);
    throw new Error('파일 다운로드 생성 중 브라우저 오류가 발생했습니다.');
  }
}
