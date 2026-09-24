import React, { useState } from 'react';
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

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { isLight } = useTheme();
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParam, setRouteParam] = useState<string>('');

  const navigate = (route: string, param?: string) => {
    setCurrentRoute(route);
    if (param) {
      setRouteParam(param);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If viewing Admin Dashboard
  if (currentRoute === 'admin') {
    if (!user) {
      return (
        <AdminLogin
          onLoginSuccess={() => navigate('admin')}
          onCancel={() => navigate('home')}
        />
      );
    }
    return <AdminDashboard onExit={() => navigate('home')} />;
  }

  // If explicitly navigating to admin login
  if (currentRoute === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={() => navigate('admin')}
        onCancel={() => navigate('home')}
      />
    );
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
