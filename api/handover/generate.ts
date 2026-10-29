import { generateHandoverDraft } from '../../src/server/geminiService';

export default async function handler(req: any, res: any) {
  // Set CORS headers for robustness
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 지원합니다.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // keep as is
      }
    }

    const { chunks, userPrompt, department, predecessor, successor } = body || {};

    if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
      return res.status(400).json({
        error: '분석할 문서 텍스트 조각(chunks)이 전달되지 않았습니다. 먼저 유효한 파일을 등록해 주세요.'
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY 환경변수가 Vercel에 설정되지 않았습니다. Vercel 프로젝트의 [Settings] > [Environment Variables]에서 GEMINI_API_KEY를 등록하고 [Redeploy]해 주세요.'
      });
    }

    const draft = await generateHandoverDraft({
      chunks,
      userPrompt,
      department,
      predecessor,
      successor
    });

    return res.status(200).json({ success: true, draft });
  } catch (error: any) {
    console.error('Vercel API handover generation error:', error);
    return res.status(500).json({
      error: error.message || '인수인계 초안을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
    });
  }
}
