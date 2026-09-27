import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext.js';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { ThemeProvider, useTheme } from './context/ThemeContext.js';
import { SettingsProvider } from './context/SettingsContext.js';
import { Header } from './components/layout/Header.js';
import { Footer } from './components/layout/Footer.js';
import { FloatingContact } from './components/common/FloatingContact.js';
import { OfflineIndicator } from './components/common/OfflineIndicator.js';

// Pages
import { HomePage } from './pages/HomePage.js';
import { ServicesPage } from './pages/ServicesPage.js';
import { ServiceDetailPage } from './pages/ServiceDetailPage.js';
import { ProductsPage } from './pages/ProductsPage.js';
import { ProductDetailPage } from './pages/ProductDetailPage.js';
import { ProjectsPage } from './pages/ProjectsPage.js';
import { ProjectDetailPage } from './pages/ProjectDetailPage.js';
import { GalleryPage } from './pages/GalleryPage.js';
import { ReviewsPage } from './pages/ReviewsPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { RequestServicePage } from './pages/RequestServicePage.js';
import { RequestQuotePage } from './pages/RequestQuotePage.js';
import { RequestTechnicianPage } from './pages/RequestTechnicianPage.js';
import { PrivacyPolicyPage, TermsPage } from './pages/LegalPages.js';

// Admin
import { AdminLogin } from './pages/admin/AdminLogin.js';
import { AdminDashboard } from './pages/admin/AdminDashboard.js';

export const SECRET_ADMIN_ROUTE = 'alariqi-secure-panel-2026';

const getInitialRouteState = (): { route: string; param: string } => {
  if (typeof window === 'undefined') return { route: 'home', param: '' };

  const pathname = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  const hash = window.location.hash.replace(/^#\/?/, '');

  if (pathname === SECRET_ADMIN_ROUTE || hash === SECRET_ADMIN_ROUTE || pathname === 'admin') {
    return { route: SECRET_ADMIN_ROUTE, param: '' };
  }

  if (pathname.startsWith('service-detail/')) {
    return { route: 'service-detail', param: pathname.replace('service-detail/', '') };
  }
  if (pathname.startsWith('product-detail/')) {
    return { route: 'product-detail', param: pathname.replace('product-detail/', '') };
  }
  if (pathname.startsWith('project-detail/')) {
    return { route: 'project-detail', param: pathname.replace('project-detail/', '') };
  }

  const validRoutes = [
    'home',
    'services',
    'service-detail',
    'products',
    'product-detail',
    'projects',
    'project-detail',
    'gallery',
    'reviews',
    'about',
    'contact',
    'request-service',
    'request-quote',
    'request-technician',
    'privacy',
    'terms'
  ];

  if (validRoutes.includes(pathname)) {
    return { route: pathname, param: '' };
  }

  return { route: 'home', param: '' };
};

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { isLight } = useTheme();

  const [initial] = useState(() => getInitialRouteState());
  const [currentRoute, setCurrentRoute] = useState<string>(initial.route);
  const [routeParam, setRouteParam] = useState<string>(initial.param);

  // Initialize browser history and attach mobile back button popstate listener
  useEffect(() => {
    const initialPath =
      initial.route === 'home'
        ? '/'
        : initial.route === SECRET_ADMIN_ROUTE
        ? `/${SECRET_ADMIN_ROUTE}`
        : `/${initial.route}${initial.param ? `/${initial.param}` : ''}`;

    window.history.replaceState(
      { route: initial.route, param: initial.param },
      '',
      initialPath
    );

    const handlePopState = (e: PopStateEvent) => {
      // If modal was open, modal hooks handle closing themselves without leaving page
      if (e.state && e.state.isModalOpen) return;

      if (e.state && e.state.route) {
        setCurrentRoute(e.state.route);
        setRouteParam(e.state.param || '');
      } else {
        const { route, param } = getInitialRouteState();
        setCurrentRoute(route);
        setRouteParam(param);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string, param?: string) => {
    const targetRoute =
      route === 'admin' || route === 'admin-secret' || route === SECRET_ADMIN_ROUTE
        ? SECRET_ADMIN_ROUTE
        : route;

    const targetParam = param || '';
    setCurrentRoute(targetRoute);
    setRouteParam(targetParam);

    const targetUrl =
      targetRoute === 'home'
        ? '/'
        : targetRoute === SECRET_ADMIN_ROUTE
        ? `/${SECRET_ADMIN_ROUTE}`
        : `/${targetRoute}${targetParam ? `/${targetParam}` : ''}`;

    try {
      window.history.pushState(
        { route: targetRoute, param: targetParam },
        '',
        targetUrl
      );
    } catch (e) {
      console.warn('Could not push history state:', e);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If viewing Admin Dashboard or Login under the Secret Route
  if (currentRoute === SECRET_ADMIN_ROUTE || currentRoute === 'admin') {
    if (!user) {
      return (
        <AdminLogin
          onLoginSuccess={() => navigate(SECRET_ADMIN_ROUTE)}
          onCancel={() => navigate('home')}
        />
      );
    }
    return <AdminDashboard onExit={() => navigate('home')} />;
  }

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-[#C87D55]/30 selection:text-[#0B192C] ${
        isLight ? 'bg-[#F8FAFC] text-slate-950' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* 1. Header with direct phone 770931413, navigation, language switcher, and theme toggle */}
      <Header currentRoute={currentRoute} navigate={navigate} />

      {/* 2. Page Router */}
      <main className="flex-1">
        {currentRoute === 'home' && <HomePage navigate={navigate} />}
        {currentRoute === 'services' && <ServicesPage navigate={navigate} />}
        {currentRoute === 'service-detail' && (
          <ServiceDetailPage slug={routeParam} navigate={navigate} />
        )}
        {currentRoute === 'products' && <ProductsPage navigate={navigate} />}
        {currentRoute === 'product-detail' && (
          <ProductDetailPage slug={routeParam} navigate={navigate} />
        )}
        {currentRoute === 'projects' && <ProjectsPage navigate={navigate} />}
        {currentRoute === 'project-detail' && (
          <ProjectDetailPage slug={routeParam} navigate={navigate} />
        )}
        {currentRoute === 'gallery' && <GalleryPage />}
        {currentRoute === 'reviews' && <ReviewsPage />}
        {currentRoute === 'about' && <AboutPage navigate={navigate} />}
        {currentRoute === 'contact' && <ContactPage />}
        {currentRoute === 'request-service' && <RequestServicePage navigate={navigate} />}
        {currentRoute === 'request-quote' && <RequestQuotePage navigate={navigate} />}
        {currentRoute === 'request-technician' && (
          <RequestTechnicianPage navigate={navigate} />
        )}
        {currentRoute === 'privacy' && <PrivacyPolicyPage navigate={navigate} />}
        {currentRoute === 'terms' && <TermsPage navigate={navigate} />}
      </main>

      {/* 3. Comprehensive Footer with Developer integrity attribution */}
      <Footer navigate={navigate} />

      {/* 4. Floating Instant Call & WhatsApp Contact Buttons */}
      <FloatingContact navigate={navigate} />

      {/* 5. Offline Connectivity Indicator (for remote regions in Yemen) */}
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <SettingsProvider>
            <AppContent />
          </SettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
