import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { SiteSettings } from '../types.js';
import { api } from '../services/api.js';
import { getCacheBustedUrl } from '../utils/cacheBuster.js';

interface SettingsContextType {
  settings: SiteSettings | null;
  logoUrl: string;
  logoIconUrl: string;
  watermarkUrl: string;
  getCacheBusted: (url?: string | null, fallback?: string) => string;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<{ success: boolean; settings: SiteSettings }>;
  refreshSettings: () => Promise<void>;
  isLoading: boolean;
}

const SETTINGS_STORAGE_KEY = 'invercool_site_settings';
const SETTINGS_CHANGE_EVENT = 'invercool_settings_updated';

// Fallback initial default settings
const DEFAULT_SETTINGS: SiteSettings = {
  companyNameAr: 'العريقي إنفركول للتكييف والتبريد',
  companyNameEn: 'AL-ARRIQI INVERCOOL HVAC & REFRIGERATION',
  brandNameAr: 'العريقي إنفركول',
  brandNameEn: 'AL-ARRIQI INVERCOOL',
  taglineAr: 'حلول متكاملة للتكييف والتبريد',
  taglineEn: 'Integrated Air Conditioning & Refrigeration Solutions',
  phone: '770931413',
  companyPhone: '770931413',
  phonePrimary: '770931413',
  phoneSecondary: '772302504',
  whatsapp: '770931413',
  whatsappPrimary: '770931413',
  facebookUrl: 'https://facebook.com',
  email: 'info@invercool-ye.com',
  addressAr: 'الجمهورية اليمنية - صنعاء - شارع الستين',
  addressEn: 'Sanaa, Yemen - Sixtieth St.',
  workHoursAr: 'السبت - الخميس: 8:00 صباحاً - 9:00 مساءً | طوارئ الصيانة: 24 ساعة',
  workHoursEn: 'Sat - Thu: 8:00 AM - 9:00 PM | Emergency HVAC: 24/7',
  developerName: 'م/ أحمد وليد العريقي',
  developerPhone1: '772302504',
  developerPhone2: '738603124',
  heroTitleAr: 'حلول التكييف والتبريد الذكية والموفرة للطاقة باليمن',
  heroTitleEn: 'Smart, Energy-Efficient HVAC & Cooling Solutions in Yemen',
  heroSubtitleAr: 'ريادة هندسية في أنظمة التكييف المركزي، غرف التبريد، والأنظمة الاقتصادية',
  heroSubtitleEn: 'Engineering Leadership in Central Air Conditioning & Cold Storage',
  heroDescAr: 'نقدم أحدث حلول التبريد والتكييف المبتكرة للقطاعات التجارية، الصناعية، والطبية والسكنية، بأعلى معايير الكفاءة وضمان معتمد.',
  heroDescEn: 'Delivering cutting-edge cooling and HVAC solutions for commercial, industrial, medical, and residential sectors with proven reliability.',
  aboutDescAr: 'العريقي إنفركول هي الشركة اليمنية الرائدة في تقديم الحلول الهندسية المتكاملة في أنظمة التكييف والتبريد.',
  aboutDescEn: 'AL-ARRIQI INVERCOOL is Yemen leading engineering firm in integrated HVAC and commercial refrigeration.',
  whyUs: [],
  governatesCovered: ['صنعاء', 'عدن', 'تعز', 'حضرموت', 'الحديدة', 'إب', 'مأرب', 'ذمار'],
  logoUrl: '/logo.png',
  logoIconUrl: '/logo-icon.png',
  watermarkUrl: '/logo.png',
  updatedAt: Date.now(),
  logoUpdatedAt: Date.now()
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Immediately initialize from LocalStorage to prevent flicker and enable instant rendering
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_SETTINGS, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Failed to parse settings from localStorage:', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 2. Refresh settings from backend database API and sync LocalStorage
  const refreshSettings = useCallback(async () => {
    try {
      const remote = await api.getSettings();
      if (remote && typeof remote === 'object') {
        const merged: SiteSettings = {
          ...DEFAULT_SETTINGS,
          ...remote,
          updatedAt: remote.updatedAt || Date.now(),
          logoUpdatedAt: remote.logoUpdatedAt || Date.now()
        };
        setSettings(merged);
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
      }
    } catch (err) {
      console.warn('Failed to fetch remote settings, using cached values:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3. Update settings: saves to DB API, updates LocalStorage, updates React state, and emits cross-component event
  const updateSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
    const now = Date.now();
    const logoChanged =
      newSettings.logoUrl !== undefined ||
      newSettings.logoIconUrl !== undefined ||
      newSettings.watermarkUrl !== undefined;

    const payload: Partial<SiteSettings> = {
      ...newSettings,
      updatedAt: now,
      ...(logoChanged ? { logoUpdatedAt: now } : {})
    };

    // Save to server database API
    const res = await api.updateSettings(payload);
    const updated = {
      ...DEFAULT_SETTINGS,
      ...(res.settings || payload),
      updatedAt: now,
      logoUpdatedAt: logoChanged ? now : (settings.logoUpdatedAt || now)
    };

    // Immediate state update (Triggers real-time re-render without page reload!)
    setSettings(updated);

    // Save to LocalStorage for instant persistence
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));

    // Dispatch custom event for any listening components or tabs
    window.dispatchEvent(new CustomEvent(SETTINGS_CHANGE_EVENT, { detail: updated }));

    return { success: true, settings: updated };
  }, [settings.logoUpdatedAt]);

  // Initial fetch on mount
  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  // 4. Synchronize across tabs or components via storage & custom events
  useEffect(() => {
    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<SiteSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SETTINGS_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed) {
            setSettings(parsed);
          }
        } catch (err) {
          console.warn('Failed to parse updated storage settings', err);
        }
      }
    };

    window.addEventListener(SETTINGS_CHANGE_EVENT, handleCustomChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(SETTINGS_CHANGE_EVENT, handleCustomChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 5. Cache-busted URLs with timestamp versioning for images
  const version = settings.logoUpdatedAt || settings.updatedAt || Date.now();

  const getCacheBusted = useCallback(
    (url?: string | null, fallback = '/logo-icon.png') => {
      return getCacheBustedUrl(url, version, fallback);
    },
    [version]
  );

  const logoUrl = useMemo(() => {
    return getCacheBustedUrl(settings.logoUrl || '/logo.png', version, '/logo.png');
  }, [settings.logoUrl, version]);

  const logoIconUrl = useMemo(() => {
    return getCacheBustedUrl(settings.logoIconUrl || '/logo-icon.png', version, '/logo-icon.png');
  }, [settings.logoIconUrl, version]);

  const watermarkUrl = useMemo(() => {
    const raw = settings.watermarkUrl || settings.logoUrl || '/logo.png';
    return getCacheBustedUrl(raw, version, '/logo.png');
  }, [settings.watermarkUrl, settings.logoUrl, version]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        logoUrl,
        logoIconUrl,
        watermarkUrl,
        getCacheBusted,
        updateSettings,
        refreshSettings,
        isLoading
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
