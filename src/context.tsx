import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  Service,
  Product,
  Project,
  GalleryItem,
  Review,
  MaintenanceRequest,
  QuoteRequest,
  TechnicianRequest,
  ContactMessage,
  SiteSettings,
  FAQItem,
  NotificationItem
} from './types';

interface AppContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (ar: string, en?: string) => string;
  settings: SiteSettings | null;
  services: Service[];
  products: Product[];
  projects: Project[];
  gallery: GalleryItem[];
  reviews: Review[];
  faq: FAQItem[];
  governates: string[];
  // Actions & Submissions
  submitMaintenance: (data: any) => Promise<{ success: boolean; requestNumber?: string; message?: string }>;
  submitQuote: (data: any) => Promise<{ success: boolean; requestNumber?: string; message?: string }>;
  submitTechnician: (data: any) => Promise<{ success: boolean; requestNumber?: string; message?: string }>;
  submitContact: (data: any) => Promise<{ success: boolean; message?: string }>;
  submitReview: (data: any) => Promise<{ success: boolean; message?: string }>;
  // Refresh data
  refreshData: () => Promise<void>;
  // Auth state
  adminToken: string | null;
  adminUser: { id: string; username: string; role: string } | null;
  loginAdmin: (token: string, user: { id: string; username: string; role: string }) => void;
  logoutAdmin: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('invercool_lang') as Language) || 'ar';
  });

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faq, setFaq] = useState<FAQItem[]>([]);
  const [governates, setGovernates] = useState<string[]>([]);

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('invercool_admin_token');
  });
  const [adminUser, setAdminUser] = useState<{ id: string; username: string; role: string } | null>(() => {
    const raw = localStorage.getItem('invercool_admin_user');
    return raw ? JSON.parse(raw) : null;
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('invercool_lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (ar: string, en?: string) => {
    if (lang === 'en') {
      return en && en.trim() ? en : ar;
    }
    return ar;
  };

  const refreshData = async () => {
    try {
      const [
        settingsRes,
        servicesRes,
        productsRes,
        projectsRes,
        galleryRes,
        reviewsRes,
        faqRes,
        govRes
      ] = await Promise.all([
        fetch('/api/settings').then((r) => r.json()).catch(() => null),
        fetch('/api/services').then((r) => r.json()).catch(() => []),
        fetch('/api/products').then((r) => r.json()).catch(() => []),
        fetch('/api/projects').then((r) => r.json()).catch(() => []),
        fetch('/api/gallery').then((r) => r.json()).catch(() => []),
        fetch('/api/reviews').then((r) => r.json()).catch(() => []),
        fetch('/api/faq').then((r) => r.json()).catch(() => []),
        fetch('/api/governates').then((r) => r.json()).catch(() => [])
      ]);

      if (settingsRes) setSettings(settingsRes);
      if (Array.isArray(servicesRes)) setServices(servicesRes);
      if (Array.isArray(productsRes)) setProducts(productsRes);
      if (Array.isArray(projectsRes)) setProjects(projectsRes);
      if (Array.isArray(galleryRes)) setGallery(galleryRes);
      if (Array.isArray(reviewsRes)) setReviews(reviewsRes);
      if (Array.isArray(faqRes)) setFaq(faqRes);
      if (Array.isArray(govRes)) setGovernates(govRes);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const loginAdmin = (token: string, user: { id: string; username: string; role: string }) => {
    setAdminToken(token);
    setAdminUser(user);
    localStorage.setItem('invercool_admin_token', token);
    localStorage.setItem('invercool_admin_user', JSON.stringify(user));
  };

  const logoutAdmin = () => {
    if (adminToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      }).catch(() => {});
    }
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('invercool_admin_token');
    localStorage.removeItem('invercool_admin_user');
  };

  const submitMaintenance = async (data: any) => {
    try {
      const res = await fetch('/api/requests/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      return json;
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const submitQuote = async (data: any) => {
    try {
      const res = await fetch('/api/requests/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      return json;
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const submitTechnician = async (data: any) => {
    try {
      const res = await fetch('/api/requests/technician', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      return json;
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const submitContact = async (data: any) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      return json;
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const submitReview = async (data: any) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      return json;
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        settings,
        services,
        products,
        projects,
        gallery,
        reviews,
        faq,
        governates,
        submitMaintenance,
        submitQuote,
        submitTechnician,
        submitContact,
        submitReview,
        refreshData,
        adminToken,
        adminUser,
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
