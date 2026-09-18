import React, { useState, useEffect } from 'react';
import { Property, SiteSettings, LandingPage, LandingPageAudience, LandingPageTheme } from '../types';
import { 
  Sparkles, 
  Globe, 
  Copy, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Eye, 
  Share2, 
  Plus, 
  Rocket, 
  Layers, 
  Flame, 
  Search, 
  RefreshCw, 
  Building2, 
  Settings2,
  TrendingUp,
  Smartphone,
  Sliders,
  Check
} from 'lucide-react';
import { generateSmartLandingPage } from '../utils/landingPageGenerator';
import { saveLandingPage, deleteLandingPage, subscribeLandingPages, getLocalCachedLandingPages } from '../firebase/firebaseService';

interface AdminLandingPageBuilderProps {
  properties: Property[];
  settings: SiteSettings;
  onPreviewLP?: (lp: LandingPage) => void;
}

export function AdminLandingPageBuilder({ properties, settings, onPreviewLP }: AdminLandingPageBuilderProps) {
  const [landingPages, setLandingPages] = useState<LandingPage[]>(() => getLocalCachedLandingPages());
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || '');
  const [targetAudience, setTargetAudience] = useState<LandingPageAudience>('investidor');
  const [themeStyle, setThemeStyle] = useState<LandingPageTheme>('luxury-dark');
  
  // Current draft being edited
  const [draftLP, setDraftLP] = useState<LandingPage | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [searchProperty, setSearchProperty] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');

  // Load and subscribe to landing pages from Firestore
  useEffect(() => {
    const unsub = subscribeLandingPages((list) => {
      setLandingPages(list);
    });
    return () => unsub();
  }, []);

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId) || properties[0];

  // Auto-generate initial draft when selecting a property or changing audience/theme
  const handleGenerateSmartCopy = () => {
    if (!selectedProperty) return;
    const generated = generateSmartLandingPage(selectedProperty, targetAudience, themeStyle);
    setDraftLP(generated);
  };

  // Generate on first mount if none exists
  useEffect(() => {
    if (selectedProperty && !draftLP) {
      handleGenerateSmartCopy();
    }
  }, [selectedPropertyId]);

  const handlePropertyChange = (propId: string) => {
    setSelectedPropertyId(propId);
    const prop = properties.find((p) => p.id === propId);
    if (prop) {
      const generated = generateSmartLandingPage(prop, targetAudience, themeStyle);
      setDraftLP(generated);
    }
  };

  const handleSaveLandingPage = async () => {
    if (!draftLP || !selectedProperty) return;
    setIsSaving(true);
    setSaveSuccessMsg(null);

    try {
      await saveLandingPage(draftLP);
      setSaveSuccessMsg('🎉 Landing Page publicada 100% online no Firebase Firestore!');
      setTimeout(() => setSaveSuccessMsg(null), 4500);
      setActiveTab('list');
    } catch (err) {
      console.error('Erro ao salvar Landing Page:', err);
      alert('Erro ao salvar Landing Page no Firebase. Verifique sua conexão.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLP = async (id: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a landing page "${title}"?`)) {
      try {
        await deleteLandingPage(id);
      } catch (err) {
        console.error('Erro ao excluir:', err);
      }
    }
  };

  const handleEditLP = (lp: LandingPage) => {
    setDraftLP(lp);
    setSelectedPropertyId(lp.propertyId);
    setTargetAudience(lp.targetAudience || 'geral');
    setThemeStyle(lp.themeStyle || 'luxury-dark');
    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Base production domain from settings or standard Vercel custom domain
  const defaultDomain = settings.siteUrl || 'https://www.corretordanielpacheco.com.br';
  const [baseDomain, setBaseDomain] = useState<string>(defaultDomain);
  const [urlFormat, setUrlFormat] = useState<'clean' | 'hash'>('clean'); // 'clean' = /lp-slug, 'hash' = /#lp-slug

  // Build the live public production URL with www.corretordanielpacheco.com.br
  const getLandingPageUrl = (slug: string, utmMedium?: string, utmSource?: string, forceCurrentOrigin: boolean = false) => {
    // Normalize base domain without trailing slash
    let domain = forceCurrentOrigin ? window.location.origin : (baseDomain.trim() || 'https://www.corretordanielpacheco.com.br');
    domain = domain.replace(/\/+$/, '');
    if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
      domain = `https://${domain}`;
    }

    const cleanSlug = slug.replace(/^\/+/, '').replace(/^#\/?/, '');
    
    // Choose format: clean /slug or hash /#slug
    let url = forceCurrentOrigin || urlFormat === 'hash' 
      ? `${domain}/#${cleanSlug}` 
      : `${domain}/${cleanSlug}`;

    const params = new URLSearchParams();
    if (utmSource) params.append('utm_source', utmSource);
    if (utmMedium) params.append('utm_medium', utmMedium);
    if (draftLP?.utmCampaign) params.append('utm_campaign', draftLP.utmCampaign);
    
    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const filteredProperties = properties.filter((p) => 
    p.title.toLowerCase().includes(searchProperty.toLowerCase()) ||
    p.code.toLowerCase().includes(searchProperty.toLowerCase()) ||
    p.city.toLowerCase().includes(searchProperty.toLowerCase()) ||
    p.neighborhood.toLowerCase().includes(searchProperty.toLowerCase())
  );

  return (
    <div id="admin-landing-page-builder" className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0F0F11] via-[#1A1A1E] to-[#0F0F11] border border-[#C9A227]/40 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inteligência de Tráfego Pago & Conversão</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
              Criador de Landing Pages para Anúncios
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Transforme qualquer imóvel em uma página de alta conversão otimizada para Instagram Ads, Google Ads e WhatsApp. Ao publicar, ela fica 100% online na Vercel e Firebase para todos os clientes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-[#C9A227] text-black shadow-lg'
                  : 'bg-stone-800 text-stone-300 hover:text-white border border-stone-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Nova Landing Page</span>
            </button>

            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-[#C9A227] text-black shadow-lg'
                  : 'bg-stone-800 text-stone-300 hover:text-white border border-stone-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Páginas Criadas ({landingPages.length})</span>
            </button>
          </div>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* VIEW 1: CREATE & EDIT LANDING PAGE */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Controls & Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* STEP 1: Select Property */}
            <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E0D8] shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-[#E5E0D8] pb-3">
                <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>Passo 1: Selecionar o Imóvel da Base</span>
                </span>
                <span className="text-xs text-[#5A5A5A]">{properties.length} disponíveis</span>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-[#5A5A5A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrar imóvel por título, código ou bairro..."
                  value={searchProperty}
                  onChange={(e) => setSearchProperty(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] text-[#111111] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {filteredProperties.map((prop) => {
                  const isSelected = selectedPropertyId === prop.id;
                  return (
                    <button
                      key={prop.id}
                      onClick={() => handlePropertyChange(prop.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#C9A227] bg-[#C9A227]/10 shadow-sm'
                          : 'border-[#E5E0D8] hover:bg-[#F7F3EB]'
                      }`}
                    >
                      <img
                        src={prop.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100'}
                        alt={prop.title}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-mono font-bold text-[#C9A227] block">{prop.code}</span>
                        <h4 className="text-xs font-bold text-[#111111] truncate">{prop.title}</h4>
                        <span className="text-[10px] text-[#5A5A5A] block truncate">{prop.neighborhood}, {prop.city}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Marketing Objective & Theme */}
            <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E0D8] shadow-sm space-y-4">
              <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#E5E0D8] pb-3">
                <Sliders className="w-4 h-4" />
                <span>Passo 2: Definir Foco da Campanha & Estilo Visual</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#111111] mb-1.5 uppercase">
                    Público-Alvo / Foco da Copy
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => {
                      const aud = e.target.value as LandingPageAudience;
                      setTargetAudience(aud);
                      if (selectedProperty) {
                        setDraftLP(generateSmartLandingPage(selectedProperty, aud, themeStyle, draftLP || undefined));
                      }
                    }}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] text-[#111111] outline-none"
                  >
                    <option value="investidor">📈 Investidores (Alta Rentabilidade & Valorização)</option>
                    <option value="familia">🏡 Famílias (Conforto, Lazer & Espaço)</option>
                    <option value="luxo">💎 Alto Luxo & Exclusividade (Ultra High-End)</option>
                    <option value="primeiro_imovel">🔑 Primeiro Imóvel / Financiamento Facilitado</option>
                    <option value="geral">⚡ Geral / Padrão Equilibrado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#111111] mb-1.5 uppercase">
                    Estilo Visual da Página
                  </label>
                  <select
                    value={themeStyle}
                    onChange={(e) => {
                      const th = e.target.value as LandingPageTheme;
                      setThemeStyle(th);
                      if (draftLP) {
                        setDraftLP({ ...draftLP, themeStyle: th });
                      }
                    }}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] text-[#111111] outline-none"
                  >
                    <option value="luxury-dark">🌑 Luxury Dark (Preto Nobre & Dourado)</option>
                    <option value="clean-gold">☀️ Clean Gold (Sofisticado Claro & Areia)</option>
                    <option value="ocean-modern">🌊 Ocean Modern (Azul Oceano & Moderno)</option>
                    <option value="minimalist-stone">🏛️ Minimalist Stone (Grafite & Âmbar)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateSmartCopy}
                className="w-full py-3 rounded-xl bg-[#0A0A0A] hover:bg-[#222222] text-[#C9A227] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#C9A227]" />
                <span>✨ Regenerar Textos Persuasivos com IA para Este Imóvel</span>
              </button>
            </div>

            {/* STEP 3: Customize Copy & Options */}
            {draftLP && (
              <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E0D8] shadow-sm space-y-4">
                <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#E5E0D8] pb-3">
                  <Settings2 className="w-4 h-4" />
                  <span>Passo 3: Personalizar Informações & Gatilhos</span>
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#111111] mb-1">
                      Selo / Badge de Destaque
                    </label>
                    <input
                      type="text"
                      value={draftLP.badgeText}
                      onChange={(e) => setDraftLP({ ...draftLP, badgeText: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] text-[#111111] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#111111] mb-1">
                      Headline Principal (Título Impactante do Topo)
                    </label>
                    <input
                      type="text"
                      value={draftLP.heroHeadline}
                      onChange={(e) => setDraftLP({ ...draftLP, heroHeadline: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] text-[#111111] outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#111111] mb-1">
                      Subtítulo Persuasivo
                    </label>
                    <textarea
                      rows={2}
                      value={draftLP.heroSubheadline}
                      onChange={(e) => setDraftLP({ ...draftLP, heroSubheadline: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] text-[#111111] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#111111] mb-1">
                        Preço ou Condição em Destaque
                      </label>
                      <input
                        type="text"
                        value={draftLP.customPriceDisplay || ''}
                        onChange={(e) => setDraftLP({ ...draftLP, customPriceDisplay: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] text-[#111111] outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#111111] mb-1">
                        Identificador da URL (Slug)
                      </label>
                      <input
                        type="text"
                        value={draftLP.slug}
                        onChange={(e) => setDraftLP({ ...draftLP, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] text-[#111111] outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#111111] mb-1">
                      Gatilho de Urgência / Escassez
                    </label>
                    <input
                      type="text"
                      value={draftLP.urgencyText || ''}
                      onChange={(e) => setDraftLP({ ...draftLP, urgencyText: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] text-[#111111] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#111111] mb-1">
                      Mensagem de Abertura no WhatsApp
                    </label>
                    <input
                      type="text"
                      value={draftLP.customWhatsappMessage || ''}
                      onChange={(e) => setDraftLP({ ...draftLP, customWhatsappMessage: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] text-[#111111] outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draftLP.showMortgageSimulator}
                        onChange={(e) => setDraftLP({ ...draftLP, showMortgageSimulator: e.target.checked })}
                        className="w-4 h-4 rounded text-[#C9A227] accent-[#C9A227]"
                      />
                      <span>Exibir Simulador de Financiamento</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draftLP.active}
                        onChange={(e) => setDraftLP({ ...draftLP, active: e.target.checked })}
                        className="w-4 h-4 rounded text-[#C9A227] accent-[#C9A227]"
                      />
                      <span>Página Ativa e Online</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Save and Publish */}
            <div className="p-6 rounded-3xl bg-[#0A0A0A] text-white space-y-4 shadow-xl border border-[#C9A227]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider block">
                    Passo 4: Publicação Instantânea
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    Publicar Landing Page 100% Online
                  </h3>
                </div>

                <button
                  onClick={handleSaveLandingPage}
                  disabled={isSaving || !draftLP}
                  className="px-6 py-3 rounded-xl bg-[#C9A227] hover:bg-[#B8931F] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  <Rocket className={`w-4 h-4 ${isSaving ? 'animate-bounce' : ''}`} />
                  <span>{isSaving ? 'Salvando no Firebase...' : '🚀 Salvar & Publicar Página'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Live Preview & Instant Link Generator (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Realtime Live Links Card */}
            {draftLP && (
              <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E0D8] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
                  <span className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[#C9A227]" />
                    <span>Domínio Oficial & Links para Anúncios</span>
                  </span>
                </div>

                {/* Base Domain Input Configuration */}
                <div className="p-3 rounded-2xl bg-[#0A0A0A] text-white space-y-2 border border-[#C9A227]/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#C9A227] uppercase">Domínio Principal (Vercel)</span>
                    <span className="text-[9px] text-stone-400">Pronto para Anúncios</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={baseDomain}
                      onChange={(e) => setBaseDomain(e.target.value)}
                      placeholder="https://www.corretordanielpacheco.com.br"
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-[#1A1A1E] border border-stone-700 text-white font-mono outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-stone-400">
                    O link final é gerado a partir de <strong className="text-white">www.corretordanielpacheco.com.br/{draftLP.slug}</strong>
                  </p>
                </div>

                <div className="space-y-3">
                  
                  {/* Master Direct Production Link */}
                  <div className="p-3.5 rounded-2xl bg-[#F7F3EB] border border-[#C9A227] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-[#111111] font-mono flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#C9A227]" />
                        <span>Link Final Oficial para Campanhas</span>
                      </span>
                      <button
                        onClick={() => handleCopyUrl(getLandingPageUrl(draftLP.slug))}
                        className="text-[11px] text-[#C9A227] hover:underline font-bold flex items-center gap-1 cursor-pointer bg-[#FFFFFF] px-2 py-0.5 rounded-md border border-[#E5E0D8]"
                      >
                        {copiedUrl === getLandingPageUrl(draftLP.slug) ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedUrl === getLandingPageUrl(draftLP.slug) ? 'Copiado!' : 'Copiar Link Oficial'}</span>
                      </button>
                    </div>
                    <p className="text-xs font-mono text-[#111111] break-all select-all font-bold bg-[#FFFFFF] p-2 rounded-lg border border-[#E5E0D8]">
                      {getLandingPageUrl(draftLP.slug)}
                    </p>
                    
                    <div className="flex items-center justify-between pt-1">
                      <a
                        href={getLandingPageUrl(draftLP.slug, undefined, undefined, true)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#C9A227] hover:underline font-semibold"
                      >
                        <span>Testar no Ambiente Atual (Prévia)</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        onClick={() => handleCopyUrl(getLandingPageUrl(draftLP.slug, undefined, undefined, false))}
                        className="text-[10px] text-[#5A5A5A] hover:text-[#111111] font-mono cursor-pointer"
                      >
                        {baseDomain.replace(/^https?:\/\//, '')}/{draftLP.slug}
                      </button>
                    </div>
                  </div>

                  {/* UTM Link for Instagram / Meta Ads */}
                  <div className="p-3.5 rounded-2xl bg-[#F7F3EB] border border-[#E5E0D8] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-[#5A5A5A] font-mono">Para Instagram & Facebook Ads (Meta)</span>
                      <button
                        onClick={() => handleCopyUrl(getLandingPageUrl(draftLP.slug, 'paid_ads', 'instagram'))}
                        className="text-[10px] text-[#C9A227] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedUrl === getLandingPageUrl(draftLP.slug, 'paid_ads', 'instagram') ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedUrl === getLandingPageUrl(draftLP.slug, 'paid_ads', 'instagram') ? 'Copiado!' : 'Copiar com UTM'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] font-mono text-[#5A5A5A] break-all select-all truncate">
                      {getLandingPageUrl(draftLP.slug, 'paid_ads', 'instagram')}
                    </p>
                  </div>

                  {/* UTM Link for Google Ads */}
                  <div className="p-3.5 rounded-2xl bg-[#F7F3EB] border border-[#E5E0D8] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-[#5A5A5A] font-mono">Para Google Ads (Pesquisa / Display)</span>
                      <button
                        onClick={() => handleCopyUrl(getLandingPageUrl(draftLP.slug, 'cpc', 'google'))}
                        className="text-[10px] text-[#C9A227] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedUrl === getLandingPageUrl(draftLP.slug, 'cpc', 'google') ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedUrl === getLandingPageUrl(draftLP.slug, 'cpc', 'google') ? 'Copiado!' : 'Copiar com UTM'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] font-mono text-[#5A5A5A] break-all select-all truncate">
                      {getLandingPageUrl(draftLP.slug, 'cpc', 'google')}
                    </p>
                  </div>

                  {/* WhatsApp Direct Link */}
                  <div className="p-3.5 rounded-2xl bg-[#F7F3EB] border border-[#E5E0D8] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-[#5A5A5A] font-mono">Para Enviar no WhatsApp / Direct</span>
                      <button
                        onClick={() => handleCopyUrl(getLandingPageUrl(draftLP.slug, 'direct_share', 'whatsapp'))}
                        className="text-[10px] text-[#C9A227] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedUrl === getLandingPageUrl(draftLP.slug, 'direct_share', 'whatsapp') ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedUrl === getLandingPageUrl(draftLP.slug, 'direct_share', 'whatsapp') ? 'Copiado!' : 'Copiar Link'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] font-mono text-[#5A5A5A] break-all select-all truncate">
                      {getLandingPageUrl(draftLP.slug, 'direct_share', 'whatsapp')}
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* Visual Mini Mockup / Preview Box */}
            {draftLP && selectedProperty && (
              <div className="p-6 rounded-3xl bg-[#0F0F11] border border-stone-800 text-white space-y-4 shadow-xl">
                <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 pb-3">
                  <span className="flex items-center gap-1.5 text-[#C9A227] font-semibold">
                    <Smartphone className="w-4 h-4" />
                    <span>Prévia em Tempo Real</span>
                  </span>
                  <span className="font-mono text-[10px] uppercase">Tema: {draftLP.themeStyle}</span>
                </div>

                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-stone-800 bg-stone-900">
                  <img
                    src={selectedProperty.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'}
                    alt={selectedProperty.title}
                    className="w-full h-full object-cover filter brightness-[0.4]"
                  />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A227]">{draftLP.badgeText}</span>
                    <h4 className="text-sm font-bold text-white leading-tight line-clamp-2">{draftLP.heroHeadline}</h4>
                    <span className="text-xs font-bold text-[#C9A227] mt-1">{draftLP.customPriceDisplay}</span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Esta é uma prévia dos dados que serão renderizados na página dedicada. A página completa inclui galeria lightbox, simulador financeiro e formulário com WhatsApp.
                </p>
              </div>
            )}

          </div>

        </div>
      )}

      {/* VIEW 2: LIST OF REGISTERED LANDING PAGES */}
      {activeTab === 'list' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E5E0D8] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
            <div>
              <h3 className="text-xl font-bold text-[#111111] font-serif-luxury">
                Todas as Landing Pages Criadas
              </h3>
              <p className="text-xs text-[#5A5A5A]">
                Gerencie links, métricas de conversão e campanhas ativas.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('create')}
              className="px-4 py-2 rounded-xl bg-[#C9A227] text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Nova Página</span>
            </button>
          </div>

          {landingPages.length === 0 ? (
            <div className="p-12 text-center space-y-3 bg-[#F7F3EB] rounded-2xl border border-[#E5E0D8]">
              <Layers className="w-10 h-10 text-[#5A5A5A] mx-auto" />
              <h4 className="text-sm font-bold text-[#111111]">Nenhuma Landing Page Criada Ainda</h4>
              <p className="text-xs text-[#5A5A5A] max-w-sm mx-auto">
                Selecione qualquer imóvel do seu catálogo para gerar uma landing page exclusiva com 1-clique.
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className="px-4 py-2 rounded-xl bg-[#0A0A0A] text-white text-xs font-semibold cursor-pointer"
              >
                Gerar Primeira Landing Page
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {landingPages.map((lp) => {
                const prop = properties.find((p) => p.id === lp.propertyId || p.code === lp.propertyCode);
                const lpUrl = getLandingPageUrl(lp.slug);

                return (
                  <div
                    key={lp.id}
                    className="p-5 rounded-2xl border border-[#E5E0D8] bg-[#F7F3EB] flex flex-col justify-between gap-4 shadow-sm hover:border-[#C9A227] transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#0A0A0A] text-[#C9A227]">
                          {lp.propertyCode}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          lp.active ? 'bg-emerald-500/20 text-emerald-700' : 'bg-stone-300 text-stone-700'
                        }`}>
                          {lp.active ? 'Ativa Online' : 'Pausada'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-[#111111] line-clamp-1">{lp.title}</h4>
                      <p className="text-xs text-[#5A5A5A] line-clamp-2">{lp.heroHeadline}</p>

                      <div className="flex items-center gap-4 text-[11px] text-[#5A5A5A] pt-1">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-[#C9A227]" />
                          <span>{lp.viewsCount || 0} views</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{lp.leadsCount || 0} leads</span>
                        </span>
                      </div>

                      {/* Display Official Production URL */}
                      <div className="p-2 rounded-lg bg-[#FFFFFF] border border-[#E5E0D8] text-[10px] font-mono text-[#111111] truncate select-all">
                        {getLandingPageUrl(lp.slug)}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#E5E0D8]">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyUrl(lpUrl)}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#FFFFFF] border border-[#E5E0D8] text-xs font-semibold text-[#111111] hover:bg-[#F7F3EB] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          {copiedUrl === lpUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#C9A227]" />}
                          <span>{copiedUrl === lpUrl ? 'Copiado!' : 'Copiar Link Oficial'}</span>
                        </button>

                        <a
                          href={getLandingPageUrl(lp.slug, undefined, undefined, true)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-[#0A0A0A] text-white hover:bg-[#222222] transition-colors cursor-pointer"
                          title="Abrir Prévia no Navegador"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#C9A227]" />
                        </a>

                        <button
                          onClick={() => handleEditLP(lp)}
                          className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E5E0D8] text-[#5A5A5A] hover:text-[#111111] transition-colors cursor-pointer"
                          title="Editar Landing Page"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteLP(lp.id, lp.title)}
                          className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E5E0D8] text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Excluir Landing Page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
