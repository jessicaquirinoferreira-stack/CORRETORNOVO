import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Maximize, 
  Building, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  MessageCircle, 
  Share2, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Phone,
  Clock,
  Compass,
  Play,
  Maximize2,
  HelpCircle,
  ChevronDown,
  Bot,
  Send,
  ExternalLink,
  Layers,
  Award,
  Waves,
  Utensils,
  Dumbbell,
  Trees,
  Volume2,
  Zap,
  Lock,
  UserCheck,
  Check,
  Landmark
} from 'lucide-react';
import { Property, SiteSettings } from '../types';
import { 
  formatCurrency, 
  getStatusBadgeColor, 
  createWhatsAppUrl, 
  getHighResImages, 
  getHighResImageUrl,
  getOptimizedImageUrl,
  preloadImage
} from '../utils/formatters';
import { fetchFullPropertyGallery } from '../firebase/firebaseService';
import { FloorPlanViewer3D } from '../components/FloorPlanViewer3D';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyGalleryLightbox } from '../components/PropertyGalleryLightbox';

interface PropertyDetailPageProps {
  property: Property;
  allProperties: Property[];
  settings: SiteSettings;
  onBack: () => void;
  onSelectProperty: (property: Property) => void;
  onOpenCuratedModal: () => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  property,
  allProperties,
  settings,
  onBack,
  onSelectProperty,
  onOpenCuratedModal,
}) => {
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Active Floor Plan tab
  const [activePlanTab, setActivePlanTab] = useState<'humanized' | 'lazer' | '3d'>('humanized');

  // FAQ open states
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Final Conversion Form states
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [extendedGallery, setExtendedGallery] = useState<string[] | null>(null);

  useEffect(() => {
    if (property.hasExtendedGallery || (property.totalImagesCount && property.totalImagesCount > (property.images || []).length)) {
      fetchFullPropertyGallery(property.id).then((full) => {
        if (full && full.length > (property.images || []).length) {
          setExtendedGallery(full);
        }
      }).catch(() => {});
    }
  }, [property.id, property.hasExtendedGallery, property.totalImagesCount, property.images]);

  const images = useMemo(() => {
    const activeList = extendedGallery && extendedGallery.length > 0 ? extendedGallery : property.images;
    return getHighResImages(activeList);
  }, [property.images, extendedGallery]);

  // Pré-carrega de imediato a imagem principal e a segunda foto para renderização instantânea
  useEffect(() => {
    if (images && images.length > 0) {
      preloadImage(getOptimizedImageUrl(images[0], 'hero'));
      if (images.length > 1) {
        preloadImage(getOptimizedImageUrl(images[1], 'hero'));
      }
    }
  }, [images]);

  const badgeStyle = getStatusBadgeColor(property.status);

  const whatsappMessage = `Olá Daniel Pacheco! Gostaria de receber o material completo, tabela de disponibilidade e agendar atendimento exclusivo para o empreendimento: ${property.title} (Cód. ${property.code}) em ${property.neighborhood}, ${property.city}.`;
  const whatsappUrl = createWhatsAppUrl(settings.whatsapp || '5548998001744', whatsappMessage);

  const relatedProperties = useMemo(() => {
    return allProperties
      .filter((p) => p.id !== property.id && (p.city === property.city || p.type === property.type))
      .slice(0, 3);
  }, [allProperties, property.id, property.city, property.type]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Confira este empreendimento em ${property.city}: ${property.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openLightboxAt = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) return;

    const message = `*SOLICITAÇÃO DE ATENDIMENTO EXCLUSIVO - DANIEL PACHECO*\n\n` +
      `🏢 *Empreendimento:* ${property.title} (Cód. ${property.code})\n` +
      `📍 *Localização:* ${property.neighborhood}, ${property.city} - ${property.state}\n\n` +
      `👤 *Nome:* ${formName}\n` +
      `📱 *Telefone/WhatsApp:* ${formPhone}\n` +
      (formEmail ? `✉️ *E-mail:* ${formEmail}\n` : '') +
      (formNotes ? `📝 *Mensagem:* ${formNotes}\n` : '') +
      `\nOlá Daniel, gostaria de agendar uma consultoria exclusiva sobre este empreendimento!`;

    const sendUrl = createWhatsAppUrl(settings.whatsapp || '5548998001744', message);
    window.open(sendUrl, '_blank');
    setFormSubmitted(true);
  };

  // Structured differentials list
  const differentialsList = useMemo(() => {
    if (property.features && property.features.length > 0) {
      return property.features.map((feat, idx) => {
        const lower = feat.toLowerCase();
        let desc = `Item selecionado de alto padrão presente no imóvel ${property.title}.`;
        
        if (lower.includes('churrasqueira')) {
          desc = 'Espaço preparado para momentos de lazer e confraternização com amigos e família.';
        } else if (lower.includes('piscina')) {
          desc = 'Área com piscina para relaxamento, lazer e bem-estar em dias ensolarados.';
        } else if (lower.includes('gourmet')) {
          desc = 'Ambiente finamente planejado para experiências gastronômicas e recepções.';
        } else if (lower.includes('mobiliado')) {
          desc = 'Unidade com móveis sob medida instalados com alto padrão de marcenaria.';
        } else if (lower.includes('semi-mobiliado')) {
          desc = 'Unidade com móveis planejados fixos nos principais ambientes.';
        } else if (lower.includes('edícula')) {
          desc = 'Edícula anexa para suporte, espaço gourmet privativo ou dependência independente.';
        } else if (lower.includes('portão eletrônico')) {
          desc = 'Acesso automatizado com conforto, agilidade e segurança diária para os moradores.';
        } else if (lower.includes('elevador')) {
          desc = 'Acesso facilitado por elevador moderno com alta tecnologia e segurança.';
        } else if (lower.includes('sacada')) {
          desc = 'Sacada arejada com vista agradável e espaço para churrasco e convivência.';
        } else if (lower.includes('salão de festas')) {
          desc = 'Salão social amplo e equipado para comemorações e eventos exclusivos.';
        } else if (lower.includes('playground')) {
          desc = 'Espaço infantil dedicado para o entretenimento seguro das crianças.';
        } else if (lower.includes('academia')) {
          desc = 'Espaço com aparelhos para prática regular de atividades físicas e condicionamento.';
        } else if (lower.includes('mar') || lower.includes('frente mar')) {
          desc = 'Vista panorâmica espetacular com brisa marítima constante e valorização garantida.';
        } else if (lower.includes('split')) {
          desc = 'Tubulação e pontos elétricos prontos para instalação de ar-condicionado split.';
        } else if (lower.includes('gesso')) {
          desc = 'Acabamento refinado com teto rebaixado em gesso e projeto luminotécnico integrado.';
        } else if (lower.includes('escriturado') || lower.includes('construir')) {
          desc = 'Documentação 100% regularizada, com matrícula individual e pronto para construir.';
        } else if (lower.includes('energia') || lower.includes('água')) {
          desc = 'Infraestrutura completa instalada com redes de energia elétrica, iluminação pública e água.';
        } else if (lower.includes('jardim') || lower.includes('quintal')) {
          desc = 'Área externa privativa arborizada, ideal para pets e momentos ao ar livre.';
        }

        return {
          num: String(idx + 1).padStart(2, '0'),
          title: feat,
          desc,
        };
      });
    }

    return [
      {
        num: '01',
        title: 'Localização Estratégica',
        desc: `Situado no bairro ${property.neighborhood} em ${property.city}, com fácil acesso a vias principais e comércios.`,
      },
      {
        num: '02',
        title: 'Documentação Regularizada',
        desc: 'Imóvel com documentação conferida e auditada pela consultoria imobiliária Daniel Pacheco.',
      },
      {
        num: '03',
        title: 'Potencial de Valorização',
        desc: 'Excelente retorno sobre investimento e padrão construtivo consolidado na região.',
      },
    ];
  }, [property.features, property.title, property.neighborhood, property.city]);

  // Common Area Items (Áreas Comuns do Condomínio / Loteamento)
  const commonAreaItems = useMemo(() => {
    // Standalone houses and standard individual lots have NO shared common areas
    if (property.type === 'Casa') {
      return [];
    }
    if (!property.features || property.features.length === 0) {
      return [];
    }

    const commonKeywords = [
      'salão de festas',
      'playground',
      'elevador',
      'academia',
      'espaço gourmet',
      'piscina',
      'segurança 24h',
      'pista de caminhada',
      'quadra',
      'brinquedoteca',
      'portaria',
      'interfone'
    ];

    const matched = property.features.filter((f) =>
      commonKeywords.some((kw) => f.toLowerCase().includes(kw))
    );

    return matched.map((name) => {
      const lower = name.toLowerCase();
      let icon = Sparkles;
      let desc = 'Ambiente exclusivo entregue equipado e decorado';

      if (lower.includes('piscina')) {
        icon = Waves;
        desc = 'Área aquática de lazer e relaxamento para os moradores';
      } else if (lower.includes('gourmet') || lower.includes('churrasqueira')) {
        icon = Utensils;
        desc = 'Espaço planejado para recepções e gastronomia';
      } else if (lower.includes('academia') || lower.includes('fitness')) {
        icon = Dumbbell;
        desc = 'Espaço fitness com equipamentos para treino e saúde';
      } else if (lower.includes('salão de festas') || lower.includes('festas')) {
        icon = Sparkles;
        desc = 'Salão social amplo para confraternizações e eventos';
      } else if (lower.includes('playground') || lower.includes('brinquedoteca')) {
        icon = Trees;
        desc = 'Área recreativa segura dedicada às crianças';
      } else if (lower.includes('elevador')) {
        icon = Award;
        desc = 'Acesso facilitado e tecnologia de transporte vertical';
      } else if (lower.includes('segurança') || lower.includes('portaria')) {
        icon = Lock;
        desc = 'Monitoramento e controle de acesso para maior tranquilidade';
      } else if (lower.includes('caminhada') || lower.includes('quadra')) {
        icon = Compass;
        desc = 'Espaço ao ar livre para esportes e bem-estar';
      }

      return {
        icon,
        label: name,
        desc,
      };
    });
  }, [property.features, property.type]);

  // FAQs
  const faqs = useMemo(() => [
    {
      q: `Como funciona o atendimento e agendamento de visita para o ${property.title}?`,
      a: `O corretor Daniel Pacheco realiza atendimento exclusivo e personalizado. Basta clicar no botão de WhatsApp para agendar uma apresentação privativa, presencial ou por videoconferência com apresentação de maquetes, plantas e tabelas de disponibilidade.`,
    },
    {
      q: `Quais são as opções de pagamento e financiamento?`,
      a: `O empreendimento conta com opções de pagamento flexíveis: entrada facilitada durante o período de obra, parcelamento direto com a construtora ou financiamento bancário com as melhores taxas do mercado após a entrega das chaves.`,
    },
    {
      q: `É possível personalizar a planta ou acabamentos do imóvel?`,
      a: `Para imóveis adquiridos na planta ou em fase inicial de obras, diversas construtoras parceiras oferecem opções de personalização de layout, pontos elétricos e revestimentos. Consulte a nossa equipe para verificar a política desta unidade.`,
    },
    {
      q: `O empreendimento aceita permuta ou proposta com imóvel/veículo?`,
      a: `Sim, cada proposta é avaliada individualmente pela construtora e proprietários. O corretor Daniel Pacheco auxilia na intermediação e avaliação de imóveis de menor valor ou veículos como parte de pagamento.`,
    },
    {
      q: `Qual a garantia jurídica na compra através da Consultoria Daniel Pacheco?`,
      a: `Você conta com a segurança de um profissional credenciado (CRECI 45.418-F • CNAI 44.821), com análise documental rigorosa da matrícula, memorial de incorporação (RI) e minuta de contrato de compra e venda sem qualquer custo adicional de assessoria.`,
    },
  ], [property.title]);

  const mapQuery = encodeURIComponent(`${property.neighborhood}, ${property.city}, SC, Brasil`);

  return (
    <div id={`property-detail-${property.code}`} className="space-y-20 sm:space-y-28 animate-in fade-in duration-300">
      
      {/* =========================================================================
          2. HERO SECTION (Split-screen 2 colunas com navegação superior)
         ========================================================================= */}
      <section id="hero-detail" className="pt-24 sm:pt-28 pb-12 bg-[#0E0E0E] border-b border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Top Breadcrumb & Share Row */}
          <div className="flex items-center justify-between gap-4">
            <button
              id="detail-back-btn"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#C9A227] text-xs font-semibold text-white hover:text-[#C9A227] transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Portfólio</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#C9A227] text-[#A0A0A0] hover:text-white transition-colors text-xs cursor-pointer shadow-sm"
                title="Compartilhar imóvel"
              >
                <Share2 className="w-4 h-4" />
                <span>Compartilhar</span>
              </button>
              {copied && (
                <span className="text-[11px] text-[#4ADE80] font-semibold animate-pulse">Link copiado!</span>
              )}
            </div>
          </div>

          {/* Split-Screen 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Developer Eyebrow, Title, Subtitle, Quick Specs, Dual CTAs */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              {/* Eyebrow */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A227] font-semibold flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>
                    {property.developer 
                      ? `EMPREENDIMENTO OFICIAL — ${property.developer.toUpperCase()}`
                      : 'EMPREENDIMENTO OFICIAL — DANIEL PACHECO'}
                  </span>
                </span>
                <span className="text-white/20">•</span>
                <span className="text-[11px] font-mono text-[#A0A0A0]">Cód. {property.code}</span>
              </div>

              {/* Main Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-[1.15]">
                {property.title}
              </h1>

              {/* Subtitle / Slogan */}
              <p className="text-sm sm:text-base text-[#C9A227] font-serif italic leading-relaxed">
                {property.headline || `Exclusividade e sofisticação no melhor endereço do ${property.neighborhood}, em ${property.city}.`}
              </p>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-white/10">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#A0A0A0] block">Valor</span>
                  <div className="text-xs sm:text-sm font-bold text-[#C9A227] font-serif tabular-nums truncate">
                    {property.priceFormatted || formatCurrency(property.price)}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#A0A0A0] block">Localização</span>
                  <div className="flex items-center gap-1.5 text-xs text-white font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                    <span className="truncate">{property.neighborhood} · {property.city}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#A0A0A0] block">Status da Obra</span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <span className={`w-2 h-2 rounded-full ${badgeStyle.dot} animate-pulse`} />
                    <span className={badgeStyle.text}>{property.status}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#A0A0A0] block">Previsão / Entrega</span>
                  <div className="flex items-center gap-1.5 text-xs text-white font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                    <span>{property.deliveryYear || (property.status === 'Pronto' ? 'Pronto para Morar' : 'Consulte')}</span>
                  </div>
                </div>
              </div>

              {/* Financing Conditions Strip */}
              {(property.bankFinancing || property.directFinancing) && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {property.bankFinancing && (
                    <div className="px-3 py-1.5 rounded-xl bg-[#0284C7]/10 border border-[#0284C7]/30 text-[#0284C7] text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                      <Landmark className="w-4 h-4 text-[#0284C7]" />
                      <span>Aceita Financiamento Bancário (Averbado / Caixa / Bancos)</span>
                    </div>
                  )}
                  {property.directFinancing && (
                    <div className="px-3 py-1.5 rounded-xl bg-[#1F8A4C]/10 border border-[#1F8A4C]/30 text-[#1F8A4C] text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                      <ShieldCheck className="w-4 h-4 text-[#1F8A4C]" />
                      <span>Financiamento Direto com a Construtora</span>
                    </div>
                  )}
                </div>
              )}

              {/* Dual CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <a
                  id="hero-whatsapp-cta"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1F8A4C] hover:bg-[#197A42] text-white px-7 py-3.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 rounded-xl"
                >
                  <MessageCircle className="w-4 h-4 fill-current text-white" />
                  <span>Atendimento Exclusivo</span>
                </a>

                <button
                  onClick={() => scrollToSection('o-empreendimento')}
                  className="border border-[#E5E0D8] hover:border-[#111111] text-[#111111] hover:text-[#C9A227] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer rounded-xl flex items-center justify-center gap-2 bg-[#FFFFFF] shadow-sm"
                >
                  <span>Conhecer o Projeto ↓</span>
                </button>
              </div>
            </div>

            {/* Right Column: Hero Featured Image with Overlay */}
            <div className="lg:col-span-6 relative">
              <div 
                onClick={() => openLightboxAt(0)}
                className="relative rounded-3xl overflow-hidden border border-[#E5E0D8] shadow-xl aspect-[4/3] sm:aspect-[16/11] group cursor-pointer bg-[#FFFFFF]"
              >
                <img
                  src={getOptimizedImageUrl(images[0], 'hero')}
                  alt={`${property.title} Fachada Oficial`}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-[#0A0A0A]/10 to-transparent pointer-events-none" />

                {/* Top Badge: Seleção Exclusiva */}
                {property.featured && (
                  <div className="absolute top-4 left-4 bg-[#0A0A0A]/90 backdrop-blur-md border border-[#C9A227]/50 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#C9A227] flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Seleção Exclusiva</span>
                  </div>
                )}

                {/* Zoom Icon Hint */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-full text-white/80 group-hover:text-white transition-colors">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-5 left-5 right-5 space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-serif font-bold text-white drop-shadow-md">
                      {property.title}
                    </h3>
                    <span className="text-[11px] font-mono text-[#C9A227] bg-[#0A0A0A]/90 px-2.5 py-1 rounded-full backdrop-blur-sm border border-[#E5E0D8]/20">
                      1 / {images.length} fotos
                    </span>
                  </div>
                  <p className="text-xs text-white/90 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C9A227]" />
                    <span>{property.neighborhood}, {property.city} - {property.state}</span>
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          3. SEÇÃO "O EMPREENDIMENTO"
         ========================================================================= */}
      <section id="o-empreendimento" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-3xl space-y-3 text-left">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold block">
            Conceito & Arquitetura
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] tracking-tight">
            O empreendimento.
          </h2>
          <p className="text-base text-[#C9A227] font-serif italic">
            Exclusividade e sofisticação em cada detalhe construtivo.
          </p>
          <p className="text-sm sm:text-base text-[#5A5A5A] leading-relaxed font-normal pt-2 whitespace-pre-line">
            {property.description}
          </p>
          <div className="pt-2">
            <button
              onClick={() => scrollToSection('galeria-oficial')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9A227] hover:text-[#111111] transition-colors cursor-pointer"
            >
              <span>Ver galeria oficial ↓</span>
            </button>
          </div>
        </div>

        {/* Large Highlight Image */}
        {images.length > 1 && (
          <div 
            onClick={() => openLightboxAt(1)}
            className="relative rounded-3xl overflow-hidden border border-[#E5E0D8] shadow-lg aspect-[16/9] md:aspect-[21/9] group cursor-pointer bg-[#FFFFFF]"
          >
            <img
              src={getOptimizedImageUrl(images[1], 'hero')}
              alt={`${property.title} Perspectiva Principal`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 bg-[#0A0A0A]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-[#E5E0D8]/20 text-xs text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Perspectiva artística do projeto em {property.city}</span>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          4. SEÇÃO "AS RESIDÊNCIAS" / CARACTERÍSTICAS
         ========================================================================= */}
      <section id="as-residencias" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-3xl space-y-2 text-left">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold block">
            {property.type === 'Lote/Terreno' ? 'Especificações do Terreno' : 'Espaços Privativos'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] tracking-tight">
            {property.type === 'Lote/Terreno' ? 'Características do loteamento.' : 'Características do imóvel.'}
          </h2>
          <p className="text-sm sm:text-base text-[#5A5A5A] font-normal">
            {property.type === 'Lote/Terreno' 
              ? 'Dimensões exatas e infraestrutura completa para você construir com tranquilidade e valorização.'
              : 'Dimensões reais e inteligência de layout para acomodar sua família com absoluto conforto.'}
          </p>
        </div>

        {/* Grid of Big Numbers & Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Area Metric */}
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl p-6 text-left space-y-2 hover:border-[#C9A227] transition-colors shadow-sm">
            <div className="flex items-center justify-between text-[#C9A227]">
              <Maximize className="w-5 h-5" />
              <span className="text-[10px] uppercase font-mono text-[#5A5A5A]">Metragem</span>
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
              {property.areaM2 ? `${property.areaM2}` : 'Consulte'} <span className="text-lg font-normal text-[#C9A227]">{property.areaM2 ? 'm²' : ''}</span>
            </div>
            <span className="text-xs text-[#5A5A5A] block font-medium">
              {property.type === 'Lote/Terreno' ? 'Área total do lote' : 'Área privativa'}
            </span>
          </div>

          {/* Bedrooms Metric (Only if defined and > 0) */}
          {property.bedrooms !== undefined && property.bedrooms > 0 && (
            <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl p-6 text-left space-y-2 hover:border-[#C9A227] transition-colors shadow-sm">
              <div className="flex items-center justify-between text-[#C9A227]">
                <Bed className="w-5 h-5" />
                <span className="text-[10px] uppercase font-mono text-[#5A5A5A]">Dormitórios</span>
              </div>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
                {property.bedrooms}
              </div>
              <span className="text-xs text-[#5A5A5A] block font-medium">
                {property.bedrooms === 1 ? 'Dormitório' : 'Dormitórios'}
              </span>
            </div>
          )}

          {/* Suites Metric (Only if defined and > 0) */}
          {property.suites !== undefined && property.suites > 0 && (
            <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl p-6 text-left space-y-2 hover:border-[#C9A227] transition-colors shadow-sm">
              <div className="flex items-center justify-between text-[#C9A227]">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] uppercase font-mono text-[#5A5A5A]">Área Íntima</span>
              </div>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
                {property.suites}
              </div>
              <span className="text-xs text-[#5A5A5A] block font-medium">
                {property.suites === 1 ? 'Suíte privativa' : 'Suítes privativas'}
              </span>
            </div>
          )}

          {/* Bathrooms Metric (Only if defined and > 0) */}
          {property.bathrooms !== undefined && property.bathrooms > 0 && (
            <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl p-6 text-left space-y-2 hover:border-[#C9A227] transition-colors shadow-sm">
              <div className="flex items-center justify-between text-[#C9A227]">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] uppercase font-mono text-[#5A5A5A]">Sanitários</span>
              </div>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
                {property.bathrooms}
              </div>
              <span className="text-xs text-[#5A5A5A] block font-medium">
                {property.bathrooms === 1 ? 'Banheiro' : 'Banheiros'}
              </span>
            </div>
          )}

          {/* Garage Spaces Metric (Only if defined and > 0) */}
          {property.garageSpaces !== undefined && property.garageSpaces > 0 && (
            <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl p-6 text-left space-y-2 hover:border-[#C9A227] transition-colors shadow-sm">
              <div className="flex items-center justify-between text-[#C9A227]">
                <Car className="w-5 h-5" />
                <span className="text-[10px] uppercase font-mono text-[#5A5A5A]">Vagas</span>
              </div>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
                {property.garageSpaces}
              </div>
              <span className="text-xs text-[#5A5A5A] block font-medium">
                {property.garageSpaces === 1 ? 'Vaga de garagem' : 'Vagas de garagem'}
              </span>
            </div>
          )}

          {/* If Lote/Terreno, show Type and Location Cards */}
          {property.type === 'Lote/Terreno' && (
            <>
              <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl p-6 text-left space-y-2 hover:border-[#C9A227] transition-colors shadow-sm">
                <div className="flex items-center justify-between text-[#C9A227]">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-mono text-[#5A5A5A]">Categoria</span>
                </div>
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#111111]">
                  Lote / Terreno
                </div>
                <span className="text-xs text-[#5A5A5A] block font-medium">Pronto para construir</span>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl p-6 text-left space-y-2 hover:border-[#C9A227] transition-colors shadow-sm">
                <div className="flex items-center justify-between text-[#C9A227]">
                  <MapPin className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-mono text-[#5A5A5A]">Localização</span>
                </div>
                <div className="text-base sm:text-lg font-serif font-bold text-[#111111] truncate">
                  {property.neighborhood}
                </div>
                <span className="text-xs text-[#5A5A5A] block font-medium">{property.city} - {property.state}</span>
              </div>
            </>
          )}

        </div>
      </section>

      {/* =========================================================================
          5. SEÇÃO "GALERIA OFICIAL"
         ========================================================================= */}
      <section id="galeria-oficial" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2 text-left">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold block">
              Galeria Completa
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] tracking-tight">
              Arquitetura em perspectiva.
            </h2>
            <p className="text-sm sm:text-base text-[#5A5A5A] font-normal">
              Renders oficiais, fachada, áreas sociais e acabamentos selecionados. Clique para ampliar em alta definição.
            </p>
          </div>

          <button
            onClick={() => openLightboxAt(0)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5E0D8] hover:border-[#C9A227] text-xs font-semibold text-[#111111] hover:text-[#C9A227] transition-all self-start sm:self-auto cursor-pointer shadow-sm"
          >
            <Maximize2 className="w-4 h-4 text-[#C9A227]" />
            <span>Abrir Galeria Tela Cheia ({images.length} fotos)</span>
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => openLightboxAt(idx)}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E5E0D8] bg-[#FFFFFF] group cursor-pointer shadow-sm hover:border-[#C9A227] transition-all duration-300"
            >
              <img
                src={getOptimizedImageUrl(img, 'card')}
                alt={`${property.title} Imagem ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="p-3 rounded-full bg-[#C9A227] text-[#0A0A0A] shadow-xl">
                  <Maximize2 className="w-5 h-5" />
                </span>
              </div>
              <div className="absolute bottom-3 left-3 bg-[#0A0A0A]/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-mono text-white/90 border border-white/10">
                {idx + 1} / {images.length}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. SEÇÃO "PLANTAS OFICIAIS"
         ========================================================================= */}
      <section id="plantas-oficiais" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-3xl space-y-2 text-left">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold block">
            Distribuição de Espaços
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] tracking-tight">
            Espaços pensados para viver.
          </h2>
          <p className="text-sm sm:text-base text-[#5A5A5A] font-normal">
            Confira as opções de plantas humanizadas e distribuição inteligente dos ambientes. Consulte a disponibilidade de tipologias com o corretor Daniel Pacheco.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex items-center gap-2 flex-wrap border-b border-[#E5E0D8] pb-4">
          <button
            onClick={() => setActivePlanTab('humanized')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activePlanTab === 'humanized'
                ? 'bg-[#C9A227] text-[#0A0A0A] font-bold shadow-sm'
                : 'bg-[#FFFFFF] text-[#5A5A5A] border border-[#E5E0D8] hover:text-[#111111] hover:bg-[#F7F3EB]'
            }`}
          >
            {property.type === 'Lote/Terreno' ? 'Planta do Loteamento / Topografia' : `Planta do Imóvel (${property.areaM2 ? `${property.areaM2} m²` : 'Tipologia'})`}
          </button>
          
          {commonAreaItems.length > 0 && (
            <button
              onClick={() => setActivePlanTab('lazer')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activePlanTab === 'lazer'
                  ? 'bg-[#C9A227] text-[#0A0A0A] font-bold shadow-sm'
                  : 'bg-[#FFFFFF] text-[#5A5A5A] border border-[#E5E0D8] hover:text-[#111111] hover:bg-[#F7F3EB]'
              }`}
            >
              Planta de Lazer & Áreas Comuns
            </button>
          )}

          <button
            onClick={() => setActivePlanTab('3d')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activePlanTab === '3d'
                ? 'bg-[#C9A227] text-[#0A0A0A] font-bold shadow-sm'
                : 'bg-[#FFFFFF] text-[#5A5A5A] border border-[#E5E0D8] hover:text-[#111111] hover:bg-[#F7F3EB]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Perspectiva 3D Interativa</span>
          </button>
        </div>

        {/* Plan Content Area */}
        {activePlanTab === 'humanized' && (
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
              <div>
                <h4 className="text-lg font-serif font-bold text-[#111111]">
                  {property.title}
                </h4>
                <p className="text-xs text-[#C9A227] mt-0.5 font-medium">
                  {[
                    property.areaM2 ? `${property.areaM2} m²` : null,
                    property.bedrooms ? `${property.bedrooms} Dormitórios` : null,
                    property.suites ? `${property.suites} Suíte${property.suites > 1 ? 's' : ''}` : null,
                    property.bathrooms ? `${property.bathrooms} Banheiro${property.bathrooms > 1 ? 's' : ''}` : null,
                    property.garageSpaces ? `${property.garageSpaces} Vaga${property.garageSpaces > 1 ? 's' : ''}` : null,
                  ].filter(Boolean).join(' · ')}
                </p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#C9A227] hover:text-[#111111] flex items-center gap-1.5"
              >
                <span>Consultar disponibilidade desta unidade</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div 
              onClick={() => openLightboxAt(0)}
              className="relative aspect-[16/10] max-h-[500px] w-full rounded-2xl overflow-hidden bg-[#F7F3EB] border border-[#E5E0D8] flex items-center justify-center group cursor-pointer"
            >
              <img
                src={property.floorPlanUrl || images[images.length - 1] || images[0]}
                alt={`Planta ${property.title}`}
                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 bg-[#0A0A0A]/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-white flex items-center gap-1.5 border border-white/10 shadow-md">
                <Maximize2 className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Clique para ampliar</span>
              </div>
            </div>
          </div>
        )}

        {activePlanTab === 'lazer' && commonAreaItems.length > 0 && (
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
              <div>
                <h4 className="text-lg font-serif font-bold text-[#111111]">
                  Pavimento de Lazer & Áreas Comuns
                </h4>
                <p className="text-xs text-[#C9A227] mt-0.5 font-medium">
                  {commonAreaItems.map(i => i.label).join(' · ')}
                </p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#C9A227] hover:text-[#111111] flex items-center gap-1.5"
              >
                <span>Solicitar apresentação completa</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div 
              onClick={() => openLightboxAt(1)}
              className="relative aspect-[16/10] max-h-[500px] w-full rounded-2xl overflow-hidden bg-[#F7F3EB] border border-[#E5E0D8] flex items-center justify-center group cursor-pointer"
            >
              <img
                src={images[1] || images[0]}
                alt="Planta do Pavimento de Lazer"
                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 bg-[#0A0A0A]/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-white flex items-center gap-1.5 border border-white/10 shadow-md">
                <Maximize2 className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Clique para ampliar</span>
              </div>
            </div>
          </div>
        )}

        {activePlanTab === '3d' && (
          <FloorPlanViewer3D property={property} />
        )}
      </section>

      {/* =========================================================================
          8. SEÇÃO "PROJETO / DIFERENCIAIS"
         ========================================================================= */}
      <section id="diferenciais" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-3xl space-y-2 text-left">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold block">
            {property.type === 'Lote/Terreno' ? 'Diferenciais do Lote' : 'Diferenciais do Imóvel'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] tracking-tight">
            Itens que valorizam o imóvel.
          </h2>
          <p className="text-sm sm:text-base text-[#5A5A5A] font-normal">
            Características selecionadas presentes nesta unidade para garantir conforto, segurança e rentabilidade.
          </p>
        </div>

        {/* Numbered Differentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {differentialsList.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl p-6 text-left space-y-3 hover:border-[#C9A227] transition-all group shadow-sm"
            >
              <div className="text-3xl font-serif font-bold text-[#C9A227] group-hover:scale-110 transition-transform inline-block">
                {item.num}
              </div>
              <h3 className="text-base font-serif font-bold text-[#111111]">
                {item.title}
              </h3>
              <p className="text-xs text-[#5A5A5A] leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          9. SEÇÃO "LAZER E CONVENIÊNCIA" (Renderizada SOMENTE se houver áreas comuns)
         ========================================================================= */}
      {commonAreaItems.length > 0 && (
        <section id="lazer-conveniencia" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-3xl space-y-2 text-left">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold block">
              Áreas Comuns
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] tracking-tight">
              Lazer e conveniência do condomínio.
            </h2>
            <p className="text-sm sm:text-base text-[#5A5A5A] font-normal">
              Ambientes sociais e coletivos presentes no empreendimento para conveniência dos moradores.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {commonAreaItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl p-5 text-left space-y-3 hover:border-[#C9A227] transition-colors shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] text-[#C9A227] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-serif font-bold text-[#111111]">
                      {item.label}
                    </h3>
                    <p className="text-[11px] text-[#5A5A5A] mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          10. SEÇÃO "LOCALIZAÇÃO"
         ========================================================================= */}
      <section id="localizacao" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold block">
              Endereço Privilegiado
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] tracking-tight">
              {property.neighborhood}, {property.city}
            </h2>
            <p className="text-sm text-[#5A5A5A] leading-relaxed font-normal">
              Localização estratégica no Sul Catarinense com fácil acesso às principais avenidas, gastronomia, colégios de referência, centros de saúde e conveniências.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E5E0D8] text-xs text-[#111111] shadow-sm">
                <MapPin className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span className="font-medium">{property.neighborhood} · {property.city} - {property.state}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={createWhatsAppUrl(settings.whatsapp || '5548998001744', `Olá Daniel! Gostaria de agendar uma visita e conhecer o endereço exato do ${property.title} em ${property.city}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-[#1F8A4C] hover:bg-[#197A42] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Conhecer este endereço</span>
                </a>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-[#FFFFFF] hover:bg-[#F7F3EB] border border-[#E5E0D8] text-xs font-semibold text-[#111111] flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <ExternalLink className="w-4 h-4 text-[#C9A227]" />
                  <span>Abrir no Google Maps</span>
                </a>
              </div>
            </div>
          </div>

          {/* Map Frame */}
          <div className="lg:col-span-7">
            <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-[#E5E0D8] shadow-md bg-[#FFFFFF]">
              <iframe
                title={`Mapa ${property.title} em ${property.city}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              />
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          11. SEÇÃO "PERGUNTAS FREQUENTES" (FAQ)
         ========================================================================= */}
      <section id="faq-section" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold block">
            Dúvidas Frequentes
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] tracking-tight">
            Perguntas frequentes.
          </h2>
          <p className="text-sm text-[#5A5A5A] font-normal">
            Esclarecimentos diretos sobre reservas, prazos, formas de pagamento e segurança jurídica.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl overflow-hidden transition-all text-left shadow-sm hover:border-[#C9A227]"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer hover:text-[#C9A227] transition-colors"
                >
                  <span className="text-sm sm:text-base font-serif font-bold text-[#111111]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C9A227] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-[#5A5A5A] leading-relaxed font-normal border-t border-[#E5E0D8] pt-4 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          12. SEÇÃO "DESCOBERTA E RECOMENDAÇÃO" (IA)
         ========================================================================= */}
      <section id="ia-consultoria" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-8 sm:p-10 text-left space-y-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#F7F3EB] text-[#C9A227] border border-[#E5E0D8]">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C9A227] font-semibold block">
                Atendimento Inteligente
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#111111]">
                Pergunte à Consultoria Daniel Pacheco
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed max-w-2xl font-normal">
            Tem dúvidas sobre o perfil da região, valorização imobiliária ou opções de financiamento para o <strong>{property.title}</strong>? Converse com nosso assistente virtual ou clique em uma pergunta rápida abaixo:
          </p>

          <div className="flex flex-wrap gap-2.5">
            {[
              `Qual o potencial de valorização em ${property.city}?`,
              `Como funciona a entrada e parcelamento durante a obra?`,
              `Quais são as metragens e andares disponíveis?`,
            ].map((questionText, qIdx) => (
              <a
                key={qIdx}
                href={createWhatsAppUrl(settings.whatsapp || '5548998001744', `Olá Daniel! ${questionText} (Referência: ${property.title})`)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#F7F3EB] hover:bg-[#E5E0D8] border border-[#E5E0D8] text-xs text-[#111111] hover:text-[#C9A227] transition-all flex items-center gap-2 font-medium"
              >
                <span>{questionText}</span>
                <Send className="w-3 h-3 text-[#C9A227]" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          13. SEÇÃO "OUTROS EMPREENDIMENTOS"
         ========================================================================= */}
      {relatedProperties.length > 0 && (
        <section id="outros-empreendimentos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 text-left">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold block">
                Seleção de Oportunidades
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] tracking-tight">
                Outros empreendimentos.
              </h2>
              <p className="text-sm text-[#5A5A5A] font-normal">
                Continue explorando o portfólio oficial de imóveis selecionados no Sul de Santa Catarina.
              </p>
            </div>

            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9A227] hover:text-[#111111] transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>Ver portfólio completo →</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProperties.map((rel) => (
              <PropertyCard
                key={rel.id}
                property={rel}
                settings={settings}
                onSelect={onSelectProperty}
              />
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          14. SEÇÃO FINAL DE CONVERSÃO (CTA FORTE COM FORMULÁRIO - SEÇÃO ESCURA ELEGANTE STIVEN ALLAN)
         ========================================================================= */}
      <section id="fale-conosco-final" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-[#0A0A0A] border border-[#222222] rounded-3xl p-8 sm:p-12 text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 text-[#C9A227] text-xs font-semibold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Plantão Consultivo Exclusivo</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#FFFFFF] tracking-tight">
              Fale com Daniel Pacheco sobre o {property.title}.
            </h2>
            
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
              Receba atendimento sigiloso, tabela atualizada e agendamento de visita privativa diretamente com o corretor responsável.
            </p>
          </div>

          {/* Big WhatsApp CTA Button */}
          <div className="max-w-md mx-auto">
            <a
              id="final-whatsapp-button"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-8 rounded-2xl bg-[#1F8A4C] hover:bg-[#197A42] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-[#1F8A4C]/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-6 h-6 fill-current text-white" />
              <span>Falar pelo WhatsApp com Daniel</span>
            </a>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 max-w-md mx-auto">
            <div className="h-[1px] bg-[#222222] flex-1" />
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">ou envie seus dados</span>
            <div className="h-[1px] bg-[#222222] flex-1" />
          </div>

          {/* Simple Contact Form */}
          {formSubmitted ? (
            <div className="p-6 rounded-2xl bg-[#1F8A4C]/10 border border-[#1F8A4C]/30 text-emerald-300 max-w-md mx-auto space-y-2">
              <Check className="w-8 h-8 mx-auto text-[#1F8A4C]" />
              <h4 className="text-base font-bold text-[#FFFFFF]">Solicitação Enviada!</h4>
              <p className="text-xs text-gray-400">
                Seu contato foi direcionado para o WhatsApp de Daniel Pacheco. Em breve retornaremos.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="max-w-md mx-auto space-y-4 text-left">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Roberto Silveira"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-[#2A2A2A] text-white text-xs placeholder-gray-500 focus:border-[#C9A227] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                  Telefone / WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(48) 99999-9999"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-[#2A2A2A] text-white text-xs placeholder-gray-500 focus:border-[#C9A227] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                  E-mail (opcional)
                </label>
                <input
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-[#2A2A2A] text-white text-xs placeholder-gray-500 focus:border-[#C9A227] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                  Mensagem ou Preferência de Horário
                </label>
                <textarea
                  rows={2}
                  placeholder="Gostaria de saber mais sobre unidades disponíveis..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-[#2A2A2A] text-white text-xs placeholder-gray-500 focus:border-[#C9A227] focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Solicitar Apresentação Oficial</span>
                <Send className="w-3.5 h-3.5" />
              </button>

              <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                🔒 Seus dados estão seguros e protegidos pela LGPD. Não enviamos spam.
              </p>
            </form>
          )}

          {/* Guarantees & Credentials */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-[#222222] text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>CRECI 45.418-F</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>CNAI 44.821 (Avaliador Nacional)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Intermediação Oficial e Segura</span>
            </span>
          </div>

        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      <PropertyGalleryLightbox
        isOpen={lightboxOpen}
        images={images}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setLightboxIndex((prev) => (prev + 1) % images.length)}
        onPrev={() => setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
        title={property.title}
      />

    </div>
  );
};
