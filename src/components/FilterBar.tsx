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
  ShieldCheck,
  BedDouble,
  X
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

  const bedroomOptions = ['Todos', '1', '2', '3', '4'];

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
    <div id="property-filters-container" className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-5 sm:p-7 shadow-md space-y-5 text-[#111111]">
      {/* Search Input & Quick Selects Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        {/* Search input */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-[#777777] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="filter-search-input"
            type="text"
            placeholder="Buscar por empreendimento, bairro, construtora ou código..."
            value={filters.search || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full bg-[#FBF9F5] border border-[#E5E0D8] focus:border-[#C9A227] text-sm text-[#111111] rounded-2xl pl-11 pr-10 py-3 outline-none placeholder-[#777777] transition-all"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#777777] hover:text-[#111111] p-1 cursor-pointer"
              title="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* City Select */}
        <div className="md:col-span-3 relative">
          <MapPin className="w-4 h-4 text-[#C9A227] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            id="filter-city-select"
            value={filters.city || 'Todas'}
            onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
            aria-label="Filtrar por cidade"
            className="w-full bg-[#FBF9F5] border border-[#E5E0D8] focus:border-[#C9A227] text-sm text-[#111111] rounded-2xl pl-10 pr-8 py-3 outline-none appearance-none cursor-pointer transition-all"
          >
            <option value="Todas">Todas as Cidades</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#777777]">
            ▼
          </div>
        </div>

        {/* Property Type Select */}
        <div className="md:col-span-2 relative">
          <Home className="w-4 h-4 text-[#C9A227] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            id="filter-type-select"
            value={filters.type || 'Todos'}
            onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value as PropertyType | 'Todos' }))}
            aria-label="Filtrar por tipo de imóvel"
            className="w-full bg-[#FBF9F5] border border-[#E5E0D8] focus:border-[#C9A227] text-sm text-[#111111] rounded-2xl pl-10 pr-8 py-3 outline-none appearance-none cursor-pointer transition-all"
          >
            {typeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt === 'Todos' ? 'Todos os Tipos' : opt}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#777777]">
            ▼
          </div>
        </div>

        {/* Bedrooms count */}
        <div className="md:col-span-2 relative">
          <BedDouble className="w-4 h-4 text-[#C9A227] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            id="filter-bedrooms-select"
            value={filters.bedrooms || 'Todos'}
            onChange={(e) => setFilters((prev) => ({ ...prev, bedrooms: e.target.value }))}
            aria-label="Filtrar por dormitórios"
            className="w-full bg-[#FBF9F5] border border-[#E5E0D8] focus:border-[#C9A227] text-sm text-[#111111] rounded-2xl pl-10 pr-8 py-3 outline-none appearance-none cursor-pointer transition-all"
          >
            <option value="Todos">Quartos: Todos</option>
            <option value="1">1+ Quarto</option>
            <option value="2">2+ Quartos</option>
            <option value="3">3+ Quartos</option>
            <option value="4">4+ Quartos</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#777777]">
            ▼
          </div>
        </div>
      </div>

      {/* Quick Filter Segmented Buttons & Chips Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#E5E0D8] text-xs">
        {/* Status Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-[#666666] uppercase tracking-wider font-semibold mr-1 hidden sm:inline">
            Status:
          </span>
          {statusOptions.map((status) => {
            const isActive = (filters.status || 'Todos') === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, status }))}
                className={`px-3 py-1.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C9A227] text-[#0A0A0A] font-bold shadow-xs'
                    : 'bg-[#F7F3EB] hover:bg-[#EAE4D8] text-[#555555] hover:text-[#111111] border border-[#E5E0D8]'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        {/* Financing Chips & Reset */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Direct Financing Filter */}
          <button
            type="button"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                financing: prev.financing === 'Construtora' ? 'Todos' : 'Construtora',
              }))
            }
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              filters.financing === 'Construtora'
                ? 'bg-[#1F8A4C] text-white font-bold shadow-sm'
                : 'bg-[#F7F3EB] hover:bg-[#EAE4D8] text-[#555555] border border-[#E5E0D8]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Direto Construtora</span>
          </button>

          {/* Bank Financing Filter */}
          <button
            type="button"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                financing: prev.financing === 'Bancario' ? 'Todos' : 'Bancario',
              }))
            }
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              filters.financing === 'Bancario'
                ? 'bg-[#0284C7] text-white font-bold shadow-sm'
                : 'bg-[#F7F3EB] hover:bg-[#EAE4D8] text-[#555555] border border-[#E5E0D8]'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Financ. Bancário</span>
          </button>

          {/* Signature Only */}
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, onlySignature: !prev.onlySignature }))}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              filters.onlySignature
                ? 'bg-[#C9A227]/20 border border-[#C9A227] text-[#0A0A0A] font-bold'
                : 'bg-[#F7F3EB] hover:bg-[#EAE4D8] text-[#555555] border border-[#E5E0D8]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Exclusivos</span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 text-xs text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Counter & Active Filters Summary */}
      <div className="flex items-center justify-between pt-1 text-xs text-[#666666]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1F8A4C] animate-pulse" />
          <span>
            Mostrando <strong className="text-[#111111] font-mono tabular-nums">{totalCount}</strong> {totalCount === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}
          </span>
        </div>

        {hasActiveFilters && (
          <span className="text-[11px] text-[#C9A227] font-semibold">
            Filtros ativos aplicados
          </span>
        )}
      </div>
    </div>
  );
};
