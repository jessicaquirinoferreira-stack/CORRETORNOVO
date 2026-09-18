import React, { useState } from 'react';
import { 
  ArrowRight, 
  MessageCircle, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Compass, 
  Key, 
  TrendingUp, 
  Award,
  ChevronRight,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Property, SiteSettings, PropertyFilter } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { FilterBar } from '../components/FilterBar';
import { AboutRealtorSection } from '../components/AboutRealtorSection';
import { GoogleExcellenceCertificate } from '../components/GoogleExcellenceCertificate';
import { createWhatsAppUrl, getOptimizedImageUrl, preloadImage } from '../utils/formatters';

interface HomePageProps {
  properties: Property[];
  settings: SiteSettings;
  navigate: (route: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenCuratedModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  properties,
  settings,
  navigate,
  onSelectProperty,
  onOpenCuratedModal,
}) => {
  const [homeFilters, setHomeFilters] = useState<PropertyFilter>({
    search: '',
    city: 'Todas',
    status: 'Todos',
    type: 'Todos',
    bedrooms: 'Todos',
    onlySignature: false,
  });

  const citiesList = Array.from(new Set(properties.map((p) => p.city))).filter(Boolean);

  // Filter properties
  const filteredProperties = properties.filter((p) => {
    if (homeFilters.search && homeFilters.search.trim() !== '') {
      const q = homeFilters.search.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCity = p.city.toLowerCase().includes(q);
      const matchNeigh = p.neighborhood.toLowerCase().includes(q);
      const matchCode = p.code.toLowerCase().includes(q);
      if (!matchTitle && !matchCity && !matchNeigh && !matchCode) return false;
    }
    if (homeFilters.city && homeFilters.city !== 'Todas') {
      if (p.city.toLowerCase() !== homeFilters.city.toLowerCase()) return false;
    }
    if (homeFilters.status && homeFilters.status !== 'Todos') {
      if (p.status !== homeFilters.status) return false;
    }
    if (homeFilters.type && homeFilters.type !== 'Todos') {
      if (p.type !== homeFilters.type) return false;
    }
    if (homeFilters.bedrooms && homeFilters.bedrooms !== 'Todos') {
      const reqBed = parseInt(homeFilters.bedrooms, 10);
      if ((p.bedrooms || 0) < reqBed) return false;
    }
    if (homeFilters.onlySignature && !p.featured) {
      return false;
    }
    if (homeFilters.financing === 'Bancario' && !p.bankFinancing) {
      return false;
    }
    if (homeFilters.financing === 'Construtora' && !p.directFinancing) {
      return false;
    }
    return true;
  });

  const signatureProperties = properties.filter((p) => p.featured).slice(0, 6);

  const heroImages = React.useMemo(() => {
    const allImgs: string[] = properties.flatMap(p => p.images || []);
    return allImgs.length > 0 
      ? Array.from(new Set(allImgs)).slice(0, 5).map((img) => getOptimizedImageUrl(img, 'hero'))
      : [getOptimizedImageUrl("https://images.unsplash.com/photo-1600607687920-4e2a09cf159d", 'hero')];
  }, [properties]);

  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  // Pré-carrega de imediato as duas primeiras imagens do banner para exibição sem delay
  React.useEffect(() => {
    if (heroImages.length > 0) {
      preloadImage(heroImages[0]);
      if (heroImages.length > 1) {
        preloadImage(heroImages[1]);
      }
    }
  }, [heroImages]);

  React.useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroImages.length]);

  const whatsappHeroUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel Pacheco! Gostaria de uma consultoria para encontrar o imóvel ideal no Sul de SC.'
  );

  return (
    <div id="home-page" className="min-vh-screen space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section 
        id="hero-section" 
        className="relative pt-28 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden border-b border-[#E5E0D8]"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#1F8A4C]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline, Subtitle, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left z-10">
            {/* Top Indicator */}
            <div className="flex items-center gap-2.5">
              <img
                src={settings.logoUrl || "https://i.postimg.cc/wv36Qv93/Chat-GPT-Image-26-de-ago-de-2026-09-58-21-(1).png"}
                alt="Daniel Pacheco Logo"
                className="h-7 w-auto max-w-[120px] object-contain shrink-0 filter drop-shadow-sm"
              />
              <span className="h-3 w-[1px] bg-[#C9A227]/40" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A227] font-semibold">
                Exclusive Selection • Sul Catarinense
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#111111] tracking-tight leading-[1.08]">
              Encontre o lugar <br />
              <span className="italic text-[#C9A227]">certo.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#5A5A5A] max-w-lg leading-relaxed font-normal">
              {settings.heroSubtitle ||
                'Empreendimentos oficiais e imóveis prontos, selecionados para diferentes momentos de compra no Sul de Santa Catarina.'}
            </p>

            {/* CTAs Row */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {/* Primary Button */}
              <button
                id="hero-explore-btn"
                onClick={() => {
                  const el = document.getElementById('featured-contrast-section') || document.getElementById('portfolio-grid-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else navigate('portfolio');
                }}
                className="bg-[#C9A227] text-[#0A0A0A] px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#B8931F] transition-all cursor-pointer shadow-md flex items-center gap-2 rounded-xl"
              >
                <span>Explorar Portfólio</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#0A0A0A]" />
              </button>

              {/* Gold Outline Button */}
              <button
                id="hero-consulting-btn"
                onClick={onOpenCuratedModal}
                className="border border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-[#0A0A0A] px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer rounded-xl bg-white/50"
              >
                Consultoria VIP
              </button>

              {/* Green WhatsApp Button */}
              <a
                id="hero-whatsapp-btn"
                href={whatsappHeroUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1F8A4C] text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#197A42] shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Quick stats / Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E5E0D8] max-w-lg">
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-serif text-[#111111] block">50+</span>
                <span className="text-[10px] text-[#5A5A5A] uppercase tracking-widest font-semibold">Imóveis Ativos</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-serif text-[#C9A227] block">100%</span>
                <span className="text-[10px] text-[#5A5A5A] uppercase tracking-widest font-semibold">Oficiais & Seguros</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-serif text-[#1F8A4C] block">Direto</span>
                <span className="text-[10px] text-[#5A5A5A] uppercase tracking-widest font-semibold">Com Construtora</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-end Interior with Gradient Overlay and Dot Indicators */}
          <div className="lg:col-span-5 relative z-10">
            <div className="relative rounded-2xl overflow-hidden border border-[#E5E0D8] shadow-2xl aspect-[4/3] lg:aspect-auto lg:h-[460px] group bg-white">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
              {heroImages.map((src, idx) => (
                <img
                  key={src}
                  src={src}
                  alt="Empreendimentos Sul Catarinense"
                  fetchPriority={idx === 0 ? 'high' : 'auto'}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                    idx === currentHeroImage 
                      ? "opacity-95 scale-100 group-hover:scale-105 z-0" 
                      : "opacity-0 scale-100 -z-10"
                  }`}
                />
              ))}

              {/* Floating Badge Top */}
              <div className="absolute top-5 left-5 z-20 bg-[#0A0A0A]/90 backdrop-blur-md border border-[#C9A227]/40 px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-[#1F8A4C] animate-ping" />
                <span className="font-semibold text-[#FFFFFF]">Criciúma & Balneário Rincão</span>
              </div>

              {/* Bottom Dot Indicators */}
              <div className="absolute bottom-6 right-6 z-20 flex gap-2 items-center bg-[#0A0A0A]/80 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                {heroImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentHeroImage(idx)}
                    className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                      idx === currentHeroImage ? 'bg-[#C9A227]' : 'bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Ir para a imagem ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PORTFÓLIO EM DESTAQUE (High-Contrast Immersive Light Section) */}
      <section id="featured-contrast-section" className="bg-[#F7F3EB] text-[#0A0A0A] py-14 px-4 sm:px-8 lg:px-12 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A0A0A]">
                Portfólio em Destaque
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-[#5A5A5A] mt-1">
                Criciúma, Içara e Balneário Rincão
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-tighter">
              <button
                onClick={() => {
                  setHomeFilters((prev) => ({ ...prev, status: 'Todos', city: 'Todas' }));
                  const el = document.getElementById('portfolio-grid-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-1.5 border border-[#0A0A0A] bg-[#0A0A0A] text-[#FFFFFF] hover:bg-[#1F1F1F] rounded-md transition-colors cursor-pointer"
              >
                Todos
              </button>
              <button
                onClick={() => {
                  setHomeFilters((prev) => ({ ...prev, status: 'Pronto' }));
                  const el = document.getElementById('portfolio-grid-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-1.5 border border-[#0A0A0A]/20 hover:border-[#0A0A0A] text-[#0A0A0A] rounded-md transition-colors cursor-pointer"
              >
                Prontos
              </button>
              <button
                onClick={() => {
                  setHomeFilters((prev) => ({ ...prev, status: 'Na planta' }));
                  const el = document.getElementById('portfolio-grid-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-1.5 border border-[#0A0A0A]/20 hover:border-[#0A0A0A] text-[#0A0A0A] rounded-md transition-colors cursor-pointer"
              >
                Na Planta
              </button>
              <button
                onClick={() => navigate('terrenos')}
                className="px-4 py-1.5 border border-[#0A0A0A]/20 hover:border-[#0A0A0A] text-[#0A0A0A] rounded-md transition-colors cursor-pointer"
              >
                Terrenos / Loteamentos
              </button>
              <button
                onClick={() => navigate('cidades')}
                className="px-4 py-1.5 border border-[#0A0A0A]/20 hover:border-[#0A0A0A] text-[#0A0A0A] rounded-md transition-colors cursor-pointer"
              >
                Cidades
              </button>
            </div>
          </div>

          {/* Quick 4 Columns Showcase from Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.slice(0, 4).map((prop) => (
              <div
                key={prop.id}
                onClick={() => onSelectProperty(prop)}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl border border-[#E5E0D8] group cursor-pointer overflow-hidden relative transition-all duration-300 flex flex-col justify-between"
              >
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-[#C9A227] text-[#0A0A0A] text-[9px] font-extrabold px-2.5 py-0.5 uppercase tracking-tighter shadow-sm rounded-sm">
                    {prop.status}
                  </span>
                </div>
                <div className="h-40 overflow-hidden relative bg-[#F7F3EB]">
                  <img
                    src={prop.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400'}
                    alt={prop.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xs font-bold leading-tight line-clamp-1 text-[#0A0A0A] group-hover:text-[#C9A227] transition-colors">
                    {prop.title}
                  </h3>
                  <p className="text-[10px] text-[#5A5A5A] mb-2 mt-0.5">
                    {prop.city} • {prop.bedrooms || 2} Quartos • {prop.neighborhood}
                  </p>
                  <p className="text-xs font-serif text-[#C9A227] font-bold">
                    {'A Consultar'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Seleção Exclusiva SECTION */}
      {signatureProperties.length > 0 && (
        <section id="signature-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A227] uppercase tracking-wider mb-2">
                <Award className="w-4 h-4 text-[#C9A227]" />
                <span>Seleção Exclusiva</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-[#111111]">
                Seleção Exclusiva
              </h2>
              <p className="text-xs sm:text-sm text-[#5A5A5A] max-w-xl mt-1">
                {settings.signatureSubtitle || 'Imóveis para morar e investir com os mais altos padrões de acabamento, localização e retorno.'}
              </p>
            </div>

            <button
              id="view-all-signature-btn"
              onClick={() => {
                setHomeFilters((prev) => ({ ...prev, onlySignature: true }));
                const el = document.getElementById('portfolio-grid-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-[#C9A227] hover:text-[#111111] flex items-center gap-1.5 transition-colors self-start md:self-auto cursor-pointer"
            >
              <span>Ver todas as oportunidades exclusivas</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Signature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signatureProperties.map((property, idx) => (
              <PropertyCard
                key={property.id}
                property={property}
                settings={settings}
                onSelect={onSelectProperty}
                priority={idx < 3}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. PORTFÓLIO COMPLETO COM FILTROS DINÂMICOS */}
      <section id="portfolio-grid-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest">
            Portfólio Oficial
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#111111]">
            Explore Nosso Acervo de Imóveis
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5A5A]">
            Filtre por status, tipo de imóvel, cidade ou características específicas.
          </p>
        </div>

        {/* Filter Bar Component */}
        <div className="mb-8">
          <FilterBar
            filters={homeFilters}
            setFilters={setHomeFilters}
            totalCount={filteredProperties.length}
            cities={citiesList}
          />
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.slice(0, 12).map((property, idx) => (
              <PropertyCard
                key={property.id}
                property={property}
                settings={settings}
                onSelect={onSelectProperty}
                priority={idx < 3}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-8 space-y-4 shadow-sm">
            <Building2 className="w-12 h-12 text-[#5A5A5A] mx-auto" />
            <h3 className="text-xl font-serif-luxury text-[#111111]">Nenhum imóvel corresponde aos filtros selecionados</h3>
            <p className="text-xs text-[#5A5A5A] max-w-md mx-auto">
              Experimente ajustar os filtros de cidade ou tipo, ou solicite nossa Consultoria VIP para encontrarmos imóveis fora do portfólio público.
            </p>
            <button
              onClick={() => setHomeFilters({ search: '', city: 'Todas', status: 'Todos', type: 'Todos', bedrooms: 'Todos', onlySignature: false })}
              className="px-5 py-2.5 bg-[#C9A227] text-[#0A0A0A] hover:bg-[#B8931F] rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Limpar Filtros
            </button>
          </div>
        )}

        {filteredProperties.length > 12 && (
          <div className="text-center pt-10">
            <button
              id="home-load-more-btn"
              onClick={() => navigate('portfolio')}
              className="px-8 py-3.5 rounded-xl bg-[#FFFFFF] border border-[#E5E0D8] hover:border-[#C9A227] text-xs font-bold text-[#111111] hover:text-[#C9A227] transition-all shadow-sm cursor-pointer"
            >
              Ver Todos os {filteredProperties.length} Imóveis Disponíveis
            </button>
          </div>
        )}
      </section>

      {/* 4. SEÇÃO "O PRÓXIMO PASSO, SEM ATALHOS" (3 Numbered Cards) */}
      <section id="next-step-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left max-w-3xl mb-12 space-y-2">
          <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest">
            Metodologia Consultiva
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-[#111111]">
            O próximo passo, sem atalhos.
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5A5A]">
            Um processo claro e seguro para você tomar a melhor decisão patrimonial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 01: Comprar */}
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-8 space-y-5 hover:border-[#C9A227] hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between">
              <span className="font-serif-luxury text-4xl font-bold text-[#E5E0D8] group-hover:text-[#C9A227] transition-colors">
                01
              </span>
              <div className="p-3 rounded-2xl bg-[#F7F3EB] text-[#C9A227]">
                <Key className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#111111]">Comprar para Morar</h3>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              Diagnóstico detalhado da rotina da sua família: proximidade de escolas, vias de tráfego, incidência solar e infraestrutura de lazer nos bairros mais nobres de Criciúma e região.
            </p>
            <ul className="space-y-2 text-xs text-[#5A5A5A] pt-2 border-t border-[#E5E0D8]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227]" />
                <span className="text-[#111111]">Avaliação minuciosa de plantas</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227]" />
                <span className="text-[#111111]">Vagas de garagem e depósitos privativos</span>
              </li>
            </ul>
          </div>

          {/* Card 02: Investir */}
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-8 space-y-5 hover:border-[#C9A227] hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between">
              <span className="font-serif-luxury text-4xl font-bold text-[#E5E0D8] group-hover:text-[#C9A227] transition-colors">
                02
              </span>
              <div className="p-3 rounded-2xl bg-[#F7F3EB] text-[#C9A227]">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#111111]">Investir na Planta</h3>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              Acesso a tabelas de lançamento exclusivas (preço zero de lançamento), parcelamento facilitado direto com a construtora e projeção matemática de valorização patrimonial até a entrega.
            </p>
            <ul className="space-y-2 text-xs text-[#5A5A5A] pt-2 border-t border-[#E5E0D8]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227]" />
                <span className="text-[#111111]">Valorização estimada de 20% a 40% na obra</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227]" />
                <span className="text-[#111111]">Financiamento direto sem burocracia</span>
              </li>
            </ul>
          </div>

          {/* Card 03: Imóvel Pronto */}
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-8 space-y-5 hover:border-[#C9A227] hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between">
              <span className="font-serif-luxury text-4xl font-bold text-[#E5E0D8] group-hover:text-[#C9A227] transition-colors">
                03
              </span>
              <div className="p-3 rounded-2xl bg-[#F7F3EB] text-[#C9A227]">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#111111]">Imóvel Pronto & Seguro</h3>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              Auditoria documental completa, análise de matrícula, certidões negativas e intermediação transparente para que a mudança ou locação ocorra de forma rápida e 100% legal.
            </p>
            <ul className="space-y-2 text-xs text-[#5A5A5A] pt-2 border-t border-[#E5E0D8]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227]" />
                <span className="text-[#111111]">Chave na mão com agilidade</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227]" />
                <span className="text-[#111111]">Assessoria jurídica e cartorária inclusa</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. SEÇÃO SOBRE O CORRETOR DANIEL PACHECO */}
      <AboutRealtorSection
        settings={settings}
        onOpenCuratedModal={onOpenCuratedModal}
      />

      {/* CERTIFICADO OFICIAL GOOGLE 5.0 ESTRELAS & LINKS */}
      <GoogleExcellenceCertificate settings={settings} />

      {/* 6. SEÇÃO DE CONTEÚDO "IMÓVEIS VISTOS DE PERTO" (Contraste Dark Stiven Allan) */}
      <section id="close-look-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A0A0A] border border-[#222222] rounded-3xl p-8 sm:p-12 overflow-hidden relative shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest">
                Consultoria Imersiva
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-[#FFFFFF]">
                Imóveis Vistos de Perto
              </h2>
              <p className="text-xs sm:text-sm text-[#E5E0D8]/80 leading-relaxed">
                Cada empreendimento do nosso portfólio passa por uma vistoria criteriosa antes de ser apresentado. Analisamos o padrão das esquadrias, espessura das lajes para isolamento acústico, solidez da construtora e potencial de valorização do entorno.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-[#C9A227]/10 text-[#C9A227] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#FFFFFF]">Visitas Guiadas com Agendamento VIP</h4>
                    <p className="text-xs text-[#E5E0D8]/70">Acompanhamento exclusivo nos plantões e apartamentos decorados.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-[#C9A227]/10 text-[#C9A227] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#FFFFFF]">Simulação de Fluxo Financeiro Real</h4>
                    <p className="text-xs text-[#E5E0D8]/70">Planejamento de desembolso transparente sem surpresas com correções.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onOpenCuratedModal}
                  className="px-6 py-3.5 bg-[#C9A227] text-[#0A0A0A] font-bold text-xs rounded-xl hover:bg-[#B8931F] transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Agendar Atendimento Consultivo</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[4/5] border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=95"
                    alt="Visão de perto do living"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 text-xs">
                  <span className="text-[#C9A227] font-semibold block">Acabamento Superior</span>
                  <p className="text-[#E5E0D8]/70 text-[11px] mt-0.5">Porcelanatos de grande formato e rebaixo em gesso.</p>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 text-xs">
                  <span className="text-[#1F8A4C] font-semibold block">Varandas com Churrasqueira</span>
                  <p className="text-[#E5E0D8]/70 text-[11px] mt-0.5">Espaços gourmet com duto a carvão individual.</p>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[4/5] border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=2400&q=95"
                    alt="Varanda gourmet vista de perto"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA FINAL COM WHATSAPP (Contraste Dark Stiven Allan) */}
      <section id="final-cta-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A0A0A] border border-[#222222] rounded-3xl p-8 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(#C9A227_1px,transparent_1px)] opacity-10 [background-size:20px_20px] pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest">
              Pronto para dar o próximo passo?
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#FFFFFF] leading-tight">
              Seu próximo imóvel começa com a pergunta certa.
            </h2>
            <p className="text-xs sm:text-base text-[#E5E0D8]/80 font-light">
              Fale diretamente com o Corretor Daniel Pacheco no WhatsApp e receba orientações claras e sem rodeios para sua aquisição no Sul Catarinense.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <a
              id="final-cta-whatsapp-btn"
              href={whatsappHeroUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1F8A4C] hover:bg-[#197A42] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-[#1F8A4C]/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current text-white" />
              <span>Chamar Daniel Pacheco no WhatsApp</span>
            </a>

            <button
              onClick={onOpenCuratedModal}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#141414] hover:bg-[#222222] border border-white/15 text-xs font-semibold text-[#FFFFFF] hover:text-[#C9A227] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C9A227]" />
              <span>Preencher Consultoria Personalizada</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
