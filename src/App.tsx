import React, { useState, useEffect } from 'react';
import { Property, SiteSettings, LandingPage } from './types';
import { DEFAULT_SETTINGS } from './data/initialSettings';
import { INITIAL_PROPERTIES } from './data/initialProperties';
import { 
  initFirebaseData, 
  subscribeProperties, 
  subscribeSettings, 
  subscribeAdminState,
  subscribeLandingPages,
  getIsAdminCached,
  getLocalCachedProperties,
  loadIndexedDBCachedProperties,
  getLocalCachedSettings,
  getLocalCachedLandingPages,
  logoutAdmin
} from './firebase/firebaseService';
import { generateSmartLandingPage } from './utils/landingPageGenerator';

// Layout Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CuratedFormModal } from './components/CuratedFormModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { AIAssistantFloating } from './components/AIAssistantFloating';
import { CookieBanner } from './components/CookieBanner';
import { CinematicIntro } from './components/CinematicIntro';
import { AnimatePresence } from 'motion/react';

// Pages
import { HomePage } from './pages/HomePage';
import { PortfolioPage } from './pages/PortfolioPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { NaPlantaPage } from './pages/NaPlantaPage';
import { ImoveisProntosPage } from './pages/ImoveisProntosPage';
import { TerrenosPage } from './pages/TerrenosPage';
import { CidadesPage } from './pages/CidadesPage';
import { ComoEscolherPage } from './pages/ComoEscolherPage';
import { SobrePage } from './pages/SobrePage';
import { ContatoPage } from './pages/ContatoPage';
import { AdminPage } from './pages/AdminPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import { SiteMapPage } from './pages/SiteMapPage';
import { LandingPageView } from './pages/LandingPageView';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [properties, setProperties] = useState<Property[]>(() => getLocalCachedProperties());
  const [settings, setSettings] = useState<SiteSettings>(() => getLocalCachedSettings());
  const [landingPages, setLandingPages] = useState<LandingPage[]>(() => getLocalCachedLandingPages());
  const [activeLandingPage, setActiveLandingPage] = useState<LandingPage | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => getIsAdminCached());
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isCuratedModalOpen, setIsCuratedModalOpen] = useState<boolean>(false);

  // Keep selectedProperty live and up-to-date when properties state changes
  useEffect(() => {
    if (selectedProperty) {
      const refreshed = properties.find((p) => p.id === selectedProperty.id || p.code === selectedProperty.code);
      if (refreshed && refreshed !== selectedProperty) {
        setSelectedProperty(refreshed);
      }
    }
  }, [properties, selectedProperty]);

  // Initialize and subscribe to Firestore
  useEffect(() => {
    initFirebaseData();

    // Carregamento instantâneo do IndexedDB de alta capacidade (fotos e galerias completas)
    loadIndexedDBCachedProperties().then((cached) => {
      if (cached && cached.length > 0) {
        setProperties(cached);
      }
    }).catch(() => {});

    const unsubProps = subscribeProperties((data) => {
      if (Array.isArray(data)) {
        setProperties(data);
      }
    });

    const unsubSettings = subscribeSettings((data) => {
      if (data) {
        setSettings(data);
      }
    });

    const unsubAdmin = subscribeAdminState((loggedIn) => {
      setIsAdmin(loggedIn);
    });

    const unsubLandingPages = subscribeLandingPages((list) => {
      if (Array.isArray(list)) {
        setLandingPages(list);
      }
    });

    const handleCustomAuth = (e: Event) => {
      const customEvent = e as CustomEvent<{ isAdmin: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.isAdmin === 'boolean') {
        setIsAdmin(customEvent.detail.isAdmin);
      } else {
        setIsAdmin(getIsAdminCached());
      }
    };

    const handleReplayIntro = () => {
      setShowIntro(true);
    };

    window.addEventListener('dp_admin_auth_changed', handleCustomAuth);
    window.addEventListener('dp_replay_intro', handleReplayIntro);

    return () => {
      unsubProps();
      unsubSettings();
      unsubAdmin();
      unsubLandingPages();
      window.removeEventListener('dp_admin_auth_changed', handleCustomAuth);
      window.removeEventListener('dp_replay_intro', handleReplayIntro);
    };
  }, []);

  // Handle URL navigation (both pathname e.g. /lp-dp-101 and hash e.g. #lp-dp-101)
  useEffect(() => {
    const handleUrlRoute = () => {
      // 1. Check pathname (e.g. /reserva-da-mata or /lp-dp-101)
      const pathname = window.location.pathname.replace(/^\/+/, '').split('?')[0];
      // 2. Check hash (e.g. #reserva-da-mata or #lp-dp-101)
      const rawHash = window.location.hash.replace(/^#\/?/, '').split('?')[0];

      const target = (rawHash || pathname).trim();
      if (!target) return;

      const RESERVED_ROUTES = [
        'home', 'portfolio', 'na-planta', 'prontos', 'terrenos', 'loteamentos', 
        'cidades', 'como-escolher', 'sobre', 'contato', 'admin', 
        'privacy', 'privacidade', 'politica-de-privacidade', 
        'termos', 'termos-de-uso', 
        'cookie-policy', 'cookies', 'politica-de-cookies',
        'sitemap', 'mapa-do-site'
      ];

      // Check if target is a Property Detail route (e.g. imovel-dp-101)
      if (target.startsWith('imovel-')) {
        const code = target.replace('imovel-', '');
        const found = properties.find((p) => p.code?.toLowerCase() === code.toLowerCase() || p.id?.toLowerCase() === code.toLowerCase());
        if (found) {
          setSelectedProperty(found);
          setCurrentRoute('property-detail');
          return;
        }
      }

      // Check standard reserved routes
      if (RESERVED_ROUTES.includes(target.toLowerCase())) {
        setCurrentRoute(target.toLowerCase());
        return;
      }

      // Check if it's a Landing Page URL created from domain (e.g. /reserva-da-mata, /lp-dp-101, /nomedapagina)
      const cleanSlug = target.replace(/^lp\//, '').replace(/^landing\//, '');
      
      // Find in saved landing pages by slug or id
      let foundLP = landingPages.find((lp) => 
        lp.slug?.toLowerCase() === target.toLowerCase() ||
        lp.slug?.toLowerCase() === cleanSlug.toLowerCase() ||
        lp.id?.toLowerCase() === target.toLowerCase() ||
        `lp-${lp.propertyCode?.toLowerCase()}` === cleanSlug.toLowerCase()
      );

      // If not saved yet, but slug matches a property code, generate dynamic landing page on the fly
      if (!foundLP) {
        const matchedProp = properties.find((p) => 
          cleanSlug.toLowerCase().includes(p.code.toLowerCase()) ||
          cleanSlug.toLowerCase().includes(p.id.toLowerCase())
        );
        if (matchedProp) {
          foundLP = generateSmartLandingPage(matchedProp, 'investidor', 'luxury-dark');
        }
      }

      if (foundLP) {
        setActiveLandingPage(foundLP);
        setCurrentRoute('landing-page');
        return;
      }
    };

    handleUrlRoute();
    window.addEventListener('hashchange', handleUrlRoute);
    window.addEventListener('popstate', handleUrlRoute);
    return () => {
      window.removeEventListener('hashchange', handleUrlRoute);
      window.removeEventListener('popstate', handleUrlRoute);
    };
  }, [properties, landingPages]);

  // Navigate helper
  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = route;
  };

  // Property detail select helper
  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setCurrentRoute('property-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = `imovel-${property.code}`;
  };

  // Dedicated Landing Page Standalone Render (No distracting navigation, maximum conversion)
  if (currentRoute === 'landing-page' && activeLandingPage) {
    const linkedProperty = properties.find(
      (p) => p.id === activeLandingPage.propertyId || p.code === activeLandingPage.propertyCode
    ) || properties[0];

    return (
      <LandingPageView
        landingPage={activeLandingPage}
        property={linkedProperty}
        settings={settings}
        onNavigateHome={() => navigate('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EB] text-[#111111] flex flex-col font-sans selection:bg-[#C9A227]/30 selection:text-[#111111]">
      {/* Header */}
      <Header
        settings={settings}
        currentRoute={currentRoute}
        navigate={navigate}
        onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomePage
            properties={properties}
            settings={settings}
            navigate={navigate}
            onSelectProperty={handleSelectProperty}
            onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
          />
        )}

        {currentRoute === 'portfolio' && (
          <PortfolioPage
            properties={properties}
            settings={settings}
            onSelectProperty={handleSelectProperty}
            onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
          />
        )}

        {currentRoute === 'na-planta' && (
          <NaPlantaPage
            properties={properties}
            settings={settings}
            onSelectProperty={handleSelectProperty}
            onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
          />
        )}

        {currentRoute === 'prontos' && (
          <ImoveisProntosPage
            properties={properties}
            settings={settings}
            onSelectProperty={handleSelectProperty}
            onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
          />
        )}

        {(currentRoute === 'terrenos' || currentRoute === 'loteamentos') && (
          <TerrenosPage
            properties={properties}
            settings={settings}
            onSelectProperty={handleSelectProperty}
            onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
          />
        )}

        {currentRoute === 'cidades' && (
          <CidadesPage
            properties={properties}
            settings={settings}
            onSelectProperty={handleSelectProperty}
            onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
          />
        )}

        {currentRoute === 'como-escolher' && (
          <ComoEscolherPage
            settings={settings}
            onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
          />
        )}

        {currentRoute === 'sobre' && (
          <SobrePage
            settings={settings}
            navigate={navigate}
            onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
          />
        )}

        {currentRoute === 'contato' && (
          <ContatoPage settings={settings} />
        )}

        {currentRoute === 'property-detail' && selectedProperty && (
          <PropertyDetailPage
            property={selectedProperty}
            allProperties={properties}
            settings={settings}
            onBack={() => navigate('portfolio')}
            onSelectProperty={handleSelectProperty}
            onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
          />
        )}

        {currentRoute === 'admin' && (
          <AdminPage
            properties={properties}
            settings={settings}
            isAdmin={isAdmin}
            onSelectProperty={handleSelectProperty}
          />
        )}

        {(currentRoute === 'privacy' || currentRoute === 'privacidade' || currentRoute === 'politica-de-privacidade') && (
          <PrivacyPolicyPage
            settings={settings}
            onBack={() => navigate('home')}
            navigate={navigate}
          />
        )}

        {(currentRoute === 'termos' || currentRoute === 'termos-de-uso') && (
          <TermsPage
            settings={settings}
            onBack={() => navigate('home')}
            navigate={navigate}
          />
        )}

        {(currentRoute === 'cookie-policy' || currentRoute === 'cookies' || currentRoute === 'politica-de-cookies') && (
          <CookiePolicyPage
            settings={settings}
            onBack={() => navigate('home')}
            navigate={navigate}
          />
        )}

        {(currentRoute === 'sitemap' || currentRoute === 'mapa-do-site') && (
          <SiteMapPage
            properties={properties}
            settings={settings}
            navigate={navigate}
            onSelectProperty={handleSelectProperty}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        navigate={navigate}
        isAdmin={isAdmin}
        onLogoutAdmin={logoutAdmin}
        onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
      />

      {/* Curated Lead Form Modal */}
      <CuratedFormModal
        isOpen={isCuratedModalOpen}
        onClose={() => setIsCuratedModalOpen(false)}
        settings={settings}
        properties={properties}
      />

      {/* Floating WhatsApp Contact Button (Right side) */}
      <WhatsAppFloatingButton settings={settings} onOpenCuratedModal={() => setIsCuratedModalOpen(true)} />

      {/* Floating AI Assistant (Left side, discreet button without bubble) */}
      <AIAssistantFloating
        settings={settings}
        properties={properties}
        onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
      />

      {/* LGPD Cookie Consent Banner */}
      <CookieBanner />

      {/* 3-Second Luxury Cinematic Intro */}
      <AnimatePresence>
        {showIntro && (
          <CinematicIntro
            onComplete={() => setShowIntro(false)}
            realtorName={settings.realtorName}
            creci={settings.creci}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
