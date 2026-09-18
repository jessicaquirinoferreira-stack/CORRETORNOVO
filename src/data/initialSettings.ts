import { SiteSettings } from '../types';

export const DEFAULT_SETTINGS: SiteSettings = {
  realtorName: 'Daniel Pacheco',
  creci: 'CRECI-38.813',
  cnai: 'CNAI 34.653',
  logoUrl: 'https://i.postimg.cc/wv36Qv93/Chat-GPT-Image-26-de-ago-de-2026-09-58-21-(1).png',
  phone: '(48) 9 9800-1744',
  whatsapp: '5548998001744',
  email: 'daniel.pacheco@creci.org.br',
  instagram: 'https://instagram.com/corretordanielpacheco',
  facebook: 'https://www.facebook.com/corretordanielpacheco',
  twitter: 'https://twitter.com/dennyboybr',
  youtube: 'https://youtube.com/@danielpachecocorretor9626',
  tiktok: 'https://tiktok.com/@danielpachecocorretor',
  address: 'Rua Marcelo Lodetti 55 Condominio Ed. Florença - Criciúma - SC, 88801-510',
  businessHours: 'Segunda a Sexta: 08:00 às 18:00 | Sábado e Domingo: Fechado (Atendimento somente sob agendamento)',
  heroHeadline: 'Encontre o lugar certo.',
  heroSubtitle: 'Empreendimentos oficiais e imóveis prontos, selecionados para diferentes momentos de compra no Sul de Santa Catarina.',
  aboutTitle: 'Consultoria Imobiliária com olhar técnico e foco em valorização',
  aboutText: 'Com sólida atuação no mercado do Sul de Santa Catarina, a assessoria do corretor Daniel Pacheco é pautada pela transparência, análise minuciosa de oportunidades na planta e facilidade no financiamento direto com as melhores construtoras da região.',
  signatureSubtitle: 'Imóveis para morar e investir com os mais altos padrões de acabamento, localização e retorno.',
  siteUrl: 'https://www.corretordanielpacheco.com.br',
  watermarkUrl: 'https://i.postimg.cc/FKYZkRgL/Chat-GPT-Image-10-09-2026-08-55-36.png',
  watermarkOpacity: 0.42,
  watermarkPosition: 'bottom-right',
  watermarkScale: 0.32,
};

export interface CityGuide {
  id: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  image: string;
  averageGrowth: string;
}

export const AMREC_DESCRIPTION = 'AMREC (Associação dos Municípios da Região Carbonífera) é integrada por 12 municípios localizados no sul de SC.';

