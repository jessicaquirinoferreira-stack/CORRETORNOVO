import React from 'react';
import { SiteSettings } from '../types';

export interface SocialChannel {
  id: string;
  name: string;
  url: string;
  handle: string;
  icon: React.ReactNode;
  brandColor: string;
  brandHoverBg: string;
  brandBorder: string;
  brandText: string;
  description: string;
}

// Pixel-perfect official SVG icons for 100% brand fidelity
export const FacebookIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export const TwitterXIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const YouTubeIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const TikTokIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.76 1.18-.03 2.27-.68 2.82-1.72.33-.62.48-1.33.48-2.04V.02z" />
  </svg>
);

export const getSocialChannelsList = (settings?: Partial<SiteSettings>): SocialChannel[] => {
  return [
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@corretordanielpacheco',
      url: settings?.instagram || 'https://instagram.com/corretordanielpacheco',
      icon: <InstagramIcon className="w-4 h-4" />,
      brandColor: '#E1306C',
      brandHoverBg: 'hover:bg-[#E1306C]',
      brandBorder: 'border-[#E1306C]/40',
      brandText: 'text-[#E1306C]',
      description: 'Lançamentos em primeira mão, tours virtuais e bastidores'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      handle: '/corretordanielpacheco',
      url: settings?.facebook || 'https://www.facebook.com/corretordanielpacheco',
      icon: <FacebookIcon className="w-4 h-4" />,
      brandColor: '#1877F2',
      brandHoverBg: 'hover:bg-[#1877F2]',
      brandBorder: 'border-[#1877F2]/40',
      brandText: 'text-[#1877F2]',
      description: 'Publicações exclusivas de imóveis e novidades regionais'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      handle: '@danielpachecocorretor9626',
      url: settings?.youtube || 'https://youtube.com/@danielpachecocorretor9626',
      icon: <YouTubeIcon className="w-4 h-4" />,
      brandColor: '#FF0000',
      brandHoverBg: 'hover:bg-[#FF0000]',
      brandBorder: 'border-[#FF0000]/40',
      brandText: 'text-[#FF0000]',
      description: 'Vídeos completos, apresentações de decorados e análises'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      handle: '@danielpachecocorretor',
      url: settings?.tiktok || 'https://tiktok.com/@danielpachecocorretor',
      icon: <TikTokIcon className="w-4 h-4" />,
      brandColor: '#EE1D52',
      brandHoverBg: 'hover:bg-[#010101] hover:text-[#EE1D52]',
      brandBorder: 'border-[#EE1D52]/40',
      brandText: 'text-[#EE1D52]',
      description: 'Vídeos curtos, dicas rápidas e novidades do mercado'
    },
  ];
};

interface SocialMediaBarProps {
  settings?: Partial<SiteSettings>;
  variant?: 'footer' | 'header' | 'cards' | 'about' | 'contact';
  className?: string;
}

export const SocialMediaBar: React.FC<SocialMediaBarProps> = ({
  settings,
  variant = 'footer',
  className = '',
}) => {
  const channels = getSocialChannelsList(settings);

  if (variant === 'footer') {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {channels.map((channel) => (
          <a
            key={channel.id}
            id={`footer-social-${channel.id}`}
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-[#181818] border border-[#2A2A2A] text-gray-300 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-[#C9A227] hover:text-[#C9A227] hover:bg-[#222222] shadow-sm"
            title={`${channel.name} oficial: ${channel.handle}`}
            aria-label={`Acessar ${channel.name} de Daniel Pacheco`}
          >
            {channel.icon}
          </a>
        ))}
      </div>
    );
  }

  if (variant === 'about') {
    return (
      <div className={`flex flex-wrap items-center gap-2 pt-2 ${className}`}>
        <span className="text-xs font-semibold text-[#5A5A5A] mr-1">Redes Oficiais:</span>
        {channels.map((channel) => (
          <a
            key={channel.id}
            id={`about-social-${channel.id}`}
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7F3EB] hover:bg-[#E5E0D8] border border-[#E5E0D8] text-xs font-semibold text-[#111111] hover:text-[#C9A227] transition-all cursor-pointer shadow-xs"
            title={`${channel.name}: ${channel.handle}`}
            aria-label={`Acessar ${channel.name}`}
          >
            {channel.icon}
            <span className="text-[11px]">{channel.name}</span>
          </a>
        ))}
      </div>
    );
  }

  if (variant === 'contact' || variant === 'cards') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 ${className}`}>
        {channels.map((channel) => (
          <a
            key={channel.id}
            id={`contact-social-card-${channel.id}`}
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3.5 p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E0D8] hover:border-[#C9A227] hover:shadow-md transition-all cursor-pointer text-left"
            title={`Abrir perfil oficial no ${channel.name}`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#F7F3EB] group-hover:bg-[#C9A227]/15 border border-[#E5E0D8] group-hover:border-[#C9A227]/40 flex items-center justify-center text-[#111111] group-hover:text-[#C9A227] shrink-0 transition-colors">
              {channel.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111111] group-hover:text-[#C9A227] transition-colors">
                  {channel.name}
                </span>
                <span className="text-[10px] text-[#8A8A8A] font-mono group-hover:translate-x-0.5 transition-transform">
                  ↗
                </span>
              </div>
              <p className="text-[11px] text-[#5A5A5A] truncate font-medium mt-0.5">
                {channel.handle}
              </p>
            </div>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {channels.map((channel) => (
        <a
          key={channel.id}
          id={`social-${channel.id}`}
          href={channel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-[#181818] border border-[#2A2A2A] text-gray-300 hover:text-white hover:border-[#C9A227] transition-all"
          title={`${channel.name}: ${channel.handle}`}
          aria-label={channel.name}
        >
          {channel.icon}
        </a>
      ))}
    </div>
  );
};
