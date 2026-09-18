import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { put, del } from '@vercel/blob';

// Configuração de tipos de imagem permitidos
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
  'image/heic',
  'image/heif',
  'image/bmp',
]);

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares para parsing de JSON com limite expandido para fotos em alta resolução
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // ==========================================
  // 1. API ROUTES FIRST
  // ==========================================

  // Health check & status
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasBlobToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      timestamp: Date.now(),
    });
  });

  // Vercel Blob Status API
  app.get('/api/upload/status', (req, res) => {
    res.json({
      configured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      storageType: 'vercel_blob',
      maxSizeBytes: MAX_FILE_SIZE_BYTES,
      allowedTypes: Array.from(ALLOWED_MIME_TYPES),
    });
  });

  // Status do Vercel Blob CDN
  app.get('/api/upload', (req, res) => {
    const blobToken = (process.env.BLOB_READ_WRITE_TOKEN || (req.headers['x-blob-token'] as string))?.trim();
    const isConfigured = Boolean(blobToken);
    return res.status(200).json({
      success: true,
      configured: isConfigured,
      hasEnv: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      message: isConfigured ? 'Vercel Blob CDN conectado e ativo' : 'BLOB_READ_WRITE_TOKEN não configurado',
    });
  });

  app.get('/api/blob-status', (req, res) => {
    const blobToken = (process.env.BLOB_READ_WRITE_TOKEN || (req.headers['x-blob-token'] as string))?.trim();
    const isConfigured = Boolean(blobToken);
    return res.status(200).json({
      success: true,
      configured: isConfigured,
      hasEnv: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      message: isConfigured ? 'Vercel Blob CDN conectado e ativo' : 'BLOB_READ_WRITE_TOKEN não configurado',
    });
  });

  // Teste de conexão em tempo real com Vercel Blob
  app.post('/api/blob-test', async (req, res) => {
    try {
      const blobToken = (process.env.BLOB_READ_WRITE_TOKEN || req.body?.token || req.body?.blobToken || (req.headers['x-blob-token'] as string))?.trim();
      if (!blobToken) {
        return res.status(400).json({
          success: false,
          error: 'Nenhum token BLOB_READ_WRITE_TOKEN fornecido ou configurado no ambiente.',
        });
      }

      // Buffer de 1x1 WebP transparente
      const tinyWebpBase64 = 'UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
      const buffer = Buffer.from(tinyWebpBase64, 'base64');
      const testPathname = `uploads/geral/test-connection-${Date.now()}.webp`;

      const blob = await put(testPathname, buffer, {
        access: 'public',
        contentType: 'image/webp',
        token: blobToken,
      });

      // Tentar deletar o arquivo de teste para manter a storage limpa
      try {
        await del(blob.url, { token: blobToken });
      } catch {
        // Ignorar se a exclusão imediata falhar
      }

      return res.status(200).json({
        success: true,
        message: 'Conexão com Vercel Blob realizada com sucesso! O armazenamento de fotos está 100% operacional e permanente.',
        testUrl: blob.url,
      });
    } catch (testErr: any) {
      return res.status(400).json({
        success: false,
        error: `Falha ao conectar com Vercel Blob: ${testErr?.message || 'Token inválido ou sem permissão de escrita'}`,
      });
    }
  });

  // Upload para Vercel Blob via Express Server
  app.post('/api/upload', async (req, res) => {
    try {
      const blobToken = (process.env.BLOB_READ_WRITE_TOKEN || req.body?.token || req.body?.blobToken || (req.headers['x-blob-token'] as string))?.trim();
      const { fileName, dataUrl, folder = 'imoveis', contentType } = req.body || {};

      if (!dataUrl || typeof dataUrl !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Nenhum dado de imagem recebido.',
        });
      }

      // Se o token não estiver presente no ambiente local, informar claramente
      if (!blobToken) {
        return res.status(400).json({
          success: false,
          error: 'Variável de ambiente BLOB_READ_WRITE_TOKEN não configurada. Adicione o token no painel da Vercel, nas Configurações do site ou no arquivo .env.',
          code: 'TOKEN_MISSING',
        });
      }

      // Extrair MIME type e buffer a partir do dataUrl / base64
      let mime = contentType || 'image/webp';
      let buffer: Buffer;

      if (dataUrl.startsWith('data:')) {
        const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          mime = matches[1];
          buffer = Buffer.from(matches[2], 'base64');
        } else {
          const parts = dataUrl.split(',');
          if (parts.length > 1) {
            buffer = Buffer.from(parts[1], 'base64');
          } else {
            return res.status(400).json({ success: false, error: 'Formato de Base64 inválido.' });
          }
        }
      } else {
        buffer = Buffer.from(dataUrl, 'base64');
      }

      // Validação do tipo de arquivo
      if (!ALLOWED_MIME_TYPES.has(mime.toLowerCase())) {
        return res.status(400).json({
          success: false,
          error: `Formato de imagem não permitido (${mime}). Formatos aceitos: JPEG, PNG, WebP, GIF, AVIF, SVG.`,
        });
      }

      // Validação do tamanho
      if (buffer.length > MAX_FILE_SIZE_BYTES) {
        return res.status(400).json({
          success: false,
          error: `A imagem ultrapassa o tamanho máximo permitido de 25MB (tamanho atual: ${(buffer.length / (1024 * 1024)).toFixed(1)}MB).`,
        });
      }

      // Organização de pastas virtuais no Vercel Blob
      const cleanFolder = ['imoveis', 'plantas', 'branding', 'geral'].includes(folder) ? folder : 'imoveis';
      const ext = mime.split('/')[1]?.replace('jpeg', 'jpg') || 'webp';
      const cleanName = (fileName || `foto-${Date.now()}`)
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, '_')
        .replace(/\.[^/.]+$/, '');

      const randomSuffix = Math.random().toString(36).substring(2, 9);
      const pathname = `uploads/${cleanFolder}/${Date.now()}-${randomSuffix}-${cleanName}.${ext}`;

      // Enviar diretamente ao Vercel Blob com token seguro do servidor
      const blob = await put(pathname, buffer, {
        access: 'public',
        contentType: mime,
        token: blobToken,
      });

      return res.status(200).json({
        success: true,
        url: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType,
        size: buffer.length,
      });
    } catch (uploadError: any) {
      console.error('Erro no upload para Vercel Blob:', uploadError);
      return res.status(500).json({
        success: false,
        error: uploadError?.message || 'Falha interna ao enviar imagem ao Vercel Blob',
      });
    }
  });

  // Exclusão de arquivo do Vercel Blob via Express Server
  app.delete('/api/upload', async (req, res) => {
    try {
      const blobToken = (process.env.BLOB_READ_WRITE_TOKEN || req.body?.token || req.body?.blobToken || (req.headers['x-blob-token'] as string))?.trim();
      if (!blobToken) {
        return res.status(400).json({
          success: false,
          error: 'Token BLOB_READ_WRITE_TOKEN não configurado.',
        });
      }

      const { url } = req.body || {};
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ success: false, error: 'URL do arquivo não fornecida' });
      }

      // Validar se é uma URL do Vercel Blob por segurança
      if (!url.includes('vercel-storage.com') && !url.includes('.blob.vercel.app')) {
        return res.status(400).json({ success: false, error: 'URL inválida para exclusão no Vercel Blob' });
      }

      await del(url, { token: blobToken });
      return res.status(200).json({ success: true, message: 'Arquivo excluído do Vercel Blob com sucesso' });
    } catch (delError: any) {
      console.error('Erro ao deletar do Vercel Blob:', delError);
      return res.status(500).json({ success: false, error: delError?.message || 'Falha ao deletar do Vercel Blob' });
    }
  });

  // ==========================================
  // 2. VITE MIDDLEWARE / STATIC ASSETS
  // ==========================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Servidor Daniel Pacheco Imóveis rodando em http://localhost:${PORT}`);
  });
}

startServer();