export const CITIES_DATA: CityGuide[] = [
  {
    id: 'criciuma',
    name: 'Criciúma (sede)',
    tagline: 'Sede da AMREC, polo econômico, médico e universitário do Sul Catarinense',
    description: 'Capital econômica da região carbonífera e sede da AMREC, Criciúma se destaca por sua infraestrutura médica de ponta, grandes polos universitários (UNESC, Esucri), parques urbanos premiados (Parque das Nações, Parque dos Imigrantes, Parque Prefeito Altair Guidi) e forte valorização imobiliária nos bairros Centro, Cruzeiro do Sul, Comerciário, Michel, Pio Corrêa, Santa Bárbara e São Luiz.',
    highlights: ['Sede da AMREC e Centro Financeiro', 'Infraestrutura Médica e Hospitalar', '3 Grandes Parques Urbanos', 'Alta Liquidez para Locação e Venda'],
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2560&q=95',
    averageGrowth: '+14% a.a.',
  },
  {
    id: 'balneario-rincao',
    name: 'Balneário Rincão',
    tagline: 'O litoral vibrante e mais valorizado da região da AMREC',
    description: 'Balneário Rincão é o principal refúgio à beira-mar do Sul de Santa Catarina, com calçadão beira-mar moderno e totalmente revitalizado, lagoas paradisíacas (Lagoa dos Esteves) e altíssima procura por casas de veraneio e apartamentos de alto padrão na Zona Norte, Centro e condomínios fechados durante todo o ano.',
    highlights: ['Orla Marítima Totalmente Revitalizada', 'Lagoa dos Esteves & Esportes Náuticos', 'Alta Valorização Imobiliária de Veraneio', 'Apenas 20 min de Criciúma pela SC-445'],
    image: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=2560&q=95',
    averageGrowth: '+18% a.a.',
  },
  {
    id: 'cocal-do-sul',
    name: 'Cocal do Sul',
    tagline: 'Tradição industrial cerâmica, ambiente familiar e tranquilidade',
    description: 'Conhecida pela força industrial da cerâmica Eliane e alta qualidade de vida, Cocal do Sul oferece excelente equilíbrio entre custo-benefício, segurança e proximidade dos grandes polos regionais.',
    highlights: ['Polo Cerâmico de Renome Internacional', 'Ambiente Familiar Seguro e Confortável', 'Apartamentos e Lotes Acessíveis', 'A 10 minutos de Criciúma'],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2560&q=95',
    averageGrowth: '+11% a.a.',
  },
  {
    id: 'forquilhinha',
    name: 'Forquilhinha',
    tagline: 'Herança germânica, parques floridos e desenvolvimento contínuo',
    description: 'Com forte identidade e cultura germânica, praças arborizadas, ruas organizadas e tradição gastronômica, Forquilhinha é uma cidade acolhedora com excelente oferta de apartamentos e loteamentos residenciais bem planejados.',
    highlights: ['Cultura Germânica, Praças e Gastronomia', 'Centro Urbano Organizado e Seguro', 'Lançamentos Residenciais com Ótima Metragem', 'Forte Polo Industrial Alimentício'],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2560&q=95',
    averageGrowth: '+10% a.a.',
  },
  {
    id: 'icara',
    name: 'Içara',
    tagline: 'Conexão estratégica, expansão industrial e forte polo de loteamentos',
    description: 'Vizinha imediata de Criciúma e rota de acesso ao litoral, Içara é o município que mais atrai novos loteamentos residenciais planejados e empreendimentos com financiamento direto facilitado pelas loteadoras.',
    highlights: ['Loteamentos com Parcelamento Direto até 120x/240x', 'Hub Logístico e Comercial da SC-445', 'Qualidade de Vida e Espaço Amplo', 'Conexão Direta entre Criciúma e o Mar'],
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2560&q=95',
    averageGrowth: '+13% a.a.',
  },
  {
    id: 'lauro-muller',
    name: 'Lauro Müller',
    tagline: 'Portal da imponente Serra do Rio do Rastro e ecoturismo',
    description: 'Localizada no sopé da mundialmente famosa Serra do Rio do Rastro, Lauro Müller encanta pelo clima de montanha, patrimônio histórico e crescente busca por imóveis turísticos, chácaras e terrenos com vistas cinematográficas.',
    highlights: ['Pé da Serra do Rio do Rastro', 'Turismo de Aventura e Clima Serrano', 'Chácaras e Terrenos com Natureza Nativa', 'Rota Turística de Alta Visibilidade'],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=95',
    averageGrowth: '+12% a.a.',
  },
  {
    id: 'morro-da-fumaca',
    name: 'Morro da Fumaça',
    tagline: 'Localização estratégica com acesso imediato à BR-101',
    description: 'Polo cerâmico e comercial em expansão no eixo da BR-101, oferecendo casas residenciais com pátios generosos, loteamentos em desenvolvimento e custos altamente competitivos.',
    highlights: ['Acesso Imediato à Rodovia BR-101', 'Casas com Terrenos e Quintais Amplos', 'Custo-benefício Imobiliário Imbatível', 'Polo Industrial Cerâmico'],
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2560&q=95',
    averageGrowth: '+9% a.a.',
  },
  {
    id: 'nova-veneza',
    name: 'Nova Veneza',
    tagline: 'Capital Nacional da Gastronomia Típica Italiana',
    description: 'Com atmosfera europeia inigualável, gôndola oficial doada por Veneza, Santuário de Caravaggio e festivais renomados, Nova Veneza atrai compradores que buscam alto padrão arquitetônico, sofisticação, turismo e tranquilidade.',
    highlights: ['Capital Gastronômica Reconhecida Nacionalmente', 'Turismo Cultural e Arquitetura Elegante', 'Bairro Caravaggio e Santuário em Alta', 'Clima Aconchegante e Sossego'],
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=2560&q=95',
    averageGrowth: '+15% a.a.',
  },
  {
    id: 'orleans',
    name: 'Orleans',
    tagline: 'Cidade das Colinas, arte ao ar livre e polo universitário',
    description: 'Acolhedora e cercada por belas colinas, Orleans abriga o famoso Museu ao Ar Livre, as históricas Esculturas do Paredão de Zé Diabo e a sede do Centro Universitário Barriga Verde (UNIBAVE).',
    highlights: ['Polo Educacional e Universitário (UNIBAVE)', 'Museu ao Ar Livre e Cultura Histórica', 'Belas Paisagens e Bairros Tranquilos', 'Excelente Opção para Morar e Estudar'],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2560&q=95',
    averageGrowth: '+10% a.a.',
  },
  {
    id: 'sideropolis',
    name: 'Siderópolis',
    tagline: 'Natureza exuberante, barragem do Rio São Bento e ar puro',
    description: 'A apenas 15 minutos do Centro de Criciúma, Siderópolis abriga a monumental Barragem do Rio São Bento, gastronomia típica italiana e opções imperdíveis de chácaras, sítios e lotes em contato com a Mata Atlântica.',
    highlights: ['Barragem do Rio São Bento e Paisagens Únicas', 'Ecoturismo e Trilhas Ecológicas', 'Chácaras e Lotes Residenciais Tranquilos', 'Proximidade Imediata a Criciúma'],
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2560&q=95',
    averageGrowth: '+11% a.a.',
  },
  {
    id: 'treviso',
    name: 'Treviso',
    tagline: 'Belezas naturais intocadas e refúgio serrano',
    description: 'Com relevo montanhoso, cachoeiras cristalinas e forte vocação para turismo rural e de bem-estar, Treviso proporciona qualidade de vida incomparável para quem busca refúgio no campo ou investimentos sustentáveis.',
    highlights: ['Cachoeiras e Trilhas Ecológicas', 'Paz, Sossego e Qualidade do Ar', 'Propriedades Rurais e Chácaras Exclusivas', 'Acolhimento da Imigração Italiana'],
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2560&q=95',
    averageGrowth: '+10% a.a.',
  },
  {
    id: 'urussanga',
    name: 'Urussanga',
    tagline: 'Capital Catarinense do Vinho Goethe e patrimônio cultural',
    description: 'Conhecida internacionalmente pelos vales dos vinhedos da uva Goethe com selo de Indicação Geográfica de Procedência, Urussanga ostenta patrimônio histórico colonial preservado e eventos tradicionais memoráveis como a Festa do Vinho e Ritorno alle Origini.',
    highlights: ['Indicação Geográfica do Vinho Goethe', 'Arquitetura Histórica e Praça Central Tradicional', 'Festas Culturais e Alta Gastronomia', 'Terrenos e Casarões com Charme Único'],
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=2560&q=95',
    averageGrowth: '+12% a.a.',
  },
];

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_LIST: FAQItem[] = [
  {
    question: 'Como funciona o Financiamento Direto com a Construtora?',
    answer: 'No financiamento direto, você negocia diretamente com a construtora sem a burocracia bancária tradicional. As condições gerais envolvem entrada facilitada (10% a 20%), parcelas mensais durante a obra e reforços semestrais/anuais (balões), corrigidos pelo CUB/SC até a entrega das chaves e INPC/IPCA + juros após a entrega.',
  },
  {
    question: 'Por que investir em apartamentos na planta no Sul de SC?',
    answer: 'Comprar na planta oferece valorização patrimonial média entre 20% e 40% durante o período de obras, possibilidade de personalização da planta, fluxo de pagamento escalonado e garantia de imóvel 100% novo com as mais modernas tecnologias construtivas.',
  },
  {
    question: 'Qual a diferença entre a assessoria de um corretor curador e uma imobiliária tradicional?',
    answer: 'Daniel Pacheco atua com seleção criteriosa e atendimento consultivo direto. Em vez de apresentar centenas de opções genéricas, filtramos apenas os empreendimentos oficiais com real potencial de valorização, histórico sólido da construtora e alinhamento com seu perfil financeiro.',
  },
  {
    question: 'Quais cidades da região possuem maior potencial de valorização?',
    answer: 'Criciúma (bairros Centro, Santa Bárbara e Cruzeiro do Sul) oferece máxima liquidez e infraestrutura urbana; Balneário Rincão lidera a valorização de veraneio e estilo de vida beira-mar; Nova Veneza atrai pelo apelo gastronômico e Içara se destaca na expansão de loteamentos.',
  },
  {
    question: 'Como agendar uma visita guiada aos decorados ou imóveis prontos?',
    answer: 'Você pode solicitar o agendamento através do nosso botão de WhatsApp ou preenchendo o formulário de consultoria. Atendemos com horário exclusivo, inclusive aos finais de semana e feriados para clientes que vêm de outras cidades.',
  },
];
