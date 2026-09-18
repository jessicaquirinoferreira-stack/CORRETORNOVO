import React, { useState, useMemo } from 'react';
import { Building2, Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Property, SiteSettings, PropertyFilter } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { FilterBar } from '../components/FilterBar';

interface PortfolioPageProps {
  properties: Property[];
  settings: SiteSettings;
  onSelectProperty: (property: Property) => void;
  onOpenCuratedModal: () => void;
  initialFilter?: Partial<PropertyFilter>;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  properties,
  settings,
  onSelectProperty,
  onOpenCuratedModal,
  initialFilter,
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

  const [sortBy, setSortBy] = useState<'recent' | 'code' | 'bedrooms'>('recent');

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
      if (sortBy === 'bedrooms') {
        return (b.bedrooms || 0) - (a.bedrooms || 0);
      }
      if (sortBy === 'code') {
        return b.code.localeCompare(a.code);
      }
      // default: signature first then created
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [properties, filters, sortBy]);

  return (
    <div id="portfolio-page" className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header section */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#C9A227]">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
          <span className="font-semibold">Catálogo de Imóveis & Empreendimentos</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#111111]">
          Portfólio no Sul de Santa Catarina
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5A5A] max-w-3xl leading-relaxed">
          Navegue pelas opções disponíveis em Criciúma, Balneário Rincão, Içara, Nova Veneza e municípios vizinhos. Empreendimentos oficiais com suporte técnico do corretor.
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        totalCount={filteredProperties.length}
        cities={citiesList}
      />

      {/* Sorting bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#5A5A5A] pt-2">
        <p>
          Exibindo <span className="font-semibold text-[#111111]">{filteredProperties.length}</span> de <span className="text-[#111111] font-semibold">{properties.length}</span> imóveis cadastrados
        </p>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#C9A227]" />
          <span className="font-medium">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#FFFFFF] border border-[#E5E0D8] text-[#111111] rounded-lg px-2.5 py-1.5 text-xs outline-none cursor-pointer focus:border-[#C9A227] shadow-sm"
          >
            <option value="recent">Relevância / Seleção Exclusiva</option>
            <option value="bedrooms">Mais Quartos</option>
            <option value="code">Código do Imóvel</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop, idx) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              settings={settings}
              onSelect={onSelectProperty}
              priority={idx < 3}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-8 space-y-4 shadow-sm">
          <Building2 className="w-12 h-12 text-[#5A5A5A] mx-auto" />
          <h3 className="text-xl font-serif-luxury text-[#111111]">Nenhum imóvel encontrado</h3>
          <p className="text-xs text-[#5A5A5A] max-w-md mx-auto">
            Não encontramos resultados para esta combinação. Que tal solicitar uma busca personalizada diretamente no WhatsApp de Daniel Pacheco?
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => setFilters({ search: '', city: 'Todas', status: 'Todos', type: 'Todos', bedrooms: 'Todos', onlySignature: false })}
              className="px-4 py-2 bg-[#F7F3EB] hover:bg-[#E5E0D8] text-[#111111] border border-[#E5E0D8] rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              Resetar Filtros
            </button>
            <button
              onClick={onOpenCuratedModal}
              className="px-4 py-2 bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-sm"
            >
              Solicitar Consultoria VIP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
