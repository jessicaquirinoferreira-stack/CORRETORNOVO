import React, { useState, useEffect, useMemo } from 'react';
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
  Calendar,
  Search,
  Scale,
  Landmark,
  Calculator,
  SlidersHorizontal,
  Star,
  Users
} from 'lucide-react';
import { Property, SiteSettings, PropertyFilter } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { FilterBar } from '../components/FilterBar';
import { AboutRealtorSection } from '../components/AboutRealtorSection';
import { GoogleExcellenceCertificate } from '../components/GoogleExcellenceCertificate';
import { createWhatsAppUrl, formatCurrency, getOptimizedImageUrl, preloadImage } from '../utils/formatters';

interface HomePageProps {
  properties: Property[];
  settings: SiteSettings;
  navigate: (route: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenCuratedModal: () => void;
  isFavorite?: (id: string) => boolean;
  onToggleFavorite?: (id: string) => void;
  compareList?: Property[];
  onToggleCompare?: (property: Property) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  properties,
  settings,
  navigate,
  onSelectProperty,
  onOpenCuratedModal,
  isFavorite,
  onToggleFavorite,
  compareList = [],
  onToggleCompare,
}) => {
  const [homeFilters, setHomeFilters] = useState<PropertyFilter>({
    search: '',
    city: 'Todas',
    status: 'Todos',
    type: 'Todos',
    bedrooms: 'Todos',
    onlySignature: false,
  });

  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);

  // Quick simulator states
  const [simPrice, setSimPrice] = useState(650000);
  const [simDownPayment, setSimDownPayment] = useState(20);
  const [simMonths, setSimMonths] = useState(48);

  const citiesList = useMemo(
    () => Array.from(new Set(properties.map((p) => p.city))).filter(Boolean),
    [properties]
  );

  // Dynamic Hero Slides: Background images MUST pass photos of at least 5 registered properties
  const heroSlides = useMemo(() => {
    // 1. Filter registered properties with valid photos
    const validProps = properties.filter(
      (p) => Array.isArray(p.images) && p.images.length > 0 && Boolean(p.images[0])
    );

    // Prioritize featured properties, then order as registered
    const sortedProps = [...validProps].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    // Map each registered property to a showcase slide
    const slides = sortedProps.slice(0, 10).map((p) => ({
      url: p.images[0],
      tag: p.status || p.type || 'Em Destaque',
      title: p.title,
      code: p.code,
      location: `${p.neighborhood ? p.neighborhood + ' · ' : ''}${p.city}`,
      priceFormatted: p.priceFormatted || (p.price && p.price > 0 ? formatCurrency(p.price) : 'Consulte Valor'),
      property: p,
    }));

    // If fewer than 5 registered properties with photos, complete with luxury high-res fallback assets
    if (slides.length < 5) {
      const fallbackAssets = [
        {
          url: '/src/assets/images/hero_penthouse_luxury_1793893939626.jpg',
          tag: 'Penthouse Exclusiva',
          title: 'Reserva Especial Daniel Pacheco',
          code: 'DP-001',
          location: 'Criciúma · Vista Panorâmica',
          priceFormatted: 'Consulte Condições',
          property: validProps[0],
        },
        {
          url: '/src/assets/images/coastal_villa_modern_1793893939995.jpg',
          tag: 'Alto Padrão Beira-Mar',
          title: 'Villa Moderna Vista Mar',
          code: 'DP-002',
          location: 'Balneário Rincão · Orla',
          priceFormatted: 'Consulte Condições',
          property: validProps[1] || validProps[0],
        },
        {
          url: '/src/assets/images/luxury_tower_facade_1793893941577.jpg',
          tag: 'Lançamento Icônico',
          title: 'Torre Contemporânea',
          code: 'DP-003',
          location: 'Sul de Santa Catarina',
          priceFormatted: 'Consulte Condições',
          property: validProps[2] || validProps[0],
        },
        {
          url: '/src/assets/images/balneario_rincao_lagoon_1793893940742.jpg',
          tag: 'Loteamento Fechado',
          title: 'Condomínio Náutico & Lagoas',
          code: 'DP-004',
          location: 'Balneário Rincão · Região dos Lagos',
          priceFormatted: 'Consulte Condições',
          property: validProps[3] || validProps[0],
        },
        {
          url: '/src/assets/images/realtor_daniel_pacheco_action_1793893941198.jpg',
          tag: 'Consultoria Exclusiva',
          title: 'Assessoria de Alta Precisão',
          code: 'DP-005',
          location: 'Região da AMREC · SC',
          priceFormatted: 'Atendimento Personalizado',
          property: validProps[0],
        },
      ];

      for (const fb of fallbackAssets) {
        if (slides.length >= 5) break;
        if (!slides.some((s) => s.url === fb.url)) {
          slides.push(fb);
        }
      }
    }

    return slides;
  }, [properties]);

  // Preload hero images
  useEffect(() => {
    heroSlides.forEach((item) => preloadImage(item.url));
  }, [heroSlides]);

  // Auto-advance hero carousel
  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (homeFilters.search && homeFilters.search.trim() !== '') {
        const q = homeFilters.search.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchCity = p.city.toLowerCase().includes(q);
        const matchNeigh = p.neighborhood.toLowerCase().includes(q);
        const matchCode = p.code.toLowerCase().includes(q);
        const matchDev = (p.developer || '').toLowerCase().includes(q);
        if (!matchTitle && !matchCity && !matchNeigh && !matchCode && !matchDev) return false;
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
  }, [properties, homeFilters]);

  const marqueeProperties = useMemo(() => {
    return properties.filter((p) => p.featured).slice(0, 4);
  }, [properties]);

  const whatsappHeroUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel Pacheco! Gostaria de uma consultoria personalizada para imóveis no Sul de SC.'
  );

  const downValue = (simPrice * simDownPayment) / 100;
  const balloonTotal = simPrice * 0.25;
  const keysVal = simPrice * 0.15;
  const remaining = simPrice - downValue - balloonTotal - keysVal;
  const monthlyVal = remaining > 0 ? remaining / simMonths : 0;

  const handleSimulateWhatsApp = () => {
    const text = `*SIMULAÇÃO DIRETO COM CONSTRUTORA*\n` +
      `💵 *Valor do Imóvel:* ${formatCurrency(simPrice)}\n` +
      `📥 *Entrada (${simDownPayment}%):* ${formatCurrency(downValue)}\n` +
      `📆 *${simMonths}x Mensais de:* ~${formatCurrency(monthlyVal)}\n\n` +
      `Olá Daniel! Gostaria de consultar opções com este fluxo de pagamento no Sul de SC.`;
    window.open(createWhatsAppUrl(settings.whatsapp || '5548998001744', text), '_blank');
  };

  return (
    <div id="home-page" className="min-h-screen space-y-24 pb-24 text-[#111111]">
      {/* =========================================================================
          1. CINEMATIC LUXURY HERO SECTION (WITH REGISTERED PROPERTIES AS BACKGROUND)
         ========================================================================= */}
      <section 
        id="hero-section" 
        className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-10 overflow-hidden border-b border-[#E8E2D8] bg-[#FBF9F5]"
      >
        {/* Dynamic Background Image Crossfade with Ken Burns zoom using registered properties */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {heroSlides.map((slide, idx) => (
            <div
              key={`${slide.url}-${idx}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentHeroIdx ? 'opacity-65 scale-105' : 'opacity-0 scale-100'
              } transition-transform duration-[8000ms]`}
            >
              <img
                src={slide.url}
                alt={slide.title || slide.tag}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}

          {/* Light Theme Luxury Gradients & Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FBF9F5]/90 via-[#FBF9F5]/50 to-[#FBF9F5]/60" />
          <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-[#FBF9F5]/25 to-[#FBF9F5]/70" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#C9A227]/10 rounded-full blur-[140px] pointer-events-none" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto w-full text-center space-y-8">
          {/* Trust Kicker */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FFFFFF] border border-[#C9A227]/40 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#1F8A4C] animate-pulse" />
            <span className="text-[11px] uppercase tracking-widest text-[#0A0A0A] font-bold">
              Daniel Pacheco · Consultoria Imobiliária Oficial · CRECI 38.813
            </span>
          </div>

          {/* Marquee Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#111111] tracking-tight leading-[1.08] max-w-4xl mx-auto">
              Empreendimentos selecionados <br />
              <span className="gold-gradient-text italic font-serif-luxury font-normal">
                para morar e investir com solidez.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-[#555555] max-w-2xl mx-auto leading-relaxed font-normal">
              Apartamentos na planta, lançamentos das principais construtoras e imóveis prontos em Criciúma, Balneário Rincão e região, com condições de financiamento facilitadas.
            </p>
          </div>

          {/* Interactive Fast Search Pill Bar */}
          <div className="max-w-3xl mx-auto p-2 bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl sm:rounded-full shadow-lg flex flex-col sm:flex-row items-center gap-2">
            <div className="flex-1 w-full flex items-center gap-2.5 px-4 py-2">
              <Search className="w-4 h-4 text-[#C9A227] shrink-0" />
              <input
                type="text"
                placeholder="Busque por bairro, construtora, empreendimento..."
                value={homeFilters.search || ''}
                onChange={(e) => setHomeFilters((prev) => ({ ...prev, search: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const el = document.getElementById('portfolio-grid-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full bg-transparent text-sm text-[#111111] placeholder-[#777777] outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto px-2 pb-2 sm:pb-0">
              <select
                value={homeFilters.city || 'Todas'}
                onChange={(e) => setHomeFilters((prev) => ({ ...prev, city: e.target.value }))}
                className="bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#111111] rounded-xl px-3 py-2.5 outline-none cursor-pointer"
              >
                <option value="Todas">Todas Cidades</option>
                {citiesList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <button
                onClick={() => {
                  const el = document.getElementById('portfolio-grid-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] font-bold px-6 py-2.5 rounded-xl sm:rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm shrink-0 flex items-center gap-1.5"
              >
                <span>Buscar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[#666666] text-[11px] uppercase tracking-wider font-semibold mr-1">
              Atalhos Rápidos:
            </span>
            <button
              onClick={() => {
                setHomeFilters((prev) => ({ ...prev, status: 'Na planta', city: 'Todas' }));
                const el = document.getElementById('portfolio-grid-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#F7F3EB] border border-[#E5E0D8] text-[#444444] text-xs transition-colors cursor-pointer shadow-xs"
            >
              Na Planta
            </button>
            <button
              onClick={() => {
                setHomeFilters((prev) => ({ ...prev, status: 'Pronto', city: 'Todas' }));
                const el = document.getElementById('portfolio-grid-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#F7F3EB] border border-[#E5E0D8] text-[#444444] text-xs transition-colors cursor-pointer shadow-xs"
            >
              Imóveis Prontos
            </button>
            <button
              onClick={() => {
                setHomeFilters((prev) => ({ ...prev, city: 'Balneário Rincão', status: 'Todos' }));
                const el = document.getElementById('portfolio-grid-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#F7F3EB] border border-[#E5E0D8] text-[#444444] text-xs transition-colors cursor-pointer shadow-xs"
            >
              Balneário Rincão (Litoral)
            </button>
            <button
              onClick={() => {
                setHomeFilters((prev) => ({ ...prev, financing: 'Construtora' }));
                const el = document.getElementById('portfolio-grid-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-full bg-[#1F8A4C]/15 border border-[#1F8A4C]/30 text-[#1F8A4C] text-xs font-semibold transition-colors cursor-pointer"
            >
              Direto com Construtora
            </button>
          </div>

          {/* Trust Metric Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-[#E8E2D8]">
            <div className="p-3 bg-[#FFFFFF] rounded-2xl border border-[#E5E0D8] shadow-xs">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] block tabular-nums">50+</span>
              <span className="text-[11px] text-[#666666] uppercase tracking-wider font-medium">Imóveis Ativos</span>
            </div>
            <div className="p-3 bg-[#FFFFFF] rounded-2xl border border-[#E5E0D8] shadow-xs">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#C9A227] block tabular-nums">100%</span>
              <span className="text-[11px] text-[#666666] uppercase tracking-wider font-medium">Segurança Jurídica</span>
            </div>
            <div className="p-3 bg-[#FFFFFF] rounded-2xl border border-[#E5E0D8] shadow-xs">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1F8A4C] block tabular-nums">Direto</span>
              <span className="text-[11px] text-[#666666] uppercase tracking-wider font-medium">C/ Melhores Construtoras</span>
            </div>
            <div className="p-3 bg-[#FFFFFF] rounded-2xl border border-[#E5E0D8] shadow-xs">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] block tabular-nums">+14% a.a.</span>
              <span className="text-[11px] text-[#666666] uppercase tracking-wider font-medium">Valorização Média Regional</span>
            </div>
          </div>
        </div>

        {/* Carousel Indicators Bottom Right featuring registered property details */}
        {heroSlides[currentHeroIdx] && (
          <div 
            onClick={() => {
              if (heroSlides[currentHeroIdx].property) {
                onSelectProperty(heroSlides[currentHeroIdx].property);
              }
            }}
            className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-3 bg-[#FFFFFF]/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#E5E0D8] text-xs shadow-lg cursor-pointer hover:border-[#C9A227] transition-all group"
            title="Clique para ver detalhes deste imóvel no catálogo"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-[#E5E0D8] shrink-0 bg-[#F4EFE6]">
              <img
                src={heroSlides[currentHeroIdx].url}
                alt={heroSlides[currentHeroIdx].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="text-left pr-1">
              <span className="text-[9px] font-bold text-[#C9A227] uppercase tracking-wider block">
                {heroSlides[currentHeroIdx].tag} · {heroSlides[currentHeroIdx].code}
              </span>
              <span className="text-xs font-bold text-[#111111] block line-clamp-1 max-w-[170px] group-hover:text-[#C9A227]">
                {heroSlides[currentHeroIdx].title}
              </span>
              <span className="text-[10px] text-[#666666] block">
                {heroSlides[currentHeroIdx].location}
              </span>
            </div>
            <div className="flex gap-1.5 pl-2 border-l border-[#E5E0D8]">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentHeroIdx(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    i === currentHeroIdx ? 'w-4 bg-[#C9A227]' : 'bg-[#D0C8BC] hover:bg-[#A0988C]'
                  }`}
                  aria-label={`Ver slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          2. ASYMMETRIC BENTO-GRID SHOWCASE (DESTAQUES EXCLUSIVOS)
         ========================================================================= */}
      {marqueeProperties.length > 0 && (
        <section id="featured-bento-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5E0D8] pb-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Curadoria Daniel Pacheco
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
                Destaques da Coleção
              </h2>
              <p className="text-xs sm:text-sm text-[#555555]">
                Empreendimentos de assinatura com arquitetura autoral, acabamento premium e alto potencial de valorização.
              </p>
            </div>

            <button
              onClick={() => {
                setHomeFilters((prev) => ({ ...prev, onlySignature: true }));
                const el = document.getElementById('portfolio-grid-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-[#C9A227] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
            >
              <span>Ver todas as oportunidades exclusivas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Asymmetric Bento Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Marquis Large Card (7 cols) */}
            {marqueeProperties[0] && (
              <div 
                onClick={() => onSelectProperty(marqueeProperties[0])}
                className="lg:col-span-7 group relative bg-[#141414] rounded-3xl border border-white/10 hover:border-[#C9A227] overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-500 shadow-2xl hover:shadow-black/70 min-h-[460px]"
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src={marqueeProperties[0].images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'}
                    alt={marqueeProperties[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
                </div>

                {/* Top Badges */}
                <div className="relative z-10 p-6 flex items-center justify-between">
                  <span className="bg-[#C9A227] text-[#0A0A0A] text-xs font-extrabold px-3 py-1 rounded-md uppercase tracking-wider shadow-lg">
                    Em Destaque Principal
                  </span>
                  <span className="px-3 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-xs font-mono border border-white/10">
                    Cód. {marqueeProperties[0].code}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 p-6 sm:p-8 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#E0D3B0]">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>{marqueeProperties[0].neighborhood} · {marqueeProperties[0].city}</span>
                    {marqueeProperties[0].developer && (
                      <>
                        <span>·</span>
                        <span>{marqueeProperties[0].developer}</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white group-hover:text-[#C9A227] transition-colors leading-tight">
                    {marqueeProperties[0].title}
                  </h3>
                  <p className="text-xs text-[#C0C0C0] line-clamp-2 max-w-xl">
                    {marqueeProperties[0].shortDescription || marqueeProperties[0].description}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xl sm:text-2xl font-serif font-bold text-[#C9A227] tabular-nums">
                      {marqueeProperties[0].price ? formatCurrency(marqueeProperties[0].price) : 'Consulte Valor'}
                    </span>
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#C9A227]">
                      <span>Conhecer Empreendimento</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Side 2 Cards + Market Insight (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
              {marqueeProperties.slice(1, 3).map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => onSelectProperty(prop)}
                  className="group relative bg-[#141414] rounded-3xl border border-white/10 hover:border-[#C9A227] overflow-hidden cursor-pointer flex flex-col sm:flex-row transition-all duration-300 shadow-xl hover:shadow-black/70"
                >
                  <div className="sm:w-44 aspect-video sm:aspect-auto relative shrink-0 overflow-hidden bg-black/40">
                    <img
                      src={prop.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 bg-[#C9A227] text-[#0A0A0A] text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                      {prop.status}
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[10px] text-[#A0A0A0] block">
                        {prop.neighborhood} · {prop.city}
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#C9A227] transition-colors line-clamp-1">
                        {prop.title}
                      </h4>
                      <p className="text-[11px] text-[#8A8A8A] line-clamp-1 mt-0.5">
                        {prop.shortDescription || prop.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-bold font-serif text-[#C9A227] tabular-nums">
                        {prop.price ? formatCurrency(prop.price) : 'Consulte'}
                      </span>
                      <span className="text-[11px] text-white/80 group-hover:text-white flex items-center gap-1 font-semibold">
                        Ver <ArrowRight className="w-3 h-3 text-[#C9A227]" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Real Estate Market Intelligence Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#181818] to-[#101010] border border-[#C9A227]/30 flex items-center gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center shrink-0 text-[#C9A227]">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A227]">
                    Mercado do Sul de Santa Catarina
                  </h4>
                  <p className="text-xs text-[#B0B0B0] leading-snug">
                    Criciúma e Balneário Rincão lideram o índice de valorização imobiliária estadual com alta demanda por plantas inteligentes e orla urbanizada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          3. REGIONAL CITY DESTINATIONS HUB
         ========================================================================= */}
      <section id="cities-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5E0D8] pb-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Região Carbonífera & Litoral (AMREC)
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
              Explore por Município
            </h2>
            <p className="text-xs sm:text-sm text-[#555555]">
              Cada cidade do Sul Catarinense oferece um perfil ideal: da conveniência médica e financeira de Criciúma ao lazer costeiro do Rincão.
            </p>
          </div>

          <button
            onClick={() => navigate('cidades')}
            className="text-xs font-semibold text-[#C9A227] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
          >
            <span>Ver Guia Completo das Cidades</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Major City Panoramic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Criciúma */}
          <div
            onClick={() => {
              setHomeFilters((prev) => ({ ...prev, city: 'Criciúma', status: 'Todos' }));
              const el = document.getElementById('portfolio-grid-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative rounded-3xl overflow-hidden bg-[#141414] border border-white/10 hover:border-[#C9A227] transition-all duration-300 cursor-pointer aspect-[4/3] flex flex-col justify-end p-6 shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
              alt="Criciúma"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="relative z-10 space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#C9A227] font-semibold">
                Sede & Polo Financeiro
              </span>
              <h3 className="text-2xl font-serif font-bold text-white group-hover:text-[#C9A227] transition-colors">
                Criciúma
              </h3>
              <p className="text-xs text-[#C0C0C0] line-clamp-2">
                Centro médico, hospitais de ponta, polos universitários e bairros nobres como Pio Corrêa, Michel e Centro.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#C9A227] flex items-center gap-1">
                <span>Ver imóveis em Criciúma</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Balneário Rincão */}
          <div
            onClick={() => {
              setHomeFilters((prev) => ({ ...prev, city: 'Balneário Rincão', status: 'Todos' }));
              const el = document.getElementById('portfolio-grid-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative rounded-3xl overflow-hidden bg-[#141414] border border-white/10 hover:border-[#C9A227] transition-all duration-300 cursor-pointer aspect-[4/3] flex flex-col justify-end p-6 shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80"
              alt="Balneário Rincão"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="relative z-10 space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#4ADE80] font-semibold">
                Litoral & Veraneio
              </span>
              <h3 className="text-2xl font-serif font-bold text-white group-hover:text-[#C9A227] transition-colors">
                Balneário Rincão
              </h3>
              <p className="text-xs text-[#C0C0C0] line-clamp-2">
                Orla beira-mar totalmente revitalizada, Lagoa dos Esteves e condomínios de alto padrão na Zona Norte e Centro.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#C9A227] flex items-center gap-1">
                <span>Ver imóveis no Rincão</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Içara / Região */}
          <div
            onClick={() => {
              setHomeFilters((prev) => ({ ...prev, city: 'Içara', status: 'Todos' }));
              const el = document.getElementById('portfolio-grid-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative rounded-3xl overflow-hidden bg-[#141414] border border-white/10 hover:border-[#C9A227] transition-all duration-300 cursor-pointer aspect-[4/3] flex flex-col justify-end p-6 shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
              alt="Içara e Região"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="relative z-10 space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#38BDF8] font-semibold">
                Expansão & Loteamentos
              </span>
              <h3 className="text-2xl font-serif font-bold text-white group-hover:text-[#C9A227] transition-colors">
                Içara & Região
              </h3>
              <p className="text-xs text-[#C0C0C0] line-clamp-2">
                Conexão estratégica entre serra e mar, condomínios horizontais fechados e ampla oferta de terrenos urbanizados.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#C9A227] flex items-center gap-1">
                <span>Ver imóveis em Içara</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. INTERACTIVE DIRECT FINANCING SIMULATOR STRIP
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden text-[#111111]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F8A4C]/15 border border-[#1F8A4C]/30 text-xs text-[#1F8A4C] font-semibold">
                <Calculator className="w-3.5 h-3.5" />
                <span>Simulador Direto com a Construtora</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
                Facilidade sem Burocracia Bancária
              </h2>
              <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                Grande parte dos empreendimentos no Sul de SC aceita parcelamento direto com entrada reduzida, saldo em até 72 meses e balões anuais programados.
              </p>

              {/* Sliders */}
              <div className="space-y-4 pt-2">
                {/* Imóvel Price slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#666666]">Valor Estimado do Imóvel</span>
                    <span className="font-bold text-[#111111] tabular-nums">{formatCurrency(simPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={250000}
                    max={2500000}
                    step={50000}
                    value={simPrice}
                    onChange={(e) => setSimPrice(Number(e.target.value))}
                    className="w-full accent-[#C9A227] cursor-pointer"
                  />
                </div>

                {/* Down payment % */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#666666]">Entrada ({simDownPayment}%)</span>
                    <span className="font-bold text-[#C9A227] tabular-nums">{formatCurrency(downValue)}</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    value={simDownPayment}
                    onChange={(e) => setSimDownPayment(Number(e.target.value))}
                    className="w-full accent-[#C9A227] cursor-pointer"
                  />
                </div>

                {/* Installments term */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#666666]">Prazo das Mensais</span>
                    <span className="font-bold text-[#111111] tabular-nums">{simMonths} Meses</span>
                  </div>
                  <input
                    type="range"
                    min={24}
                    max={72}
                    step={12}
                    value={simMonths}
                    onChange={(e) => setSimMonths(Number(e.target.value))}
                    className="w-full accent-[#C9A227] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Results Box */}
            <div className="lg:col-span-6 bg-[#F7F3EB] border border-[#E5E0D8] rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#666666] block">
                  Estimativa de Parcela Mensal
                </span>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-[#C9A227] tabular-nums mt-1">
                  ~{formatCurrency(monthlyVal)} <span className="text-sm font-sans text-[#555555] font-normal">/ mês</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#E5E0D8] text-xs">
                  <div>
                    <span className="text-[#666666] block">Entrada Inicial</span>
                    <span className="font-semibold text-[#111111] tabular-nums">{formatCurrency(downValue)}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block">Balões Anuais (~4x)</span>
                    <span className="font-semibold text-[#111111] tabular-nums">~{formatCurrency(balloonTotal / 4)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSimulateWhatsApp}
                className="w-full bg-[#1F8A4C] hover:bg-[#197A42] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Simular Este Fluxo no WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. COMPLETE REAL ESTATE CATALOG WITH FILTER BAR
         ========================================================================= */}
      <section id="portfolio-grid-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Catálogo de Imóveis no Sul de Santa Catarina
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
              Todos os Imóveis ({filteredProperties.length})
            </h2>
            <p className="text-xs sm:text-sm text-[#555555]">
              Utilize os filtros abaixo para encontrar o imóvel perfeito para o seu momento de vida ou investimento.
            </p>
          </div>
        </div>

        {/* FilterBar Component */}
        <FilterBar
          filters={homeFilters}
          setFilters={setHomeFilters}
          totalCount={filteredProperties.length}
          cities={citiesList}
        />

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-[#141414] rounded-3xl border border-white/10">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#C9A227]">
              <Search className="w-8 h-8 opacity-40" />
            </div>
            <h3 className="text-lg font-bold text-white">Nenhum imóvel encontrado com esses filtros</h3>
            <p className="text-xs text-[#A0A0A0] max-w-md mx-auto">
              Tente redefinir os filtros de busca ou entre em contato direto pelo WhatsApp para receber opções sob demanda.
            </p>
            <button
              onClick={() => {
                setHomeFilters({
                  search: '',
                  city: 'Todas',
                  status: 'Todos',
                  type: 'Todos',
                  bedrooms: 'Todos',
                  onlySignature: false,
                });
              }}
              className="bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] font-bold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider cursor-pointer transition-all"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredProperties.map((prop, idx) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                settings={settings}
                onSelect={onSelectProperty}
                priority={idx < 3}
                isFavorite={isFavorite ? isFavorite(prop.id) : false}
                onToggleFavorite={onToggleFavorite}
                isCompared={compareList.some((c) => c.id === prop.id)}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          6. ABOUT REALTOR & AUTHORITY SECTION
         ========================================================================= */}
      <AboutRealtorSection
        settings={settings}
        onOpenCuratedModal={onOpenCuratedModal}
      />

      {/* =========================================================================
          7. GOOGLE EXCELLENCE CERTIFICATE & 5-STAR CLIENT REVIEWS
         ========================================================================= */}
      <GoogleExcellenceCertificate settings={settings} />
    </div>
  );
};
