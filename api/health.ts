export default function handler(req: any, res: any) {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.status(200).json({
    status: 'ok',
    platform: 'vercel',
    aiConfigured: hasKey,
    model: 'gemini-3.8-flash',
    supportedFormats: ['PDF', 'DOCX', 'XLSX', 'CSV', 'TXT'],
    timestamp: new Date().toISOString()
  });
}
