import React from 'react';
import { Compass, ArrowRight, ArrowLeft } from 'lucide-react';
import { Property, SiteSettings } from '../types';

interface SiteMapPageProps {
  properties: Property[];
  settings: SiteSettings;
  navigate: (route: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const SiteMapPage: React.FC<SiteMapPageProps> = ({
  properties,
  settings,
  navigate,
  onSelectProperty,
}) => {
  const cities = Array.from(new Set(properties.map((p) => p.city))).filter(Boolean);

  return (
    <div id="sitemap-page" className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-200">
      <button
        onClick={() => navigate('home')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#111111] hover:text-[#C9A227] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar ao Início</span>
      </button>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E5E0D8] text-xs text-[#C9A227] shadow-sm">
          <Compass className="w-3.5 h-3.5" />
          <span>Estrutura & Navegação Completa</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-[#111111]">
          Mapa do Site
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-6 sm:p-10 shadow-sm">
        {/* Main Pages */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#C9A227] uppercase tracking-wider">
            Páginas Principais
          </h2>
          <ul className="space-y-2.5 text-xs text-[#5A5A5A]">
            <li>
              <button onClick={() => navigate('home')} className="hover:text-[#111111] flex items-center gap-1.5 cursor-pointer">
                <ArrowRight className="w-3 h-3 text-[#C9A227]" />
                <span>Início (Apresentação & Consultoria)</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigate('portfolio')} className="hover:text-[#111111] flex items-center gap-1.5 cursor-pointer">
                <ArrowRight className="w-3 h-3 text-[#C9A227]" />
                <span>Portfólio Completo de Imóveis</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigate('na-planta')} className="hover:text-[#111111] flex items-center gap-1.5 cursor-pointer">
                <ArrowRight className="w-3 h-3 text-[#C9A227]" />
                <span>Apartamentos na Planta</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigate('prontos')} className="hover:text-[#111111] flex items-center gap-1.5 cursor-pointer">
                <ArrowRight className="w-3 h-3 text-[#C9A227]" />
                <span>Imóveis Prontos para Morar</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigate('terrenos')} className="hover:text-[#111111] flex items-center gap-1.5 cursor-pointer">
                <ArrowRight className="w-3 h-3 text-[#C9A227]" />
                <span>Terrenos & Loteamentos (120x Direto)</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigate('cidades')} className="hover:text-[#111111] flex items-center gap-1.5 cursor-pointer">
                <ArrowRight className="w-3 h-3 text-[#C9A227]" />
                <span>Cidades Atendidas no Sul de SC</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigate('como-escolher')} className="hover:text-[#111111] flex items-center gap-1.5 cursor-pointer">
                <ArrowRight className="w-3 h-3 text-[#C9A227]" />
                <span>Como Escolher & Financiamento</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigate('sobre')} className="hover:text-[#111111] flex items-center gap-1.5 cursor-pointer">
                <ArrowRight className="w-3 h-3 text-[#C9A227]" />
                <span>Sobre o Corretor Daniel Pacheco</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigate('contato')} className="hover:text-[#111111] flex items-center gap-1.5 cursor-pointer">
                <ArrowRight className="w-3 h-3 text-[#C9A227]" />
                <span>Contato Oficial & Plantão</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Cities */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#C9A227] uppercase tracking-wider">
            Regiões & Polos
          </h2>
          <ul className="space-y-2 text-xs text-[#5A5A5A]">
            {cities.map((city) => (
              <li key={city}>
                <button
                  onClick={() => navigate('cidades')}
                  className="hover:text-[#111111] flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#5A5A5A]" />
                  <span>{city}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Featured Properties Direct Links */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#C9A227] uppercase tracking-wider">
            Empreendimentos em Foco
          </h2>
          <ul className="space-y-2 text-xs text-[#5A5A5A]">
            {properties.filter((p) => p.featured).slice(0, 8).map((prop) => (
              <li key={prop.id}>
                <button
                  onClick={() => onSelectProperty(prop)}
                  className="hover:text-[#C9A227] text-left line-clamp-1 cursor-pointer"
                >
                  • {prop.title} ({prop.city})
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
