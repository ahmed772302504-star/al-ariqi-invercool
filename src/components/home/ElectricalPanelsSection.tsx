import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { useSettings } from '../../context/SettingsContext.js';
import { electricalPanelsData } from '../../data/electricalPanelsData.js';
import {
  ShieldCheck,
  AlertTriangle,
  Cpu,
  LayoutGrid,
  Zap,
  CheckCircle2,
  FileText,
  MessageCircle,
  Phone,
  Maximize2,
  X,
  Sparkles,
  Layers,
  Activity,
  Sliders,
  Check
} from 'lucide-react';

interface ElectricalPanelsSectionProps {
  navigate: (route: string, param?: string) => void;
}

export const ElectricalPanelsSection: React.FC<ElectricalPanelsSectionProps> = ({ navigate }) => {
  const { language, t } = useLanguage();
  const { isLight } = useTheme();
  const { settings } = useSettings();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const phonePrimary = settings?.phonePrimary || '770931413';
  const whatsappPrimary = settings?.whatsappPrimary || '770931413';

  const data = electricalPanelsData;

  const whatsappMessage = encodeURIComponent(
    `السلام عليكم م. العريقي إنفركول، أود الاستفسار وطلب تصميم لوحة تحكم كهربائية (طبلون) لغرفة تبريد / تكييف مركزي.`
  );

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#C87D55]" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-[#C87D55]" />;
      case 'LayoutGrid':
        return <LayoutGrid className="w-6 h-6 text-emerald-500" />;
      default:
        return <Zap className="w-6 h-6 text-[#C87D55]" />;
    }
  };

  return (
    <section
      id="electrical-panels-section"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
    >
      <div
        className={`rounded-3xl border overflow-hidden shadow-2xl transition-all duration-300 ${
          isLight
            ? 'bg-white border-slate-200'
            : 'bg-gradient-to-b from-[#0B192C] via-[#081322] to-[#060E18] border-slate-800'
        }`}
      >
        {/* Section Top Header Bar */}
        <div
          className={`px-6 sm:px-10 py-8 border-b ${
            isLight
              ? 'bg-slate-50/80 border-slate-200'
              : 'bg-[#1E3E62]/20 border-slate-800/80'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#C87D55]/15 text-[#C87D55] border border-[#C87D55]/30">
                <Zap className="w-3.5 h-3.5" />
                <span>
                  {language === 'ar' ? data.subtitleAr : data.subtitleEn}
                </span>
              </div>

              {/* Main Section Title */}
              <h2
                className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {language === 'ar' ? data.titleAr : data.titleEn}
              </h2>

              {/* Exact Description Provided by User */}
              <p
                className={`text-sm sm:text-base leading-relaxed ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}
              >
                {language === 'ar' ? data.descAr : data.descEn}
              </p>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => navigate('request-quote')}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#C87D55] to-[#B86B3E] hover:from-[#d97742] hover:to-[#C87D55] text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                id="panel-request-quote-btn"
              >
                <FileText className="w-4 h-4" />
                <span>{t('طلب تسعير لوحة تحكم', 'Request Panel Quote')}</span>
              </button>

              <a
                href={`https://wa.me/967${whatsappPrimary.replace(/\D/g, '')}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md hover:scale-105 transition-all flex items-center gap-2"
                title={t('استشارة مباشرة عبر واتساب', 'WhatsApp Consultation')}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t('استشارة واتساب', 'WhatsApp')}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Section Body: Grid with Prominent Image & Key Features */}
        <div className="p-6 sm:p-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Prominent Image Showcase (Left/Start Column) */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div
                onClick={() => setIsImageModalOpen(true)}
                className="group relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl cursor-pointer bg-slate-950 aspect-[16/10] sm:aspect-[16/10] flex items-center justify-center"
              >
                {/* Panel Cover Image (Static Data from public/images/panel-cover.jpg) */}
                <img
                  src={data.coverImage}
                  alt={language === 'ar' ? data.titleAr : data.titleEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    // Fallback to asset if public path fails
                    (e.target as HTMLImageElement).src = '/src/assets/images/panel_cover_1790270132835.jpg';
                  }}
                />

                {/* Subtle gradient vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>

                {/* Badge Overlay: Official Engineering Assembly */}
                <div className="absolute top-3 start-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B192C]/90 text-white text-xs font-bold border border-[#C87D55]/50 backdrop-blur shadow-lg">
                  <ShieldCheck className="w-4 h-4 text-[#C87D55]" />
                  <span>
                    {t('توثيق ميداني | لوحة تحكم متكاملة', 'Field Certified Control Panel')}
                  </span>
                </div>

                {/* Expand Image Button Indicator */}
                <div className="absolute bottom-3 end-3 px-3 py-1.5 rounded-lg bg-black/70 text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur group-hover:bg-[#C87D55] transition-colors">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{t('تكبير الصورة', 'Expand View')}</span>
                </div>

                {/* Technical Bottom Label on Image */}
                <div className="absolute bottom-3 start-3 end-24 text-start text-white space-y-0.5 pointer-events-none">
                  <span className="text-xs font-bold text-[#E0956E] block drop-shadow">
                    {t('تجميع هندسي معتمد بمكونات أصلية', 'Certified Engineering Assembly')}
                  </span>
                  <p className="text-[11px] text-slate-300 line-clamp-1">
                    {t('مواصفات صناعية مقاومة لتقلبات التيار والغبار والرطوبة', 'Industrial Grade: Surge, Dust & Humidity Protection')}
                  </p>
                </div>
              </div>

              {/* Applications Pills */}
              <div
                className={`mt-4 p-4 rounded-2xl border text-xs ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-[#060E18]/80 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-2 text-[#C87D55]">
                  <Layers className="w-4 h-4" />
                  <span>
                    {t('استخدامات وتطبيقات اللوحات:', 'Panel Applications:')}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(language === 'ar' ? data.applicationsAr : data.applicationsEn).map(
                    (app, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="line-clamp-1">{app}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* 4 Core Features Cards (Right/End Column) */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.features.map((feature) => (
                  <div
                    key={feature.id}
                    className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between group hover:border-[#C87D55] hover:shadow-lg ${
                      isLight
                        ? 'bg-slate-50/70 border-slate-200'
                        : 'bg-[#060E18]/90 border-slate-800 hover:bg-[#0B192C]'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${
                            isLight
                              ? 'bg-white border border-slate-200 text-[#C87D55]'
                              : 'bg-[#1E3E62]/40 border border-slate-700/60'
                          }`}
                        >
                          {getFeatureIcon(feature.icon)}
                        </div>
                        {feature.badge && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C87D55]/15 text-[#C87D55] border border-[#C87D55]/30">
                            {feature.badge}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3
                          className={`text-base font-bold transition-colors group-hover:text-[#C87D55] ${
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          {language === 'ar' ? feature.titleAr : feature.titleEn}
                        </h3>
                        <p
                          className={`text-xs mt-1.5 leading-relaxed ${
                            isLight ? 'text-slate-600' : 'text-slate-400'
                          }`}
                        >
                          {language === 'ar' ? feature.descAr : feature.descEn}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Engineering Specs Matrix */}
              <div
                className={`p-5 rounded-2xl border space-y-3 ${
                  isLight
                    ? 'bg-amber-50/50 border-amber-200/80 text-slate-800'
                    : 'bg-[#1E3E62]/20 border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#C87D55] uppercase tracking-wider">
                    <Sliders className="w-4 h-4" />
                    <span>
                      {t('المواصفات الفنية المعتمدة', 'Standard Technical Specifications')}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t('اختبار عزل وحمل كامل', 'Full Load Tested')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  {data.specs.map((spec, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border ${
                        isLight
                          ? 'bg-white border-amber-200/60'
                          : 'bg-[#0B192C]/80 border-slate-700/60'
                      }`}
                    >
                      <span className="block font-bold text-[#C87D55] text-[11px] mb-0.5">
                        {language === 'ar' ? spec.labelAr : spec.labelEn}
                      </span>
                      <span
                        className={`text-[11px] leading-tight ${
                          isLight ? 'text-slate-700' : 'text-slate-300'
                        }`}
                      >
                        {language === 'ar' ? spec.valAr : spec.valEn}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section Bottom Callout Banner & Direct Contact */}
          <div
            className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 ${
              isLight
                ? 'bg-slate-100 border-slate-300'
                : 'bg-gradient-to-r from-[#060E18] via-[#0B192C] to-[#1E3E62]/40 border-slate-800'
            }`}
          >
            <div className="space-y-1 text-center md:text-start">
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-[#C87D55]">
                <Activity className="w-4 h-4" />
                <span>
                  {t('ضمان هندسي وتشغيل تجريبي', 'Engineering Guarantee & Commissioning')}
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm font-medium max-w-2xl leading-relaxed ${
                  isLight ? 'text-slate-800' : 'text-slate-300'
                }`}
              >
                {language === 'ar' ? data.calloutAr : data.calloutEn}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <button
                onClick={() => navigate('request-quote')}
                className="px-5 py-2.5 rounded-xl bg-[#C87D55] hover:bg-[#B86B3E] text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>{t('طلب تصميم طبلون مخصص', 'Custom Panel Design')}</span>
              </button>

              <a
                href={`tel:${phonePrimary}`}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition flex items-center gap-2 ${
                  isLight
                    ? 'bg-white hover:bg-slate-200 text-slate-900 border-slate-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-[#C87D55]" />
                <span className="font-mono dir-ltr">{phonePrimary}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Fullscreen Modal for Cover Image */}
      {isImageModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#0B192C] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#060E18]">
              <div className="flex items-center gap-2 text-white text-sm font-bold">
                <Zap className="w-4 h-4 text-[#C87D55]" />
                <span>{language === 'ar' ? data.titleAr : data.titleEn}</span>
              </div>
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label={t('إغلاق', 'Close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Full Image */}
            <div className="relative bg-black flex items-center justify-center max-h-[75vh] overflow-hidden">
              <img
                src={data.coverImage}
                alt={language === 'ar' ? data.titleAr : data.titleEn}
                referrerPolicy="no-referrer"
                className="w-full h-full max-h-[75vh] object-contain"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#0B192C] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-300">
                {language === 'ar' ? data.descAr : data.descEn}
              </span>
              <a
                href={`https://wa.me/967${whatsappPrimary.replace(/\D/g, '')}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shrink-0 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('طلب استشارة حول هذه اللوحة', 'Ask About This Panel')}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
