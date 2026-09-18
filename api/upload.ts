import { put, del } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '30mb',
    },
  },
};

// Extensões e MIME types permitidos
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

/**
 * Endpoint Vercel Serverless Function & Express API Route para Vercel Blob
 */
export default async function handler(req: any, res: any) {
  // CORS & Methods setup
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

  // Obter token do Vercel Blob (via env, body ou header)
  const blobToken = (process.env.BLOB_READ_WRITE_TOKEN || req.body?.token || req.body?.blobToken || (req.headers?.['x-blob-token'] as string))?.trim();

  // Status check via GET
  if (req.method === 'GET') {
    const isConfigured = Boolean(blobToken);
    return res.status(200).json({
      success: true,
      configured: isConfigured,
      hasEnv: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      message: isConfigured ? 'Vercel Blob CDN conectado e ativo' : 'BLOB_READ_WRITE_TOKEN não configurado',
    });
  }

  // 1. DELETE: Excluir imagem do Vercel Blob
  if (req.method === 'DELETE') {
    try {
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
  }

  // 2. POST: Upload de imagem para Vercel Blob
  if (req.method === 'POST') {
    try {
      const { fileName, dataUrl, folder = 'imoveis', contentType } = req.body || {};

      if (!dataUrl || typeof dataUrl !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Nenhum dado de imagem recebido.',
        });
      }

      // Validar token da Vercel
      if (!blobToken) {
        return res.status(400).json({
          success: false,
          error: 'Variável de ambiente BLOB_READ_WRITE_TOKEN não configurada na Vercel.',
          code: 'TOKEN_MISSING',
        });
      }

      // Extrair MIME type e buffer
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

      // Validar MIME type
      if (!ALLOWED_MIME_TYPES.has(mime.toLowerCase())) {
        return res.status(400).json({
          success: false,
          error: `Formato de imagem não permitido (${mime}). Formatos aceitos: JPEG, PNG, WebP, GIF, AVIF, SVG.`,
        });
      }

      // Validar tamanho
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
  }

  // Método não suportado
  return res.status(405).json({ success: false, error: `Método ${req.method} não suportado.` });
}
