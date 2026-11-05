import React, { useState, useMemo } from 'react';
import { Building2, Sparkles, SlidersHorizontal, ArrowUpDown, LayoutGrid, List, Search } from 'lucide-react';
import { Property, SiteSettings, PropertyFilter } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { FilterBar } from '../components/FilterBar';

interface PortfolioPageProps {
  properties: Property[];
  settings: SiteSettings;
  onSelectProperty: (property: Property) => void;
  onOpenCuratedModal: () => void;
  initialFilter?: Partial<PropertyFilter>;
  isFavorite?: (id: string) => boolean;
  onToggleFavorite?: (id: string) => void;
  compareList?: Property[];
  onToggleCompare?: (property: Property) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  properties,
  settings,
  onSelectProperty,
  onOpenCuratedModal,
  initialFilter,
  isFavorite,
  onToggleFavorite,
  compareList = [],
  onToggleCompare,
}) => {
  const [filters, setFilters] = useState<PropertyFilter>({
    search: '',
    city: 'Todas',
    status: 'Todos',
    type: 'Todos',
    bedrooms: 'Todos',
    onlySignature: false,
    ...initialFilter,
  });

  const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc' | 'bedrooms' | 'code'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  const citiesList = useMemo(() => {
    return Array.from(new Set(properties.map((p) => p.city))).filter(Boolean);
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (filters.search && filters.search.trim() !== '') {
        const q = filters.search.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchCity = p.city.toLowerCase().includes(q);
        const matchNeigh = p.neighborhood.toLowerCase().includes(q);
        const matchCode = p.code.toLowerCase().includes(q);
        const matchDev = (p.developer || '').toLowerCase().includes(q);
        if (!matchTitle && !matchCity && !matchNeigh && !matchCode && !matchDev) return false;
      }
      if (filters.city && filters.city !== 'Todas') {
        if (p.city.toLowerCase() !== filters.city.toLowerCase()) return false;
      }
      if (filters.status && filters.status !== 'Todos') {
        if (p.status !== filters.status) return false;
      }
      if (filters.type && filters.type !== 'Todos') {
        if (p.type !== filters.type) return false;
      }
      if (filters.bedrooms && filters.bedrooms !== 'Todos') {
        const reqBed = parseInt(filters.bedrooms, 10);
        if ((p.bedrooms || 0) < reqBed) return false;
      }
      if (filters.onlySignature && !p.featured) {
        return false;
      }
      if (filters.financing === 'Bancario' && !p.bankFinancing) {
        return false;
      }
      if (filters.financing === 'Construtora' && !p.directFinancing) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === 'price-desc') {
        return (b.price || 0) - (a.price || 0);
      }
      if (sortBy === 'bedrooms') {
        return (b.bedrooms || 0) - (a.bedrooms || 0);
      }
      if (sortBy === 'code') {
        return b.code.localeCompare(a.code);
      }
      // default: signature first then created desc
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [properties, filters, sortBy]);

  return (
    <div id="portfolio-page" className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-white">
      {/* Header section */}
      <div className="space-y-3 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#C9A227]/40 text-xs text-[#C9A227]">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-semibold uppercase tracking-wider">Catálogo de Imóveis & Empreendimentos</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-white">
          Portfólio no Sul de Santa Catarina
        </h1>
        <p className="text-xs sm:text-sm text-[#A0A0A0] max-w-3xl leading-relaxed">
          Navegue pelas opções disponíveis em Criciúma, Balneário Rincão, Içara, Nova Veneza e municípios vizinhos. Empreendimentos oficiais com suporte técnico do corretor Daniel Pacheco.
        </p>
      </div>

      {/* FilterBar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        totalCount={filteredProperties.length}
        cities={citiesList}
      />

      {/* View Switcher & Sorting Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#A0A0A0]">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#1A1A1A] border border-white/10 text-white rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="recent">Destaques & Recentes</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
            <option value="bedrooms">Mais Quartos</option>
            <option value="code">Código do Imóvel</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-[#1A1A1A] rounded-xl border border-white/10">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'grid' ? 'bg-[#C9A227] text-[#0A0A0A]' : 'text-[#A0A0A0] hover:text-white'
            }`}
            title="Visualização em Grade"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'compact' ? 'bg-[#C9A227] text-[#0A0A0A]' : 'text-[#A0A0A0] hover:text-white'
            }`}
            title="Visualização Compacta"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <div className="py-24 text-center space-y-4 bg-[#141414] rounded-3xl border border-white/10">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#C9A227]">
            <Search className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="text-xl font-bold text-white">Nenhum imóvel encontrado</h3>
          <p className="text-xs text-[#A0A0A0] max-w-md mx-auto">
            Ajuste seus filtros para visualizar outros empreendimentos ou contate diretamente o corretor pelo WhatsApp para receber sugestões fora da vitrine pública.
          </p>
          <button
            onClick={() => {
              setFilters({
                search: '',
                city: 'Todas',
                status: 'Todos',
                type: 'Todos',
                bedrooms: 'Todos',
                onlySignature: false,
              });
            }}
            className="bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] font-bold text-xs px-6 py-3 rounded-xl uppercase tracking-wider cursor-pointer transition-all"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
            : "grid grid-cols-1 sm:grid-cols-2 gap-5"
        }>
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
    </div>
  );
};
