import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateHandoverDraft } from './src/server/geminiService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.json({
    status: 'ok',
    aiConfigured: hasKey,
    model: 'gemini-3.8-flash',
    supportedFormats: ['PDF', 'DOCX', 'XLSX', 'CSV', 'TXT'],
    timestamp: new Date().toISOString()
  });
});

// Handover generation endpoint
app.post('/api/handover/generate', async (req: Request, res: Response) => {
  const { chunks, userPrompt, department, predecessor, successor } = req.body;

  if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
    return res.status(400).json({
      error: '분석할 문서 텍스트 조각(chunks)이 전달되지 않았습니다. 먼저 유효한 파일을 등록해 주세요.'
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY 환경변수가 설정되지 않았습니다. AI Studio Secrets 패널 또는 Vercel 환경변수에서 설정해 주세요.'
    });
  }

  try {
    const draft = await generateHandoverDraft({
      chunks,
      userPrompt,
      department,
      predecessor,
      successor
    });

    return res.json({ success: true, draft });
  } catch (error: any) {
    console.error('Gemini handover generation error:', error);
    return res.status(500).json({
      error: error.message || '인수인계 초안을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
    });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    const listenPort = Number(process.env.PORT) || 3000;
    app.listen(listenPort, '0.0.0.0', () => {
      console.log(`[업무 바통] Server is listening on http://0.0.0.0:${listenPort}`);
    });
  }
}

startServer();

export default app;
