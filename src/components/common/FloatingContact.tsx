import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { ThemeToggle } from './ThemeToggle.js';
import {
  Phone,
  MessageCircle,
  Wrench,
  FileText,
  AlertTriangle,
  ShieldCheck,
  Send,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MapPin,
  User,
  Clock,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

// Export all utility types and functions directly so they can be consumed from FloatingContact
export {
  generateWhatsAppMessage,
  generateWhatsAppUrl,
  formatWhatsAppPhone,
  getWhatsAppPreset,
  WHATSAPP_PRESETS,
  INVERCOOL_PRIMARY_PHONE,
  INVERCOOL_FORMATTED_PHONE,
} from '../../utils/whatsappTemplates.js';

export type {
  WhatsAppServiceType,
  WhatsAppTemplateOptions,
  WhatsAppPreset,
  RequestUrgency,
} from '../../utils/whatsappTemplates.js';

import {
  generateWhatsAppMessage,
  generateWhatsAppUrl,
  WHATSAPP_PRESETS,
  WhatsAppServiceType,
  RequestUrgency,
  INVERCOOL_FORMATTED_PHONE,
} from '../../utils/whatsappTemplates.js';

interface FloatingContactProps {
  navigate: (route: string) => void;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({ navigate }) => {
  const { t, language } = useLanguage();
  const { isLight } = useTheme();

  // Menu state
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<WhatsAppServiceType>('quote');
  const [msgLang, setMsgLang] = useState<'ar' | 'en'>(language === 'en' ? 'en' : 'ar');
  const [showCustomizer, setShowCustomizer] = useState<boolean>(false);

  // Dynamic customization fields
  const [customerName, setCustomerName] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [urgency, setUrgency] = useState<RequestUrgency>('urgent');

  const menuRef = useRef<HTMLDivElement>(null);

  // Sync default template language when site language changes
  useEffect(() => {
    setMsgLang(language === 'en' ? 'en' : 'ar');
  }, [language]);

  // Close menu on outside click or Esc
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  // Current dynamic message preview and WhatsApp URL
  const currentOptions = {
    type: selectedType,
    lang: msgLang,
    customerName: customerName.trim() || undefined,
    city: city.trim() || undefined,
    details: details.trim() || undefined,
    urgency,
  };

  const previewMessage = generateWhatsAppMessage(currentOptions, msgLang);
  const activeWhatsAppUrl = generateWhatsAppUrl(currentOptions, undefined, msgLang);

  const handleLaunchWhatsApp = (type?: WhatsAppServiceType) => {
    const targetType = type || selectedType;
    const url = generateWhatsAppUrl(
      {
        ...currentOptions,
        type: targetType,
      },
      undefined,
      msgLang
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Helper to render icon for preset
  const renderPresetIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'file-text':
        return <FileText className={className} />;
      case 'wrench':
        return <Wrench className={className} />;
      case 'alert-triangle':
        return <AlertTriangle className={className} />;
      case 'shield-check':
        return <ShieldCheck className={className} />;
      case 'message-square':
      default:
        return <MessageSquare className={className} />;
    }
  };

  return (
    <>
      {/* ============================================================ */}
      {/* Centered WhatsApp Modal with Backdrop Blur Overlay           */}
      {/* ============================================================ */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMenuOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label={t('قوالب واتساب الذكية', 'Smart WhatsApp Templates')}
        >
          <div
            className={`w-full max-w-lg max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border transition-all duration-300 overflow-hidden animate-in zoom-in-95 ${
              isLight
                ? 'bg-white border-slate-300 text-slate-900 shadow-slate-400/30'
                : 'bg-[#0B192C] border-slate-700/80 text-white shadow-black/80'
            }`}
            dir={msgLang === 'ar' ? 'rtl' : 'ltr'}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popover Header */}
            <div
              className={`p-4 flex items-center justify-between border-b shrink-0 ${
                isLight
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-gradient-to-r from-[#060E18] to-[#1E3E62] border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                  <MessageCircle className="w-5 h-5 fill-emerald-500 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                    <span>{t('قوالب واتساب الذكية', 'Smart WhatsApp Templates')}</span>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </h3>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {t(`متاح للرد الفوري: ${INVERCOOL_FORMATTED_PHONE}`, `Direct: ${INVERCOOL_FORMATTED_PHONE}`)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Language Switch for Message */}
                <button
                  type="button"
                  onClick={() => setMsgLang(msgLang === 'ar' ? 'en' : 'ar')}
                  className={`text-[11px] font-bold px-2 py-1 rounded-md border transition-colors ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Switch message language"
                >
                  {msgLang === 'ar' ? 'English' : 'عربي'}
                </button>

                {/* Close Popover */}
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className={`p-1 rounded-lg text-slate-400 hover:text-slate-200 transition-colors ${
                    isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-slate-800'
                  }`}
                  aria-label="Close templates"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Templates List */}
            <div className="p-3 max-h-[300px] overflow-y-auto space-y-1.5 custom-scrollbar">
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 px-1 mb-1">
                {t('اختر نوع الطلب لإنشاء الرسالة فورياً:', 'Select request type for pre-filled template:')}
              </div>

              {WHATSAPP_PRESETS.map((preset) => {
                const isSelected = selectedType === preset.id;
                const title = msgLang === 'ar' ? preset.titleAr : preset.titleEn;
                const desc = msgLang === 'ar' ? preset.descAr : preset.descEn;
                const badge = msgLang === 'ar' ? preset.badgeAr : preset.badgeEn;

                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setSelectedType(preset.id);
                    }}
                    className={`group w-full text-start p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                      isSelected
                        ? isLight
                          ? 'bg-emerald-50 border-emerald-400 shadow-sm'
                          : 'bg-emerald-950/40 border-emerald-500/60 shadow-inner'
                        : isLight
                        ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                        : 'bg-[#1E3E62]/30 hover:bg-[#1E3E62]/60 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-emerald-500 text-white'
                            : isLight
                            ? 'bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-700'
                            : 'bg-slate-800 text-slate-300 group-hover:bg-emerald-900 group-hover:text-emerald-300'
                        }`}
                      >
                        {renderPresetIcon(preset.iconName)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-bold truncate ${
                              isSelected
                                ? isLight
                                  ? 'text-emerald-900'
                                  : 'text-emerald-300'
                                : ''
                            }`}
                          >
                            {title}
                          </span>
                          {badge && (
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-semibold whitespace-nowrap ${
                                preset.id === 'emergency'
                                  ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                                  : preset.id === 'quote'
                                  ? 'bg-[#C87D55]/20 text-[#A85D35] dark:text-[#C87D55]'
                                  : isLight
                                  ? 'bg-slate-200 text-slate-700'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                          {desc}
                        </p>
                      </div>
                    </div>

                    {/* Quick Launch Button for this template */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLaunchWhatsApp(preset.id);
                      }}
                      title={t('إرسال هذا القالب فوراً', 'Send this template now')}
                      className={`p-1.5 rounded-lg shrink-0 transition-transform hover:scale-110 ${
                        isSelected
                          ? 'bg-emerald-500 text-white shadow-md'
                          : isLight
                          ? 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                          : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Optional Quick Customizer Drawer */}
            <div className={`px-3 py-2 border-t ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800/80 bg-slate-900/50'}`}>
              <button
                type="button"
                onClick={() => setShowCustomizer(!showCustomizer)}
                className={`w-full flex items-center justify-between text-xs font-semibold py-1 px-1.5 rounded-lg transition-colors ${
                  isLight ? 'text-slate-700 hover:bg-slate-200' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C87D55]" />
                  <span>
                    {showCustomizer
                      ? t('إخفاء تخصيص الحقول', 'Hide field customization')
                      : t('تخصيص البيانات (الاسم، المدينة، التفاصيل)', 'Customize details (Name, City, Issue)')}
                  </span>
                </span>
                {showCustomizer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showCustomizer && (
                <div className="pt-2 space-y-2 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-600 dark:text-slate-300 flex items-center gap-1 mb-0.5">
                        <User className="w-3 h-3 text-[#C87D55]" />
                        <span>{t('الاسم / المنشأة', 'Name / Org')}</span>
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder={t('مثال: م. أحمد', 'e.g. Eng. Ahmed')}
                        className={`w-full text-xs px-2 py-1 rounded-md border outline-none ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                            : 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-600 dark:text-slate-300 flex items-center gap-1 mb-0.5">
                        <MapPin className="w-3 h-3 text-[#C87D55]" />
                        <span>{t('المدينة / الموقع', 'City / Location')}</span>
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder={t('صنعاء، عدن، تعز...', 'Sanaa, Aden...')}
                        className={`w-full text-xs px-2 py-1 rounded-md border outline-none ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                            : 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-600 dark:text-slate-300 flex items-center gap-1 mb-0.5">
                      <Clock className="w-3 h-3 text-[#C87D55]" />
                      <span>{t('تفاصيل إضافية أو وصف العطل', 'Additional Details / Issue')}</span>
                    </label>
                    <input
                      type="text"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder={t('مثال: فحص تسريب فريون في غرفة التجميد', 'e.g. Refrigerant leak in freezer')}
                      className={`w-full text-xs px-2 py-1 rounded-md border outline-none ${
                        isLight
                          ? 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                          : 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500'
                      }`}
                    />
                  </div>

                  {selectedType === 'technician' && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-slate-600 dark:text-slate-300">{t('الأولوية:', 'Urgency:')}</span>
                      {(['normal', 'urgent', 'emergency'] as RequestUrgency[]).map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setUrgency(u)}
                          className={`text-[10px] px-2 py-0.5 rounded font-bold transition-colors ${
                            urgency === u
                              ? u === 'emergency'
                                ? 'bg-rose-500 text-white'
                                : u === 'urgent'
                                ? 'bg-amber-500 text-white'
                                : 'bg-emerald-500 text-white'
                              : isLight
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {u === 'emergency' ? t('طارئ', 'Critical') : u === 'urgent' ? t('عاجل', 'Urgent') : t('عادي', 'Normal')}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Template Message Preview & Action Footer */}
            <div className={`p-3 border-t ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#060E18] border-slate-800'}`}>
              <div className="mb-2">
                <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300 mb-1">
                  <span>{t('معاينة الرسالة الجاهزة:', 'Message Preview:')}</span>
                  <span className="font-mono text-emerald-500 font-bold">{INVERCOOL_FORMATTED_PHONE}</span>
                </div>
                <div
                  className={`text-[11px] p-2 rounded-lg max-h-20 overflow-y-auto font-mono whitespace-pre-wrap leading-relaxed select-all border ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-700'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  {previewMessage}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Main Launch Button */}
                <a
                  href={activeWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="floating-whatsapp-launch-btn"
                  className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{t('فتح الرسالة في واتساب', 'Open Template in WhatsApp')}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                {/* Direct quick links to web forms */}
                {selectedType === 'quote' && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('request-quote');
                    }}
                    title={t('أو تعبئة نموذج عرض السعر', 'Or fill quote form')}
                    className="p-2.5 rounded-xl border border-[#C87D55]/50 bg-[#C87D55]/10 text-[#C87D55] hover:bg-[#C87D55] hover:text-white transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                )}

                {selectedType === 'technician' && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('request-technician');
                    }}
                    title={t('أو حجز فني عبر الموقع', 'Or book technician via form')}
                    className="p-2.5 rounded-xl border border-[#C87D55]/50 bg-[#C87D55]/10 text-[#C87D55] hover:bg-[#C87D55] hover:text-white transition-colors"
                  >
                    <Wrench className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* Floating Action Buttons                                      */}
      {/* ============================================================ */}
      <div
        ref={menuRef}
        className="fixed bottom-24 sm:bottom-8 end-4 sm:end-8 z-40 flex flex-col items-end gap-3"
      >
        {/* Quick Accessibility Theme Toggle */}
        <ThemeToggle variant="floating" />

        {/* Primary Floating WhatsApp Trigger Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          id="floating-whatsapp-btn"
          aria-label={t('قوالب وتواصل واتساب', 'WhatsApp Templates & Chat')}
          className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
        >
          {isMenuOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <>
              <MessageCircle className="w-7 h-7 fill-white" />
              {/* Notification Pulse Indicator */}
              <span className="absolute -top-1 -end-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400 text-[9px] font-black text-slate-900 items-center justify-center">
                  💬
                </span>
              </span>
            </>
          )}

          {/* Hover Tooltip on Desktop */}
          {!isMenuOpen && (
            <span className="absolute end-full me-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
              <span>{t('قوالب واتساب: عرض سعر وحجز فني', 'WhatsApp Templates: Quote & Tech')}</span>
              <span className="text-emerald-400 font-mono text-[11px]">{INVERCOOL_FORMATTED_PHONE}</span>
            </span>
          )}
        </button>

        {/* Direct Phone Call Button */}
        <a
          href="tel:770931413"
          id="floating-phone-btn"
          aria-label="Call Company"
          className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 bg-[#C87D55] hover:bg-[#B86B3E] text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
        >
          <Phone className="w-6 h-6 fill-white" />
          <span className="absolute end-full me-3 px-3 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
            {t(`اتصال مباشر: ${INVERCOOL_FORMATTED_PHONE}`, `Direct Call: ${INVERCOOL_FORMATTED_PHONE}`)}
          </span>
        </a>
      </div>

      {/* ============================================================ */}
      {/* 2. Mobile Bottom Quick Action Bar (Smartphones only)          */}
      {/* ============================================================ */}
      <div
        className={`sm:hidden fixed bottom-0 inset-x-0 z-40 px-3 py-2 flex items-center justify-around shadow-2xl transition-colors duration-200 ${
          isLight
            ? 'bg-white border-t-2 border-slate-300 text-slate-900'
            : 'bg-[#0B192C] border-t border-slate-800 text-slate-200'
        }`}
      >
        {/* Direct Phone Call */}
        <a
          href="tel:770931413"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            isLight ? 'text-slate-900 hover:text-[#A85D35]' : 'text-slate-200 hover:text-[#C87D55]'
          }`}
        >
          <Phone className="w-5 h-5 text-[#C87D55]" />
          <span className="text-[11px] font-bold mt-0.5">{t('اتصال', 'Call')}</span>
        </a>

        {/* WhatsApp Button opens Template Launcher on mobile */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            isMenuOpen
              ? 'text-emerald-500 font-black'
              : isLight
              ? 'text-emerald-700 hover:text-emerald-800'
              : 'text-slate-200 hover:text-emerald-400'
          }`}
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
            <span className="absolute -top-1 -end-1 w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <span className="text-[11px] font-bold mt-0.5">WhatsApp</span>
        </button>

        {/* Service Booking Navigation */}
        <button
          onClick={() => {
            navigate('request-service');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex-1 flex flex-col items-center justify-center py-1 text-white bg-[#C87D55] hover:bg-[#B86B3E] rounded-lg shadow font-bold"
        >
          <Wrench className="w-5 h-5" />
          <span className="text-[11px] font-bold mt-0.5">{t('طلب صيانة', 'Service')}</span>
        </button>
      </div>
    </>
  );
};
