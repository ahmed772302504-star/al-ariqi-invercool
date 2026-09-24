import React, { useState } from 'react';
import { useApp } from '../context';
import {
  Phone,
  MessageCircle,
  Menu,
  X,
  Globe,
  Wrench,
  ShieldCheck,
  ShoppingBag,
  Briefcase,
  Image as ImageIcon,
  UserCheck,
  Calculator,
  Lock,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openQuoteModal: () => void;
  openTechModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  openQuoteModal,
  openTechModal
}) => {
  const { lang, setLang, t, settings } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home' },
    { id: 'services', labelAr: 'خدماتنا', labelEn: 'Services' },
    { id: 'products', labelAr: 'الأجهزة والمعرض', labelEn: 'Products & Store' },
    { id: 'projects', labelAr: 'مشاريعنا', labelEn: 'Projects' },
    { id: 'gallery', labelAr: 'معرض الأعمال', labelEn: 'Gallery' },
    { id: 'calculator', labelAr: 'حاسبة التكييف', labelEn: 'AC Sizing Calculator' },
    { id: 'maintenance', labelAr: 'طلب صيانة', labelEn: 'Maintenance' },
    { id: 'contact', labelAr: 'اتصل بنا', labelEn: 'Contact' },
  ];

  const toggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const phonePrimary = settings?.phonePrimary || '770931413';
  const whatsappPrimary = settings?.whatsappPrimary || '770931413';

  return (
    <header className="sticky top-0 z-40 bg-[#0B192C] text-white shadow-xl border-b border-white/10 backdrop-blur-md">
      {/* Top Banner Bar */}
      <div className="bg-[#060E18] text-xs text-slate-300 py-1.5 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {t('خدمة الطوارئ والصيانة الفورية 24/7 في كافة المحافظات', 'Emergency & Instant HVAC Service 24/7 in All Yemen')}
            </span>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <span className="hidden md:inline-block text-slate-400">
              {t('إشراف هندسي يمني معتمد وأعلى معايير الجودة', 'Certified Yemeni Engineering & Highest Quality Standards')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${phonePrimary}`}
              className="flex items-center gap-1 hover:text-[#C87D55] transition-colors"
              id="header-top-call"
            >
              <Phone className="w-3.5 h-3.5 text-[#C87D55]" />
              <span dir="ltr">{phonePrimary}</span>
            </a>
            <a
              href={`https://wa.me/967${whatsappPrimary.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
              id="header-top-whatsapp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('واتساب مباشر', 'Direct WhatsApp')}</span>
            </a>
            <button
              onClick={() => setCurrentTab('admin')}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] bg-white/5 px-2 py-0.5 rounded border border-white/10 hover:border-[#C87D55]/50 transition-all"
              id="header-admin-login-btn"
            >
              <Lock className="w-3 h-3 text-[#C87D55]" />
              <span>{t('لوحة الإدارة', 'Admin')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => setCurrentTab('home')}
            id="brand-logo-btn"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E3E62] to-[#0B192C] border-2 border-[#C87D55] flex items-center justify-center shadow-lg shadow-[#C87D55]/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-2xl font-black text-white tracking-tighter">IC</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg md:text-xl font-black tracking-wide bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  {lang === 'ar' ? 'العريقي إنفركول' : 'AL-ARRIQI INVERCOOL'}
                </span>
                <span className="text-[10px] bg-[#C87D55] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  HVAC
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-tight">
                {t('حلول متكاملة للتكييف والتبريد وأنظمة الطاقة', 'Integrated HVAC & Energy Cooling Solutions')}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setCurrentTab(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-[#C87D55] text-white shadow-md shadow-[#C87D55]/25'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {lang === 'ar' ? item.labelAr : item.labelEn}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs & Language Switch */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg border border-white/10 flex items-center gap-1.5 text-xs font-bold transition-colors"
              id="lang-toggle-btn"
              title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <Globe className="w-4 h-4 text-[#C87D55]" />
              <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            <button
              onClick={openTechModal}
              id="header-request-tech-btn"
              className="px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600/50 shadow-sm flex items-center gap-1.5 transition-all"
            >
              <UserCheck className="w-4 h-4 text-[#C87D55]" />
              <span>{t('طلب فني سريع', 'Request Tech')}</span>
            </button>

            <button
              onClick={openQuoteModal}
              id="header-request-quote-btn"
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#C87D55] to-[#A85D35] hover:brightness-110 shadow-lg shadow-[#C87D55]/30 flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('طلب عرض سعر', 'Get a Quote')}</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleLang}
              className="p-2 text-slate-300 hover:text-white bg-white/5 rounded-lg text-xs font-bold border border-white/10"
              id="mobile-lang-toggle"
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-300 hover:text-white bg-white/5 border border-white/10"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#060E18] border-b border-white/10 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navItems.map((item) => {
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-right ${lang === 'en' ? 'text-left' : ''} px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-[#C87D55] text-white'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {lang === 'ar' ? item.labelAr : item.labelEn}
              </button>
            );
          })}

          <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                openTechModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-lg text-xs font-bold text-center bg-slate-800 text-white border border-slate-700"
            >
              {t('طلب فني سريع', 'Request Tech')}
            </button>
            <button
              onClick={() => {
                openQuoteModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-lg text-xs font-bold text-center bg-[#C87D55] text-white"
            >
              {t('طلب عرض سعر', 'Get a Quote')}
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setCurrentTab('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 text-center text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1"
            >
              <Lock className="w-3.5 h-3.5 text-[#C87D55]" />
              <span>{t('الدخول للوحة التحكم والإدارة', 'Admin Portal')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
