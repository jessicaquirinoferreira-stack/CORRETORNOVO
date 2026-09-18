import React, { useState, useEffect } from 'react';
import { Property, SiteSettings, LandingPage, LandingPageTheme } from '../types';
import { 
  Building2, 
  MapPin, 
  BedDouble, 
  Bath, 
  Car, 
  Maximize2, 
  CheckCircle2, 
  Sparkles, 
  Phone, 
  ShieldCheck, 
  Calculator, 
  ArrowRight, 
  Share2, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Award,
  Send,
  MessageSquareQuote
} from 'lucide-react';
import { formatCurrency, getHighResImages, getOptimizedImageUrl, preloadImage } from '../utils/formatters';
import { incrementLandingPageView, incrementLandingPageLead } from '../firebase/firebaseService';

interface LandingPageViewProps {
  landingPage: LandingPage;
  property: Property;
  settings: SiteSettings;
  onNavigateHome: () => void;
}

export function LandingPageView({ landingPage, property, settings, onNavigateHome }: LandingPageViewProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [leadName, setLeadName] = useState<string>('');
  const [leadPhone, setLeadPhone] = useState<string>('');
  const [leadEmail, setLeadEmail] = useState<string>('');
  const [leadMessage, setLeadMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Simulator state
  const propertyPrice = property.price || 850000;
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanMonths, setLoanMonths] = useState<number>(360);
  const [annualInterestRate] = useState<number>(10.5);

  const images = getHighResImages(property.images);

  // Preload first 2 images immediately for instant above-the-fold render
  useEffect(() => {
    if (images.length > 0) {
      preloadImage(getOptimizedImageUrl(images[0], 'hero'));
      if (images.length > 1) {
        preloadImage(getOptimizedImageUrl(images[1], 'hero'));
      }
    }
  }, [images]);

  // Track page view once on mount
  useEffect(() => {
    if (landingPage.id) {
      incrementLandingPageView(landingPage.id);
    }
  }, [landingPage.id]);

  // Calculations for Simulator
  const downPaymentValue = (propertyPrice * downPaymentPercent) / 100;
  const financedAmount = propertyPrice - downPaymentValue;
  const monthlyRate = annualInterestRate / 100 / 12;
  const monthlyPayment = financedAmount > 0
    ? (financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanMonths))) /
      (Math.pow(1 + monthlyRate, loanMonths) - 1)
    : 0;

  // Visual Themes styling configuration
  const getThemeClasses = (theme: LandingPageTheme) => {
    switch (theme) {
      case 'luxury-dark':
        return {
          bg: 'bg-[#0F0F11]',
          text: 'text-[#F5F5F7]',
          subtext: 'text-[#A1A1A6]',
          cardBg: 'bg-[#18181B] border-[#27272A]',
          accent: 'text-[#D4AF37]',
          accentBg: 'bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#C59F27]',
          pillBg: 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30',
          navBg: 'bg-[#0F0F11]/90 backdrop-blur-md border-[#27272A]',
        };
      case 'ocean-modern':
        return {
          bg: 'bg-[#0B1528]',
          text: 'text-[#F0F6FC]',
          subtext: 'text-[#94A3B8]',
          cardBg: 'bg-[#112240] border-[#1E3A8A]/40',
          accent: 'text-[#38BDF8]',
          accentBg: 'bg-[#38BDF8] text-[#0B1528] hover:bg-[#0EA5E9]',
          pillBg: 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30',
          navBg: 'bg-[#0B1528]/90 backdrop-blur-md border-[#1E3A8A]/40',
        };
      case 'minimalist-stone':
        return {
          bg: 'bg-[#1C1917]',
          text: 'text-[#FAFAF9]',
          subtext: 'text-[#A8A29E]',
          cardBg: 'bg-[#292524] border-[#44403C]',
          accent: 'text-[#F59E0B]',
          accentBg: 'bg-[#F59E0B] text-[#1C1917] hover:bg-[#D97706]',
          pillBg: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30',
          navBg: 'bg-[#1C1917]/90 backdrop-blur-md border-[#44403C]',
        };
      case 'clean-gold':
      default:
        return {
          bg: 'bg-[#F7F3EB]',
          text: 'text-[#111111]',
          subtext: 'text-[#5A5A5A]',
          cardBg: 'bg-[#FFFFFF] border-[#E5E0D8]',
          accent: 'text-[#C9A227]',
          accentBg: 'bg-[#C9A227] text-[#0A0A0A] hover:bg-[#B8931F]',
          pillBg: 'bg-[#C9A227]/15 text-[#C9A227] border-[#C9A227]/30',
          navBg: 'bg-[#FFFFFF]/90 backdrop-blur-md border-[#E5E0D8]',
        };
    }
  };

  const themeStyle = landingPage.themeStyle || 'luxury-dark';
  const theme = getThemeClasses(themeStyle);

  // WhatsApp link generator
  const getWhatsAppLink = (customText?: string) => {
    const rawNumber = settings.whatsapp || '5548999999999';
    const cleanNumber = rawNumber.replace(/\D/g, '');
    const defaultMsg = landingPage.customWhatsappMessage || `Olá Daniel Pacheco! Vi a página exclusiva do imóvel ${property.title} (Cód: ${property.code}) e quero agendar uma apresentação.`;
    const message = encodeURIComponent(customText || defaultMsg);
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  const handleCopyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    setIsSubmitting(true);

    if (landingPage.id) {
      incrementLandingPageLead(landingPage.id);
    }

    // Build WhatsApp message with lead info and trigger direct chat
    const leadText = `*NOVO LEAD DA LANDING PAGE EXCLUSIVA:*\n\n` +
      `🏢 *Imóvel:* ${property.title} (Cód: ${property.code})\n` +
      `👤 *Nome:* ${leadName}\n` +
      `📱 *Telefone/WhatsApp:* ${leadPhone}\n` +
      (leadEmail ? `📧 *E-mail:* ${leadEmail}\n` : '') +
      (leadMessage ? `💬 *Mensagem/Dúvida:* ${leadMessage}\n` : '') +
      `\n🔗 *Landing Page:* ${landingPage.slug}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      window.open(getWhatsAppLink(leadText), '_blank');
    }, 600);
  };

  return (
    <div id="landing-page-root" className={`min-h-screen ${theme.bg} ${theme.text} font-sans selection:bg-[#C9A227]/30 selection:text-white transition-colors duration-300`}>
      
      {/* 1. TOP STICKY CONVERSION HEADER */}
      <header className={`sticky top-0 z-40 ${theme.navBg} border-b py-3.5 px-4 sm:px-8 transition-all`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onNavigateHome}
              className="text-xs text-stone-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="Voltar ao portal principal"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Portal Imobiliário</span>
            </button>
            <span className="text-stone-600">|</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider px-2 py-0.5 rounded-md bg-stone-800 border border-stone-700 text-stone-300">
                {property.code}
              </span>
              <span className="text-xs font-semibold truncate max-w-[140px] sm:max-w-[260px]">
                {property.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyShareLink}
              className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 border border-stone-700 text-stone-300 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Copiar Link da Landing Page"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{copiedLink ? 'Link Copiado!' : 'Compartilhar'}</span>
            </button>

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105 ${theme.accentBg}`}
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Falar c/ Daniel Pacheco</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. HERO HIGH-IMPACT SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={getOptimizedImageUrl(images[0], 'hero')}
            alt={property.title}
            fetchPriority="high"
            decoding="async"
            loading="eager"
            className="w-full h-full object-cover object-center filter brightness-[0.22] scale-105 animate-pulse transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] via-[#0F0F11]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Copy & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase shadow-sm animate-fade-in">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{landingPage.badgeText || 'Oportunidade Exclusiva'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] font-serif-luxury">
              {landingPage.heroHeadline || property.title}
            </h1>

            {/* Subheadline */}
            <p className={`text-base sm:text-lg leading-relaxed ${theme.subtext}`}>
              {landingPage.heroSubheadline || property.shortDescription}
            </p>

            {/* Price & Status Highlight */}
            <div className="flex flex-wrap items-center gap-4 py-2">
              <div className="px-5 py-3 rounded-2xl bg-black/40 border border-stone-800 backdrop-blur-md">
                <span className="text-[10px] uppercase font-mono tracking-wider block text-stone-400">Condição / Valor</span>
                <span className={`text-2xl sm:text-3xl font-extrabold ${theme.accent}`}>
                  {landingPage.customPriceDisplay || (property.priceFormatted ? property.priceFormatted : 'Consulte Condições')}
                </span>
              </div>

              {property.status && (
                <div className="px-4 py-3 rounded-2xl bg-black/40 border border-stone-800 backdrop-blur-md">
                  <span className="text-[10px] uppercase font-mono tracking-wider block text-stone-400">Estágio</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    {property.status}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {property.areaM2 && (
                <div className={`p-3.5 rounded-2xl border ${theme.cardBg} flex items-center gap-3`}>
                  <Maximize2 className={`w-5 h-5 ${theme.accent} shrink-0`} />
                  <div>
                    <span className="text-[10px] text-stone-400 block font-mono uppercase">Área Privativa</span>
                    <span className="text-sm font-bold text-white">{property.areaM2} m²</span>
                  </div>
                </div>
              )}

              {property.bedrooms && (
                <div className={`p-3.5 rounded-2xl border ${theme.cardBg} flex items-center gap-3`}>
                  <BedDouble className={`w-5 h-5 ${theme.accent} shrink-0`} />
                  <div>
                    <span className="text-[10px] text-stone-400 block font-mono uppercase">Dormitórios</span>
                    <span className="text-sm font-bold text-white">{property.bedrooms} Quartos</span>
                  </div>
                </div>
              )}

              {property.suites && (
                <div className={`p-3.5 rounded-2xl border ${theme.cardBg} flex items-center gap-3`}>
                  <Bath className={`w-5 h-5 ${theme.accent} shrink-0`} />
                  <div>
                    <span className="text-[10px] text-stone-400 block font-mono uppercase">Suítes</span>
                    <span className="text-sm font-bold text-white">{property.suites} Suíte(s)</span>
                  </div>
                </div>
              )}

              {property.garageSpaces && (
                <div className={`p-3.5 rounded-2xl border ${theme.cardBg} flex items-center gap-3`}>
                  <Car className={`w-5 h-5 ${theme.accent} shrink-0`} />
                  <div>
                    <span className="text-[10px] text-stone-400 block font-mono uppercase">Garagem</span>
                    <span className="text-sm font-bold text-white">{property.garageSpaces} Vaga(s)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Urgency Alert */}
            {landingPage.urgencyText && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
                <Clock className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
                <span>{landingPage.urgencyText}</span>
              </div>
            )}
          </div>

          {/* Right Column: Direct Fast Lead Capture Form */}
          <div className="lg:col-span-5">
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl backdrop-blur-xl relative ${theme.cardBg}`}>
              
              <div className="mb-6 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A227] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                  <span>Atendimento Direto & Exclusivo</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
                  Receba o Book Completo & Valores
                </h3>
                <p className="text-xs text-stone-400">
                  Preencha para receber plantas, memorial descritivo e tabela de pagamento direto no seu WhatsApp.
                </p>
              </div>

              {submitSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">Solicitação Recebida!</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Você está sendo redirecionado para o WhatsApp de Daniel Pacheco com as informações prioritárias deste imóvel.
                  </p>
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 ${theme.accentBg}`}
                  >
                    <span>Abrir Conversa Agora</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1 uppercase tracking-wider">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Roberto Silva"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-900/90 border border-stone-700 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#C9A227] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1 uppercase tracking-wider">
                      WhatsApp com DDD *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: (48) 99999-9999"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-900/90 border border-stone-700 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#C9A227] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1 uppercase tracking-wider">
                      E-mail (Opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-900/90 border border-stone-700 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#C9A227] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1 uppercase tracking-wider">
                      Objetivo / Dúvida
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Quero saber a forma de pagamento e visitas"
                      value={leadMessage}
                      onChange={(e) => setLeadMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-900/90 border border-stone-700 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#C9A227] transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer disabled:opacity-50 ${theme.accentBg}`}
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Enviando Dados...' : 'Receber Apresentação Completa'}</span>
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400 text-center pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Seus dados estão protegidos pela LGPD. Sem spam.</span>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 3. PHOTO GALLERY & MEDIA EXPLORATION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A227] uppercase tracking-wider mb-1">
              <Eye className="w-4 h-4 text-[#C9A227]" />
              <span>Tour Visual em Alta Resolução</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif-luxury text-white">
              Galeria de Fotos & Ambientes
            </h2>
          </div>
          <p className="text-xs text-stone-400 max-w-md">
            Clique nas imagens para expandir em tela cheia com alta definição de detalhes e acabamento.
          </p>
        </div>

        {/* Main Big Featured Preview */}
        <div className="relative rounded-3xl overflow-hidden border border-stone-800 aspect-[16/9] md:aspect-[21/9] bg-stone-950 shadow-2xl group">
          <img
            src={getOptimizedImageUrl(images[activeImageIndex], 'hero')}
            alt={`${property.title} - Foto ${activeImageIndex + 1}`}
            decoding="async"
            className="w-full h-full object-cover object-center cursor-pointer transition-transform duration-700 group-hover:scale-105"
            onClick={() => setIsLightboxOpen(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

          {/* Navigation overlay controls */}
          <button
            onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-stone-700 text-white backdrop-blur-md transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-stone-700 text-white backdrop-blur-md transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 sm:left-6 flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-black/70 border border-stone-700 text-xs font-mono text-white">
              {activeImageIndex + 1} / {images.length} Fotos
            </span>
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="px-3.5 py-1 rounded-lg bg-[#C9A227] text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver em Tela Cheia</span>
            </button>
          </div>
        </div>

        {/* Thumbnail Reel */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative rounded-2xl overflow-hidden aspect-[4/3] w-28 sm:w-36 shrink-0 border-2 transition-all cursor-pointer ${
                activeImageIndex === idx ? 'border-[#C9A227] scale-95 shadow-md' : 'border-stone-800 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={getOptimizedImageUrl(img, 'thumb')}
                alt={`Thumb ${idx + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </section>

      {/* 4. VALUE PILLARS & LUXURY HIGHLIGHTS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-stone-800 bg-black/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider">
              Diferenciais de Excelência
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-white">
              Por Que Este Imóvel é Uma Escolha Superior
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              Cada elemento deste projeto foi concebido para entregar sofisticação, conforto duradouro e alta liquidez patrimonial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {landingPage.customBenefits && landingPage.customBenefits.map((benefit, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border transition-all hover:border-[#C9A227]/50 ${theme.cardBg}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center mb-4 text-[#C9A227]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Full Detailed Description */}
          {property.description && (
            <div className={`p-8 rounded-3xl border ${theme.cardBg} space-y-4`}>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#C9A227]" />
                <span>Memorial & Detalhes do Empreendimento</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 5. FINANCING SIMULATOR & FLEXIBILITY */}
      {landingPage.showMortgageSimulator && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className={`p-8 sm:p-12 rounded-3xl border shadow-2xl ${theme.cardBg}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A227] uppercase tracking-wider">
                  <Calculator className="w-4 h-4 text-[#C9A227]" />
                  <span>Planejamento & Condições Especiais</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
                  Simulador de Parcelas & Financiamento
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  {landingPage.financingPitch || 'Estudamos sua proposta personalizada. Financiamento bancário liberado com as menores taxas do mercado ou fluxo direto com a construtora.'}
                </p>

                <div className="space-y-4 pt-2">
                  {/* Slider: Down payment */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5 text-stone-300">
                      <span>Valor de Entrada ({downPaymentPercent}%):</span>
                      <span className="text-[#C9A227] font-bold">{formatCurrency(downPaymentValue)}</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="70"
                      step="5"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full accent-[#C9A227] cursor-pointer"
                    />
                  </div>

                  {/* Slider: Months */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5 text-stone-300">
                      <span>Prazo de Financiamento:</span>
                      <span className="text-[#C9A227] font-bold">{loanMonths} meses ({loanMonths / 12} anos)</span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="420"
                      step="12"
                      value={loanMonths}
                      onChange={(e) => setLoanMonths(Number(e.target.value))}
                      className="w-full accent-[#C9A227] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Simulation Result Card */}
              <div className="lg:col-span-6">
                <div className="p-6 sm:p-8 rounded-2xl bg-black/60 border border-stone-800 text-center space-y-4">
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-mono block">
                    Parcela Mensal Estimada (Aproximada)
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#C9A227]">
                    {monthlyPayment > 0 ? formatCurrency(monthlyPayment) : 'Consulte Tabela'}
                    <span className="text-xs font-normal text-stone-400 block mt-1">/mês no sistema de amortização</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-left pt-2 border-t border-stone-800 text-xs">
                    <div className="p-3 rounded-xl bg-stone-900/60">
                      <span className="text-[10px] text-stone-400 block font-mono">Valor Total</span>
                      <span className="font-bold text-white">{formatCurrency(propertyPrice)}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-900/60">
                      <span className="text-[10px] text-stone-400 block font-mono">Saldo Financiado</span>
                      <span className="font-bold text-white">{formatCurrency(financedAmount)}</span>
                    </div>
                  </div>

                  <a
                    href={getWhatsAppLink(`Olá Daniel Pacheco! Fiz a simulação de financiamento do imóvel ${property.title} (Cód: ${property.code}) com entrada de ${formatCurrency(downPaymentValue)} e quero aprovar meu crédito.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg ${theme.accentBg}`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aprovar Financiamento com Daniel</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 6. LOCATION & NEIGHBORHOOD GUIDE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-stone-800 bg-black/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A227] uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#C9A227]" />
              <span>Localização Privilegiada</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif-luxury text-white">
              {property.neighborhood}, {property.city} - {property.state || 'SC'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              Morar ou investir aqui significa estar rodeado de conveniência, segurança e uma vizinhança de altíssimo padrão.
            </p>

            <ul className="space-y-3 pt-2">
              {landingPage.locationHighlights && landingPage.locationHighlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="p-6 rounded-3xl border border-stone-800 bg-stone-900/60 aspect-[16/10] flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl">
              <MapPin className="w-12 h-12 text-[#C9A227] mb-3 animate-bounce" />
              <h3 className="text-lg font-bold text-white">{property.title}</h3>
              <p className="text-xs text-stone-400 mt-1 max-w-xs">
                {property.neighborhood}, {property.city}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.title} ${property.neighborhood} ${property.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <span>Ver Localização no Google Maps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BROKER AUTHORITY & CREDENTIALS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className={`p-8 sm:p-12 rounded-3xl border ${theme.cardBg} flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl`}>
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#C9A227] p-1 bg-black/40 overflow-hidden shrink-0 shadow-lg">
              <img
                src={settings.logoUrl || "https://i.postimg.cc/wv36Qv93/Chat-GPT-Image-26-de-ago-de-2026-09-58-21-(1).png"}
                alt={settings.realtorName}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#C9A227] flex items-center justify-center sm:justify-start gap-1">
                <Award className="w-3.5 h-3.5" />
                Corretor & Avaliador Imobiliário Credenciado
              </span>
              <h3 className="text-2xl font-bold font-serif-luxury text-white">
                {settings.realtorName || 'Daniel Pacheco'}
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                CRECI {settings.creci || '36.963-F'} {settings.cnai ? `• CNAI ${settings.cnai}` : ''}
              </p>
              <p className="text-xs text-stone-300 max-w-lg leading-relaxed pt-1">
                Especialista em lançamentos e imóveis de alto padrão no Sul Catarinense. Consultoria transparente e assessoria jurídica completa.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-6 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xl ${theme.accentBg}`}
            >
              <MessageSquareQuote className="w-4 h-4" />
              <span>Chamar no WhatsApp Direto</span>
            </a>
          </div>
        </div>
      </section>

      {/* 8. FOOTER WITH DISCLOSURES */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-stone-800 text-center text-xs text-stone-500 space-y-2">
        <p>
          © {new Date().getFullYear()} {settings.realtorName || 'Daniel Pacheco'} - Todos os direitos reservados.
        </p>
        <p className="text-[11px] text-stone-600">
          Imóvel sujeito a alteração de valores e disponibilidade sem aviso prévio. CRECI {settings.creci}.
        </p>
      </footer>

      {/* 9. LIGHTBOX FULLSCREEN MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8">
          <div className="flex items-center justify-between text-white">
            <span className="text-xs font-mono">
              Foto {activeImageIndex + 1} de {images.length} • {property.title}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center max-h-[80vh]">
            <img
              src={getOptimizedImageUrl(images[activeImageIndex], 'full')}
              alt="Fullscreen Preview"
              decoding="async"
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
            />

            <button
              onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-stone-700"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-stone-700"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-14 h-10 rounded-lg overflow-hidden border-2 shrink-0 ${
                  activeImageIndex === idx ? 'border-[#C9A227]' : 'border-transparent opacity-50'
                }`}
              >
                <img
                  src={getOptimizedImageUrl(img, 'thumb')}
                  alt={`Thumb ${idx}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
