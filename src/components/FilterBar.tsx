import React from 'react';
import { 
  Search, 
  MapPin, 
  Building2, 
  Sparkles, 
  RotateCcw, 
  SlidersHorizontal,
  Home,
  Check,
  Landmark,
  ShieldCheck
} from 'lucide-react';
import { PropertyFilter, PropertyStatus, PropertyType } from '../types';

interface FilterBarProps {
  filters: PropertyFilter;
  setFilters: React.Dispatch<React.SetStateAction<PropertyFilter>>;
  totalCount: number;
  cities: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  totalCount,
  cities,
}) => {
  const statusOptions: (PropertyStatus | 'Todos')[] = [
    'Todos',
    'Na planta',
    'Pronto',
    'Em obras',
    'Loteamento',
  ];

  const typeOptions: (PropertyType | 'Todos')[] = [
    'Todos',
    'Apartamento',
    'Casa',
    'Lote/Terreno',
  ];

  const handleReset = () => {
    setFilters({
      search: '',
      city: 'Todas',
      status: 'Todos',
      type: 'Todos',
      bedrooms: 'Todos',
      onlySignature: false,
      financing: 'Todos',
    });
  };

  const hasActiveFilters = 
    (filters.search && filters.search.trim() !== '') ||
    (filters.city && filters.city !== 'Todas') ||
    (filters.status && filters.status !== 'Todos') ||
    (filters.type && filters.type !== 'Todos') ||
    (filters.bedrooms && filters.bedrooms !== 'Todos') ||
    (filters.financing && filters.financing !== 'Todos') ||
    filters.onlySignature;

  return (
    <div id="property-filters-container" className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
      {/* Top Search & Primary Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search input */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-[#5A5A5A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="filter-search-input"
            type="text"
            placeholder="Buscar por bairro, condomínio ou código..."
            value={filters.search || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-sm text-[#111111] rounded-xl pl-10 pr-4 py-2.5 outline-none placeholder-[#5A5A5A] transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5A5A5A] hover:text-[#111111]"
            >
              ✕
            </button>
          )}
        </div>

        {/* City Select */}
        <div className="md:col-span-3 relative">
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#C9A227] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="filter-city-select"
              value={filters.city || 'Todas'}
              onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
              aria-label="Filtrar por cidade"
              className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-sm text-[#111111] rounded-xl pl-10 pr-8 py-2.5 outline-none appearance-none cursor-pointer"
            >
              <option value="Todas">Todas as Cidades</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#5A5A5A]">
              ▼
            </div>
          </div>
        </div>

        {/* Property Type Select */}
        <div className="md:col-span-3 relative">
          <div className="relative">
            <Home className="w-4 h-4 text-[#C9A227] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="filter-type-select"
              value={filters.type || 'Todos'}
              onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value as PropertyType | 'Todos' }))}
              aria-label="Filtrar por tipo de imóvel"
              className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-sm text-[#111111] rounded-xl pl-10 pr-8 py-2.5 outline-none appearance-none cursor-pointer"
            >
              {typeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'Todos' ? 'Todos os Tipos' : opt}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#5A5A5A]">
              ▼
            </div>
          </div>
        </div>

        {/* Bedrooms count */}
        <div className="md:col-span-2 relative">
          <select
            id="filter-bedrooms-select"
            value={filters.bedrooms || 'Todos'}
            onChange={(e) => setFilters((prev) => ({ ...prev, bedrooms: e.target.value }))}
            aria-label="Filtrar por número de quartos"
            className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-sm text-[#111111] rounded-xl px-3 py-2.5 outline-none appearance-none cursor-pointer"
          >
            <option value="Todos">Quartos: Todos</option>
            <option value="1">1 Quarto ou mais</option>
            <option value="2">2 Quartos ou mais</option>
            <option value="3">3 Quartos ou mais</option>
            <option value="4">4+ Quartos</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#5A5A5A]">
            ▼
          </div>
        </div>
      </div>

      {/* Secondary Row: Status Pills, Financing Filters & Action Counts */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pt-3 border-t border-[#E5E0D8]">
        {/* Status quick tabs & Financing options */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
          <span className="text-xs text-[#5A5A5A] mr-1 hidden sm:inline">Status:</span>
          {statusOptions.map((status) => {
            const isActive = (filters.status || 'Todos') === status;
            return (
              <button
                key={status}
                id={`filter-status-btn-${status.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setFilters((prev) => ({ ...prev, status }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C9A227] text-[#0A0A0A] font-semibold shadow-sm'
                    : 'bg-[#F7F3EB] text-[#5A5A5A] hover:text-[#111111] hover:bg-[#E5E0D8]'
                }`}
              >
                {status}
              </button>
            );
          })}

          <div className="h-4 w-px bg-[#E5E0D8] mx-1 hidden sm:block" />

          {/* Bank Financing Filter Button */}
          <button
            id="filter-bank-financing-toggle"
            onClick={() => setFilters((prev) => ({ 
              ...prev, 
              financing: prev.financing === 'Bancario' ? 'Todos' : 'Bancario' 
            }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all whitespace-nowrap cursor-pointer ${
              filters.financing === 'Bancario'
                ? 'bg-[#0284C7] text-white font-semibold shadow-sm'
                : 'bg-[#F7F3EB] text-[#5A5A5A] hover:text-[#0284C7] border border-[#E5E0D8]'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Financiamento Bancário</span>
          </button>

          {/* Direct Financing Filter Button */}
          <button
            id="filter-direct-financing-toggle"
            onClick={() => setFilters((prev) => ({ 
              ...prev, 
              financing: prev.financing === 'Construtora' ? 'Todos' : 'Construtora' 
            }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all whitespace-nowrap cursor-pointer ${
              filters.financing === 'Construtora'
                ? 'bg-[#1F8A4C] text-white font-semibold shadow-sm'
                : 'bg-[#F7F3EB] text-[#5A5A5A] hover:text-[#1F8A4C] border border-[#E5E0D8]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Direto Construtora</span>
          </button>

          {/* Signature Toggle */}
          <button
            id="filter-signature-toggle"
            onClick={() => setFilters((prev) => ({ ...prev, onlySignature: !prev.onlySignature }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all whitespace-nowrap cursor-pointer ${
              filters.onlySignature
                ? 'bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]'
                : 'bg-[#F7F3EB] text-[#5A5A5A] hover:text-[#C9A227] border border-[#E5E0D8]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#C9A227]" />
            <span>Seleção Exclusiva</span>
          </button>
        </div>

        {/* Count and Clear */}
        <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto text-xs pt-1 lg:pt-0">
          <div className="text-[#5A5A5A]">
            <span className="font-semibold text-[#111111]">{totalCount}</span> {totalCount === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
          </div>

          {hasActiveFilters && (
            <button
              id="filter-clear-all-btn"
              onClick={handleReset}
              className="text-[#C9A227] hover:text-[#111111] flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpar filtros</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
