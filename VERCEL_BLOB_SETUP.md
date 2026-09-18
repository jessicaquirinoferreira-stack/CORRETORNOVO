# Guia Completo de Integração e Configuração: Vercel Blob Storage

Este projeto possui integração nativa com o **Vercel Blob** para armazenamento permanente de fotos dos imóveis, logos e plantas baixas.

---

## 🎯 Por que o Vercel Blob foi Integrado?

Antes desta integração, imagens salvas localmente em pastas temporárias poderiam desaparecer após um novo deploy ou reinicialização do container na Vercel. 

Com o **Vercel Blob**:
1. **Persistência Absoluta**: As imagens enviadas permanecem salvas para sempre na infraestrutura global da Vercel, mesmo após novos deploys, atualizações de código, trocas de versão ou reinicializações.
2. **CDN Global Ultrarrápida**: As fotos são distribuídas via Edge CDN global da Vercel com carregamento instantâneo para clientes no celular ou computador.
3. **Segurança Reforçada**: O `BLOB_READ_WRITE_TOKEN` é utilizado **estritamente no backend** (`/api/upload` e `server.ts`), impedindo qualquer exposição de chaves privadas no código frontend/navegador.
4. **Otimização Automática**: As fotos enviadas pelo painel são convertidas para WebP de alta nitidez com compressão inteligente (mantendo de 20KB a 40KB por foto) e podem receber a **marca d'água oficial translúcida** antes de serem salvas no Vercel Blob.

---

## 🚀 Passo a Passo: Configuração na Vercel (2 Minutos)

### 1. Criar o Blob Store na Vercel
1. Acesse o [Dashboard da Vercel](https://vercel.com/dashboard).
2. Selecione o seu projeto (**daniel-pacheco-imoveis**).
3. No menu superior, clique na aba **Storage**.
4. Clique em **Create Database** ou **Connect Store** e selecione **Blob**.
5. Dê um nome ao seu store (ex: `imoveis-daniel-pacheco-blob`) e confirme.

### 2. Obter o Token de Acesso (`BLOB_READ_WRITE_TOKEN`)
1. Após criar o Blob Store na Vercel, a própria Vercel adicionará automaticamente a variável de ambiente `BLOB_READ_WRITE_TOKEN` ao seu projeto.
2. Caso precise configurar manualmente ou em ambiente local, acesse a aba **Settings** > **Environment Variables** do seu projeto na Vercel.
3. Copie o valor de `BLOB_READ_WRITE_TOKEN`.

### 3. Configurar no Ambiente Local / Desenvolvimento
No arquivo `.env` da raiz do projeto, adicione:

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

*(O arquivo `.env.example` já inclui esse modelo como referência).*

---

## 🛠️ Arquitetura Implementada no Código

- **`/api/upload.ts` & `/server.ts`**:
  - Endpoints seguros no backend que recebem a imagem do frontend e chamam o método `put()` do `@vercel/blob` com `access: 'public'`.
  - Organiza os arquivos em pastas organizadas:
    - `imoveis/` (Galeria de fotos dos imóveis)
    - `plantas/` (Plantas humanizadas dos empreendimentos)
    - `branding/` (Logos oficiais e marcas d'água)
- **`src/utils/blobClient.ts`**:
  - Cliente no frontend que faz a requisição via `POST /api/upload` enviando a imagem otimizada.
  - Possui fallback de segurança transparente caso o token ainda não esteja configurado.
- **`src/utils/imageUploader.ts`**:
  - Compacta arquivos do celular/câmera/computador para WebP nítido.
  - Aplica marca d'água com fundo transparente.
  - Envia para o Vercel Blob e retorna a URL pública permanente (`https://...public.blob.vercel-storage.com/...`).
- **`src/pages/AdminPage.tsx`**:
  - Upload em lote de fotos de imóveis com indicador de progresso em tempo real.
  - Identificador visual nas fotos com selo **Blob CDN**.
  - Remoção automática na CDN ao deletar foto da galeria.
  - Upload direto de Logo, Marca d'Água e Planta Baixa.

---

## 🧪 Como Testar a Integração

1. Acesse o **Painel Administrativo** da Imobiliária.
2. Abra qualquer imóvel para editar ou clique em **Adicionar Novo Imóvel**.
3. Na aba **Fotos & Galeria**, arraste uma foto ou clique em **Carregar do Dispositivo**.
4. Observe o upload sendo realizado em tempo real.
5. A foto salva receberá o selo **Blob CDN** e a URL do Vercel Blob (`https://...vercel-storage.com`).
6. Clique em **Salvar Imóvel**.
7. Mesmo após realizar novos builds ou deploys no GitHub/Vercel, as fotos permanecerão intactas e online!
