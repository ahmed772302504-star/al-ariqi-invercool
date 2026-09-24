import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { useSettings } from '../../context/SettingsContext.js';
import { ThemeToggle } from '../common/ThemeToggle.js';
import { PWAInstallButton } from '../common/PWAInstallButton.js';
import {
  Phone,
  MessageCircle,
  Menu,
  X,
  Globe,
  Lock,
  Wrench,
  FileText,
  UserCheck,
  Building2,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, navigate }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user } = useAuth();
  const { isLight } = useTheme();
  const { settings, logoIconUrl } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [requestsDropdownOpen, setRequestsDropdownOpen] = useState(false);

  const navLinks = [
    { route: 'home', labelAr: 'الرئيسية', labelEn: 'Home' },
    { route: 'services', labelAr: 'خدماتنا', labelEn: 'Services' },
    { route: 'products', labelAr: 'المنتجات', labelEn: 'Products' },
    { route: 'projects', labelAr: 'المشاريع', labelEn: 'Projects' },
    { route: 'gallery', labelAr: 'معرض الأعمال', labelEn: 'Gallery' },
    { route: 'reviews', labelAr: 'آراء العملاء', labelEn: 'Reviews' },
    { route: 'about', labelAr: 'من نحن', labelEn: 'About Us' },
    { route: 'contact', labelAr: 'تواصل معنا', labelEn: 'Contact' },
  ];

  const handleNav = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
    setRequestsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        isLight
          ? 'bg-white text-slate-900 shadow-md border-b-2 border-slate-300'
          : 'bg-[#0B192C] text-white shadow-xl border-b border-slate-800'
      }`}
    >
      {/* Top Bar for Phone, WhatsApp, Yemen Coverage, Theme Toggle & Language */}
      <div
        className={`text-xs py-2 border-b transition-colors ${
          isLight
            ? 'bg-slate-100 text-slate-800 border-slate-300'
            : 'bg-[#060E18] text-slate-300 border-slate-800/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-2">
          {/* Direct Phone & WhatsApp */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="tel:770931413"
              id="topbar-phone-link"
              className={`flex items-center gap-1.5 transition-colors ${
                isLight ? 'text-slate-900 hover:text-[#A85D35]' : 'hover:text-[#C87D55]'
              }`}
              title="اتصال مباشر"
            >
              <Phone className="w-3.5 h-3.5 text-[#C87D55]" />
              <span className="font-semibold tracking-wider dir-ltr">770931413</span>
            </a>

            <a
              href="https://wa.me/967770931413"
              target="_blank"
              rel="noopener noreferrer"
              id="topbar-whatsapp-link"
              className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors"
              title="محادثة واتساب مباشرة"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-semibold tracking-wider dir-ltr">770931413</span>
            </a>
          </div>

          {/* Yemen Coverage, Theme Switcher & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div
              className={`hidden md:flex items-center gap-1.5 text-[11px] ${
                isLight ? 'text-slate-700 font-medium' : 'text-slate-300'
              }`}
            >
              <span>🇾🇪</span>
              <span>{t('نخدمكم في جميع محافظات الجمهورية اليمنية', 'Serving All Yemen Governorates')}</span>
            </div>

            {/* Accessibility Theme Toggle (Top bar) */}
            <ThemeToggle variant="topbar" />

            {/* Language Switch */}
            <button
              onClick={toggleLanguage}
              id="header-lang-toggle"
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded font-medium border transition ${
                isLight
                  ? 'bg-white hover:bg-slate-200 text-[#0B192C] border-slate-300'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-[#C87D55] border-slate-700'
              }`}
              title={language === 'ar' ? 'Switch to English' : 'التحويل للغة العربية'}
            >
              <Globe className="w-3 h-3" />
              <span className="text-xs uppercase">{language === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            {/* In-App PWA Install Button for Offline Readiness */}
            <PWAInstallButton variant="navbar" className="hidden sm:inline-flex" />

            {/* Admin Dashboard shortcut - only visible to authenticated admin user */}
            {user && (
              <button
                onClick={() => handleNav('admin')}
                id="header-admin-btn"
                className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 bg-amber-950/40 px-2.5 py-0.5 rounded border border-amber-800"
              >
                <Lock className="w-3 h-3" />
                <span>{t('لوحة التحكم', 'Admin')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNav('home')}
            id="brand-header-link"
          >
            <div
              className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl border-2 border-[#C87D55] flex items-center justify-center p-1 shadow-xl group-hover:scale-105 transition-transform overflow-hidden ${
                isLight ? 'bg-slate-100' : 'bg-[#060E18]'
              }`}
            >
              <img
                key={`header-logo-${settings?.logoUpdatedAt || settings?.updatedAt || 'init'}`}
                src={logoIconUrl}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo-icon.svg';
                }}
                alt="AL-ARRIQI INVERCOOL Logo"
                className="w-full h-full object-contain filter drop-shadow transition-all duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`text-xl sm:text-2xl font-extrabold tracking-tight leading-tight ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}
              >
                {language === 'ar' ? 'العريقي إنفركول' : 'AL-ARRIQI INVERCOOL'}
              </span>
              <span
                className={`text-[10px] sm:text-xs font-semibold tracking-wide ${
                  isLight ? 'text-[#A85D35]' : 'text-[#C87D55]'
                }`}
              >
                {language === 'ar'
                  ? 'حلول متكاملة للتكييف والتبريد'
                  : 'Integrated Air Conditioning & Refrigeration Solutions'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item) => {
              const active = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  id={`nav-link-${item.route}`}
                  onClick={() => handleNav(item.route)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? 'bg-[#C87D55] text-white shadow-md'
                      : isLight
                      ? 'text-slate-800 hover:text-black hover:bg-slate-100'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {language === 'ar' ? item.labelAr : item.labelEn}
                </button>
              );
            })}

            {/* Quick Action Dropdown: Request Service / Quote / Technician */}
            <div className="relative">
              <button
                onClick={() => setRequestsDropdownOpen(!requestsDropdownOpen)}
                id="header-requests-dropdown-btn"
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold border transition ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                    : 'bg-[#1E3E62] text-white hover:bg-[#254d79] border-slate-700'
                }`}
              >
                <span>{t('الطلبات الهندسية', 'Quick Requests')}</span>
                <ChevronDown className="w-4 h-4 text-[#C87D55]" />
              </button>

              {requestsDropdownOpen && (
                <div
                  className={`absolute top-full mt-2 w-56 rounded-xl shadow-2xl py-2 z-50 border ${
                    isLight
                      ? 'bg-white text-slate-900 border-slate-300 shadow-xl'
                      : 'bg-[#0B192C] text-slate-200 border-slate-700'
                  }`}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                  <button
                    onClick={() => handleNav('request-service')}
                    id="dropdown-request-service"
                    className={`w-full text-start px-4 py-2.5 text-sm flex items-center gap-2.5 transition ${
                      isLight
                        ? 'text-slate-800 hover:bg-slate-100 hover:text-[#A85D35]'
                        : 'text-slate-200 hover:bg-[#1E3E62] hover:text-[#C87D55]'
                    }`}
                  >
                    <Wrench className="w-4 h-4 text-[#C87D55]" />
                    <span>{t('اطلب خدمة صيانة', 'Request Service')}</span>
                  </button>
                  <button
                    onClick={() => handleNav('request-quote')}
                    id="dropdown-request-quote"
                    className={`w-full text-start px-4 py-2.5 text-sm flex items-center gap-2.5 transition ${
                      isLight
                        ? 'text-slate-800 hover:bg-slate-100 hover:text-[#A85D35]'
                        : 'text-slate-200 hover:bg-[#1E3E62] hover:text-[#C87D55]'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-[#C87D55]" />
                    <span>{t('اطلب عرض سعر', 'Request Price Quote')}</span>
                  </button>
                  <button
                    onClick={() => handleNav('request-technician')}
                    id="dropdown-request-technician"
                    className={`w-full text-start px-4 py-2.5 text-sm flex items-center gap-2.5 transition ${
                      isLight
                        ? 'text-slate-800 hover:bg-slate-100 hover:text-[#A85D35]'
                        : 'text-slate-200 hover:bg-[#1E3E62] hover:text-[#C87D55]'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-[#C87D55]" />
                    <span>{t('اطلب فنيًا متخصصاً', 'Request Technician')}</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Header Action Button (Call to action & theme switch) */}
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle variant="button" className="hidden xl:inline-flex" />

            <button
              onClick={() => handleNav('request-service')}
              id="header-cta-request-service"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#C87D55] to-[#B86B3E] hover:from-[#d97742] hover:to-[#C87D55] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <Wrench className="w-4 h-4" />
              <span>{t('اطلب خدمة', 'Request Service')}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              className={`p-2 rounded-lg transition ${
                isLight
                  ? 'text-slate-800 hover:text-black hover:bg-slate-100'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden border-t px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200 ${
            isLight
              ? 'bg-white border-slate-300 text-slate-900 shadow-xl'
              : 'bg-[#0B192C] border-slate-800 text-slate-100'
          }`}
        >
          {/* Quick contact numbers */}
          <div className={`grid grid-cols-2 gap-2 pb-2 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <a
              href="tel:770931413"
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold ${
                isLight ? 'bg-slate-100 text-slate-900 border border-slate-300' : 'bg-slate-800 text-slate-200'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-[#C87D55]" />
              <span className="dir-ltr">770931413</span>
            </a>
            <a
              href="https://wa.me/967770931413"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border ${
                isLight
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Dedicated Theme Switcher in Mobile Drawer */}
          <div className={`pb-3 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <div className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center justify-between">
              <span>{t('مظهر الموقع وإمكانية القراءة:', 'Theme & Visibility:')}</span>
              <span className="text-[10px] text-[#C87D55] font-semibold">
                {isLight ? t('عالي التباين (نهاري)', 'High-Contrast Light') : t('كحلي احترافي (ليلي)', 'Navy Theme')}
              </span>
            </div>
            <ThemeToggle variant="segmented" />
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className={`text-start px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                  currentRoute === item.route
                    ? 'bg-[#C87D55] text-white shadow'
                    : isLight
                    ? 'text-slate-800 hover:text-black hover:bg-slate-100'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {language === 'ar' ? item.labelAr : item.labelEn}
              </button>
            ))}
          </div>

          {/* Quick Request Actions */}
          <div className={`pt-2 border-t space-y-2 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <PWAInstallButton variant="banner" className="w-full justify-center py-2.5 !text-sm" />

            <button
              onClick={() => handleNav('request-service')}
              className="w-full py-2.5 rounded-lg bg-[#C87D55] text-white font-bold text-sm flex items-center justify-center gap-2 shadow"
            >
              <Wrench className="w-4 h-4" />
              <span>{t('اطلب خدمة صيانة', 'Request Service')}</span>
            </button>
            <button
              onClick={() => handleNav('request-quote')}
              className={`w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                  : 'bg-[#1E3E62] text-white border-transparent'
              }`}
            >
              <FileText className="w-4 h-4 text-[#C87D55]" />
              <span>{t('اطلب عرض سعر', 'Request Price Quote')}</span>
            </button>
            <button
              onClick={() => handleNav('request-technician')}
              className={`w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border ${
                isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <UserCheck className="w-4 h-4 text-[#C87D55]" />
              <span>{t('اطلب فنيًا متخصصاً', 'Request Technician')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
