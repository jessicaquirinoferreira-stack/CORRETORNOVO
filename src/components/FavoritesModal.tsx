import React from 'react';
import { Property, SiteSettings } from '../types';
import { X, Heart, MessageCircle, ArrowRight, Trash2, MapPin, Sparkles } from 'lucide-react';
import { formatCurrency, createWhatsAppUrl } from '../utils/formatters';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Property[];
  onRemoveFavorite: (propertyId: string) => void;
  onClearFavorites: () => void;
  onSelectProperty: (property: Property) => void;
  settings: SiteSettings;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onClearFavorites,
  onSelectProperty,
  settings,
}) => {
  if (!isOpen) return null;

  const handleWhatsAppFavorites = () => {
    const list = favorites.map((p) => `- Cód. ${p.code}: ${p.title} (${p.city})`).join('\n');
    const text = `Olá Daniel Pacheco! Salvei meus imóveis favoritos no seu site:\n\n${list}\n\nPoderia me enviar mais detalhes e disponibilidade deles?`;
    const url = createWhatsAppUrl(settings.whatsapp || '5548998001744', text);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative bg-[#121212] text-white border border-[#2A2A2A] w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl my-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4 mb-6">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-[#C9A227] text-[#C9A227]" />
              Lista de Imóveis Salvos
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Seus Favoritos ({favorites.length})
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {favorites.length > 0 && (
              <button
                onClick={onClearFavorites}
                className="text-xs text-[#A0A0A0] hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Limpar Lista</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-[#A0A0A0] hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#C9A227]">
              <Heart className="w-8 h-8 opacity-40" />
            </div>
            <h3 className="text-lg font-bold text-white">Nenhum imóvel favoritado ainda</h3>
            <p className="text-xs text-[#A0A0A0] max-w-md mx-auto">
              Clique no ícone de coração nos cards de imóveis para salvar suas opções preferidas e acessá-las facilmente aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[55vh] overflow-y-auto pr-1">
              {favorites.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden hover:border-[#C9A227]/60 transition-colors flex flex-col justify-between group"
                >
                  <div>
                    <div 
                      onClick={() => {
                        onClose();
                        onSelectProperty(prop);
                      }}
                      className="relative aspect-video bg-black/50 cursor-pointer overflow-hidden"
                    >
                      <img
                        src={prop.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 bg-[#C9A227] text-[#0A0A0A] text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                        {prop.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFavorite(prop.id);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-red-400 hover:text-red-300 hover:bg-black/90 transition-colors cursor-pointer"
                        title="Remover dos favoritos"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                    <div className="p-4 space-y-1">
                      <h4 
                        onClick={() => {
                          onClose();
                          onSelectProperty(prop);
                        }}
                        className="font-bold text-sm text-white hover:text-[#C9A227] cursor-pointer line-clamp-1 transition-colors"
                      >
                        {prop.title}
                      </h4>
                      <p className="text-[11px] text-[#A0A0A0] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#C9A227]" />
                        <span>{prop.neighborhood}, {prop.city}</span>
                      </p>
                      <p className="text-xs font-bold text-[#C9A227] font-serif pt-1 tabular-nums">
                        {prop.price ? formatCurrency(prop.price) : 'Consulte Valor'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectProperty(prop);
                      }}
                      className="w-full py-2 bg-white/5 hover:bg-white/15 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Ver Imóvel</span>
                      <ArrowRight className="w-3 h-3 text-[#C9A227]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[#A0A0A0]">
                Envie toda a sua seleção de uma só vez para consultoria de viabilidade e agendamento de visita.
              </span>
              <button
                onClick={handleWhatsAppFavorites}
                className="bg-[#1F8A4C] hover:bg-[#197A42] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Enviar Seleção no WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
