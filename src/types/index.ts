export type PropertyStatus = 'Na planta' | 'Em obras' | 'Pronto' | 'Loteamento';

export type PropertyType = 'Apartamento' | 'Casa' | 'Lote/Terreno' | 'Cobertura' | 'Sala Comercial';

export interface Property {
  id: string;
  code: string;
  title: string;
  headline?: string;
  description: string;
  shortDescription: string;
  city: string;
  neighborhood: string;
  state: string;
  type: PropertyType;
  status: PropertyStatus;
  price?: number; // In BRL, if undefined = "Consulte"
  priceFormatted?: string;
  areaM2?: number;
  bedrooms?: number;
  suites?: number;
  bathrooms?: number;
  garageSpaces?: number;
  developer?: string; // Construtora
  featured?: boolean; // Seleção Exclusiva
  images: string[];
  features: string[]; // Diferenciais (ex: Sacada com churrasqueira, Piscina, Vista mar)
  floorPlanUrl?: string;
  directFinancing?: boolean; // Financiamento direto com construtora
  bankFinancing?: boolean; // Aceita Financiamento Bancário (Averbado / Caixa / Bancos)
  deliveryYear?: string;
  hasExtendedGallery?: boolean; // Indicador de galeria completa estendida
  totalImagesCount?: number; // Total real de fotos salvas sem limites
  isArchived?: boolean; // Arquivado / Fora do ar temporariamente
  isDraft?: boolean; // Rascunho
  publicationStatus?: 'published' | 'archived' | 'draft';
  createdAt?: number;
  updatedAt?: number;
}

export const AMREC_CITIES = [
  'Criciúma',
  'Balneário Rincão',
  'Içara',
  'Cocal do Sul',
  'Forquilhinha',
  'Lauro Müller',
  'Morro da Fumaça',
  'Nova Veneza',
  'Orleans',
  'Siderópolis',
  'Treviso',
  'Urussanga'
] as const;

export interface SiteSettings {
  realtorName: string;
  creci: string;
  cnai?: string;
  logoUrl?: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  facebookPixelId?: string; // ID do Pixel da Meta / Facebook
  address: string;
  businessHours: string;
  heroHeadline: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  signatureSubtitle: string;
  siteUrl?: string;
  watermarkUrl?: string;
  watermarkOpacity?: number;
  watermarkPosition?: 'bottom-right' | 'center' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left';
  watermarkScale?: number;
  vercelBlobToken?: string;
}

export interface PropertyFilter {
  search?: string;
  city?: string;
  status?: PropertyStatus | 'Todos';
  type?: PropertyType | 'Todos';
  bedrooms?: string;
  minPrice?: number;
  maxPrice?: number;
  developer?: string;
  onlySignature?: boolean;
  financing?: 'Todos' | 'Bancario' | 'Construtora';
}

export interface CuratedInquiry {
  name: string;
  phone: string;
  cityPreference: string;
  objective: 'Morar' | 'Investir' | 'Segunda Residência';
  propertyType: string;
  budgetRange: string;
  timeframe: 'Imediato' | 'Até 6 meses' | 'Na planta (Longo prazo)';
  notes?: string;
}

export type LandingPageTheme = 'luxury-dark' | 'clean-gold' | 'ocean-modern' | 'minimalist-stone';
export type LandingPageAudience = 'investidor' | 'familia' | 'luxo' | 'primeiro_imovel' | 'geral';

export interface LandingPageBenefit {
  title: string;
  description: string;
  icon?: string;
}

export interface LandingPage {
  id: string;
  slug: string;
  propertyId: string;
  propertyCode: string;
  title: string;
  heroHeadline: string;
  heroSubheadline: string;
  badgeText: string;
  themeStyle: LandingPageTheme;
  targetAudience: LandingPageAudience;
  customPriceDisplay?: string;
  customWhatsappMessage?: string;
  videoUrl?: string;
  customBenefits: LandingPageBenefit[];
  locationHighlights: string[];
  financingPitch?: string;
  urgencyText?: string;
  showMortgageSimulator?: boolean;
  showFloorPlan?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  utmCampaign?: string;
  viewsCount?: number;
  leadsCount?: number;
  active: boolean;
  createdAt: number;
  updatedAt: number;
}

