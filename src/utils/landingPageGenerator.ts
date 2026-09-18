import { Property, LandingPage, LandingPageAudience, LandingPageTheme, LandingPageBenefit } from '../types';

function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Inteligência de Criação Automática de Landing Pages Imobiliárias de Alta Conversão
 */
export function generateSmartLandingPage(
  property: Property,
  audience: LandingPageAudience = 'geral',
  themeStyle: LandingPageTheme = 'luxury-dark',
  customOptions?: Partial<LandingPage>
): LandingPage {
  const isNaPlanta = property.status === 'Na planta' || property.status === 'Em obras';
  const isPronto = property.status === 'Pronto';
  const isTerreno = property.type === 'Lote/Terreno';
  const isCobertura = property.type === 'Cobertura';
  const city = property.city || 'Criciúma';
  const neighborhood = property.neighborhood || 'Centro';

  // 1. Títulos e Headlines de Alta Conversão por Audiência e Tipo
  let badgeText = 'Oportunidade Exclusiva';
  let heroHeadline = property.title;
  let heroSubheadline = property.shortDescription || property.headline || `Imóvel selecionado em ${neighborhood}, ${city}.`;
  let urgencyText = 'Condições especiais por tempo limitado para investidores e compradores qualificados.';

  if (audience === 'investidor') {
    badgeText = isNaPlanta ? '⚡ Oportunidade de Valorização na Planta' : '📈 Alto Potencial de Rentabilidade e Aluguel';
    heroHeadline = `Invista no ${property.title}: Alto Potencial de Valorização em ${city}`;
    heroSubheadline = isNaPlanta
      ? `Garanta sua unidade com valor de metro quadrado inicial e condições direto com a construtora em ${neighborhood}.`
      : `Excelente rentabilidade imobiliária com liquidez e segurança em uma das áreas mais nobres de ${city}.`;
    urgencyText = 'Últimas unidades com tabela especial de lançamento e parcelamento direto.';
  } else if (audience === 'familia') {
    badgeText = '🏡 Conforto, Segurança e Qualidade de Vida';
    heroHeadline = `O Lar Perfeito Para Sua Família: Conheça o ${property.title}`;
    heroSubheadline = `Espaço amplo com ${property.bedrooms || 3} dormitórios (${property.suites || 1} suíte), lazer completo e a segurança que sua família merece em ${neighborhood}.`;
    urgencyText = 'Agende sua visita exclusiva e encante-se com cada detalhe.';
  } else if (audience === 'luxo') {
    badgeText = '💎 Arquitetura Autoral & Padrão Internacional';
    heroHeadline = `${property.title}: Exclusividade Absoluta no Ponto Mais Nobre de ${city}`;
    heroSubheadline = `Sofisticação, acabamento impecável e privacidade incomparável no ${neighborhood}. Atendimento estritamente confidencial.`;
    urgencyText = 'Poucas unidades disponíveis para clientes com perfil exigente.';
  } else if (audience === 'primeiro_imovel') {
    badgeText = '🔑 Conquiste Seu Imóvel Próprio com Facilidade';
    heroHeadline = `Realize o Sonho do Seu Próprio Imóvel: ${property.title}`;
    heroSubheadline = `Entrada facilitada e parcelas que cabem no seu planejamento financeiro no bairro ${neighborhood}.`;
    urgencyText = 'Simulação gratuita e aprovação rápida de crédito sem burocracia.';
  } else {
    // Geral
    if (isCobertura) {
      badgeText = '👑 Cobertura Exclusiva com Vista Panorâmica';
      heroHeadline = `${property.title}: Vista Privilegiada e Espaço Gourmet Privativo`;
      heroSubheadline = `Viva no topo com o mais alto padrão em ${neighborhood}, ${city}.`;
    } else if (isNaPlanta) {
      badgeText = '🚀 Lançamento Exclusivo em Construção';
      heroHeadline = `${property.title}: Seu Novo Estilo de Vida no ${neighborhood}`;
      heroSubheadline = `Projeto moderno da construtora ${property.developer || 'referência na região'}, com entrega garantida e lazer completo.`;
    } else if (isTerreno) {
      badgeText = '📐 Terreno Alto Padrão Pronto para Construir';
      heroHeadline = `Construa a Casa dos Seus Sonhos no ${property.title}`;
      heroSubheadline = `Lote nobre com ${property.areaM2 || 360}m² de área privativa em localização estratégica de ${city}.`;
    } else {
      badgeText = '✨ Imóvel Pronto para Morar';
      heroHeadline = `${property.title}: Sofisticação e Pronto para Morar em ${city}`;
      heroSubheadline = `Imóvel impecável em ${neighborhood} pronto para você e sua família se mudarem imediatamente.`;
    }
  }

  // 2. Pilares de Valor (Custom Benefits)
  const customBenefits: LandingPageBenefit[] = [];

  if (property.areaM2) {
    customBenefits.push({
      title: `${property.areaM2}m² de Puro Espaço e Conforto`,
      description: 'Planta inteligente e funcional planejada para máxima iluminação natural, circulação e bem-estar.',
      icon: 'Maximize2',
    });
  }

  if (property.bedrooms || property.suites) {
    customBenefits.push({
      title: `${property.bedrooms || 3} Quartos com ${property.suites || 1} Suíte(s)`,
      description: 'Ambientes privativos aconchegantes com acabamentos de alta qualidade e isolamento acústico superior.',
      icon: 'BedDouble',
    });
  }

  if (property.garageSpaces) {
    customBenefits.push({
      title: `${property.garageSpaces} Vaga(s) de Garagem Coberta(s)`,
      description: 'Acesso seguro, manobra facilitada e infraestrutura moderna para o seu veículo.',
      icon: 'Car',
    });
  }

  if (property.features && property.features.length > 0) {
    const mainFeat = property.features.slice(0, 3).join(', ');
    customBenefits.push({
      title: 'Lazer e Diferenciais Exclusivos',
      description: `Conta com ${mainFeat} e áreas de convivência completas equipadas e decoradas.`,
      icon: 'Sparkles',
    });
  } else {
    customBenefits.push({
      title: 'Infraestrutura e Lazer Completo',
      description: 'Áreas comuns entregues decoradas e mobiliadas para proporcionar lazer e segurança total.',
      icon: 'ShieldCheck',
    });
  }

  if (property.developer) {
    customBenefits.push({
      title: `Garantia e Solidez ${property.developer}`,
      description: 'Empreendimento executado por uma das construtoras mais respeitadas e pontuais do Sul Catarinense.',
      icon: 'Building2',
    });
  }

  if (property.bankFinancing || property.directFinancing) {
    const finText = property.bankFinancing && property.directFinancing
      ? 'Aceita Financiamento Bancário (Caixa/Bancos) ou Parcelamento Direto c/ a Construtora'
      : property.bankFinancing
      ? 'Imóvel Averbado: Aceita Financiamento Bancário com as Menores Taxas'
      : 'Financiamento Direto com a Construtora sem Burocracia Bancária';
    
    customBenefits.push({
      title: 'Condições Flexíveis de Pagamento',
      description: finText,
      icon: 'CheckCircle',
    });
  }

  // 3. Destaques de Localização
  const locationHighlights: string[] = [
    `Localizado no nobre bairro ${neighborhood}, próximo a excelentes restaurantes e centros comerciais.`,
    `Acesso rápido às principais avenidas e vias de ligação de ${city}.`,
    'Região de alta valorização imobiliária constante e vizinhança segura e qualificada.',
    'Proximidade com escolas, academias, supermercados e polos gastronômicos.',
  ];

  // 4. Pitch de Financiamento
  let financingPitch = 'Condições personalizadas de negociação. Aceitamos proposta e estudamos seu veículo ou imóvel na troca como parte de pagamento conforme avaliação.';
  if (property.bankFinancing && property.directFinancing) {
    financingPitch = 'Flexibilidade Total: Compre pelo seu banco de preferência (Caixa Econômica, Itaú, Bradesco, Santander) ou aproveite o plano facilitado direto com a construtora com entrada e saldo parcelado.';
  } else if (property.bankFinancing) {
    financingPitch = 'Imóvel 100% Averbado e Documentado: Pronto para financiamento bancário imediato com utilização de FGTS e taxas atrativas.';
  } else if (property.directFinancing) {
    financingPitch = 'Facilidade Direta com a Construtora: Financiamento direto com fluxo de pagamento sob medida durante o período de obras ou pronto, sem necessidade de comprovação bancária engessada.';
  }

  // 5. Preço Personalizado
  const customPriceDisplay = property.priceFormatted && property.priceFormatted !== 'A Consultar'
    ? `A partir de ${property.priceFormatted}`
    : 'Consulte Condições Exclusivas';

  // 6. Mensagem de WhatsApp
  const customWhatsappMessage = `Olá Daniel Pacheco! Vi a landing page do ${property.title} (Cód: ${property.code}) e quero receber mais informações e detalhes da negociação.`;

  // 7. Slug limpo
  const cleanTitleSlug = slugify(property.title || 'imovel');
  const slug = `lp-${property.code ? property.code.toLowerCase() : 'imovel'}-${cleanTitleSlug}`;

  const now = Date.now();

  const generatedLP: LandingPage = {
    id: `lp_${property.id || property.code}_${now}`,
    slug: customOptions?.slug || slug,
    propertyId: property.id,
    propertyCode: property.code,
    title: customOptions?.title || `Landing Page: ${property.title}`,
    heroHeadline: customOptions?.heroHeadline || heroHeadline,
    heroSubheadline: customOptions?.heroSubheadline || heroSubheadline,
    badgeText: customOptions?.badgeText || badgeText,
    themeStyle: customOptions?.themeStyle || themeStyle,
    targetAudience: customOptions?.targetAudience || audience,
    customPriceDisplay: customOptions?.customPriceDisplay || customPriceDisplay,
    customWhatsappMessage: customOptions?.customWhatsappMessage || customWhatsappMessage,
    videoUrl: customOptions?.videoUrl || '',
    customBenefits: customOptions?.customBenefits || customBenefits,
    locationHighlights: customOptions?.locationHighlights || locationHighlights,
    financingPitch: customOptions?.financingPitch || financingPitch,
    urgencyText: customOptions?.urgencyText || urgencyText,
    showMortgageSimulator: customOptions?.showMortgageSimulator !== undefined ? customOptions.showMortgageSimulator : true,
    showFloorPlan: customOptions?.showFloorPlan !== undefined ? customOptions.showFloorPlan : Boolean(property.floorPlanUrl),
    metaTitle: customOptions?.metaTitle || `${property.title} | Oportunidade Exclusiva em ${city} com Daniel Pacheco`,
    metaDescription: customOptions?.metaDescription || `${heroSubheadline} Agende sua consultoria exclusiva agora mesmo.`,
    utmCampaign: customOptions?.utmCampaign || `campanha_${property.code.toLowerCase()}_trafego`,
    viewsCount: 0,
    leadsCount: 0,
    active: true,
    createdAt: now,
    updatedAt: now,
  };

  return generatedLP;
}
