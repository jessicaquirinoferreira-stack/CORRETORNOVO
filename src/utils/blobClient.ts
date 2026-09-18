/**
 * Cliente de Integração com Vercel Blob
 * Gerencia uploads seguros através da API do servidor (/api/upload),
 * salvando arquivos permanentemente na CDN da Vercel sem expor tokens no frontend.
 */

export interface BlobUploadOptions {
  file?: File | Blob;
  dataUrl?: string;
  folder?: 'imoveis' | 'plantas' | 'branding' | 'geral';
  fileName?: string;
  contentType?: string;
  token?: string;
}

export interface BlobUploadResult {
  success: boolean;
  url: string;
  pathname?: string;
  size?: number;
  isBlob: boolean;
  error?: string;
}

/**
 * Obtém o token Vercel Blob configurado pelo administrador se houver
 */
export function getLocalBlobToken(): string {
  try {
    if (typeof window !== 'undefined') {
      if ((window as any).__dp_blob_token) {
        return (window as any).__dp_blob_token;
      }
      const rawSettings = localStorage.getItem('dp_settings_cache_v3');
      if (rawSettings) {
        const parsed = JSON.parse(rawSettings);
        if (parsed?.vercelBlobToken && typeof parsed.vercelBlobToken === 'string') {
          return parsed.vercelBlobToken.trim();
        }
      }
      const directToken = localStorage.getItem('dp_blob_token');
      if (directToken) return directToken.trim();
    }
  } catch {
    // fallback
  }
  return '';
}

/**
 * Salva temporariamente ou define o token em memória
 */
export function setLocalBlobToken(token: string): void {
  if (typeof window !== 'undefined') {
    (window as any).__dp_blob_token = token.trim();
    if (token.trim()) {
      localStorage.setItem('dp_blob_token', token.trim());
    } else {
      localStorage.removeItem('dp_blob_token');
    }
  }
}

/**
 * Verifica o status de conexão com Vercel Blob
 */
export async function checkVercelBlobStatus(): Promise<{ configured: boolean; message: string; hasEnv?: boolean }> {
  try {
    const token = getLocalBlobToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['x-blob-token'] = token;
    }

    const res = await fetch('/api/blob-status', { headers });
    if (!res.ok) {
      // Tentar via /api/upload GET
      const fallback = await fetch('/api/upload', { headers });
      if (fallback.ok) {
        const d = await fallback.json();
        return {
          configured: d.configured || Boolean(token),
          hasEnv: d.hasEnv,
          message: d.message || (d.configured ? 'Conectado ao Vercel Blob' : 'Token não configurado'),
        };
      }
      return { configured: Boolean(token), message: 'Endpoint de status indisponível' };
    }
    const data = await res.json();
    return {
      configured: data.configured || Boolean(token),
      hasEnv: data.hasEnv,
      message: data.message || (data.configured ? 'Conectado ao Vercel Blob' : 'Token não configurado'),
    };
  } catch (err: any) {
    const token = getLocalBlobToken();
    return {
      configured: Boolean(token),
      message: err?.message || 'Falha ao consultar status do Vercel Blob',
    };
  }
}

/**
 * Realiza teste de gravação e deleção na CDN para certificar persistência permanente
 */
export async function testVercelBlobConnection(customToken?: string): Promise<{ success: boolean; message?: string; error?: string; testUrl?: string }> {
  const tokenToUse = (customToken || getLocalBlobToken()).trim();
  try {
    const res = await fetch('/api/blob-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(tokenToUse ? { 'x-blob-token': tokenToUse } : {}),
      },
      body: JSON.stringify({ token: tokenToUse }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Falha no teste com Vercel Blob',
      };
    }

    return {
      success: true,
      message: data.message || 'Conexão com Vercel Blob validada com sucesso!',
      testUrl: data.testUrl,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Erro de conexão com o servidor de upload',
    };
  }
}

/**
 * Faz upload de uma imagem (arquivo ou base64/dataUrl otimizado) para o Vercel Blob
 * através do endpoint seguro /api/upload.
 */
export async function uploadImageToVercelBlob(options: BlobUploadOptions): Promise<BlobUploadResult> {
  const { file, dataUrl, folder = 'imoveis', fileName, contentType } = options;
  const token = (options.token || getLocalBlobToken()).trim();

  try {
    let payloadDataUrl = dataUrl;
    let name = fileName || (file instanceof File ? file.name : `imagem-${Date.now()}.webp`);
    let mime = contentType || (file ? file.type : 'image/webp');

    // Se passou File/Blob e não dataUrl, converter para dataUrl
    if (!payloadDataUrl && file) {
      payloadDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Falha ao ler arquivo para envio ao Vercel Blob'));
        reader.readAsDataURL(file);
      });
    }

    if (!payloadDataUrl) {
      throw new Error('Nenhuma imagem fornecida para upload.');
    }

    // Chamar API segura no servidor com suporte a token
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['x-blob-token'] = token;
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        fileName: name,
        dataUrl: payloadDataUrl,
        folder,
        contentType: mime,
        token: token || undefined,
        blobToken: token || undefined,
      }),
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      const errorMessage = errorJson?.error || `Erro ${response.status} no servidor de upload`;
      
      console.warn('Vercel Blob API retornou erro:', errorMessage);

      // Se o token não estiver configurado na Vercel ainda, ou falhar no ambiente local
      return {
        success: false,
        url: payloadDataUrl, // Preserva a imagem otimizada para não interromper a experiência
        isBlob: false,
        error: errorMessage,
      };
    }

    const data = await response.json();

    if (data.success && data.url) {
      return {
        success: true,
        url: data.url,
        pathname: data.pathname,
        size: data.size,
        isBlob: true,
      };
    }

    return {
      success: false,
      url: payloadDataUrl,
      isBlob: false,
      error: data.error || 'Resposta inválida do Vercel Blob',
    };
  } catch (err: any) {
    console.warn('Falha na comunicação com o endpoint de upload Vercel Blob:', err);
    return {
      success: false,
      url: options.dataUrl || '',
      isBlob: false,
      error: err?.message || 'Falha de conexão com Vercel Blob',
    };
  }
}

/**
 * Remove um arquivo do Vercel Blob através do endpoint /api/upload
 */
export async function deleteImageFromVercelBlob(url: string, customToken?: string): Promise<{ success: boolean; error?: string }> {
  if (!url || !url.includes('vercel-storage.com')) {
    // Não é um arquivo do Vercel Blob, nada a deletar na CDN
    return { success: true };
  }

  const token = (customToken || getLocalBlobToken()).trim();

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['x-blob-token'] = token;
    }

    const response = await fetch('/api/upload', {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ url, token: token || undefined, blobToken: token || undefined }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { success: false, error: err.error || 'Erro ao remover do Vercel Blob' };
    }

    const res = await response.json();
    return { success: res.success ?? true };
  } catch (err: any) {
    console.warn('Erro ao deletar arquivo do Vercel Blob:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Verifica se uma URL é hospedada no Vercel Blob CDN
 */
export function isVercelBlobUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.includes('vercel-storage.com') || url.includes('.blob.vercel.app');
}
