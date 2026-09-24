import React from 'react';
import { SubService } from '../../types.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { ServiceIcon } from './ServiceIcon.js';
import { CheckCircle2, ArrowUpRight, MessageCircle, Sparkles, Layers } from 'lucide-react';

interface SubServicesGridProps {
  subServices: SubService[];
  parentServiceTitle?: string;
  variant?: 'card' | 'compact' | 'expanded' | 'detail';
  onInquire?: (subService: SubService) => void;
  className?: string;
}

export const SubServicesGrid: React.FC<SubServicesGridProps> = ({
  subServices,
  parentServiceTitle,
  variant = 'card',
  onInquire,
  className = ''
}) => {
  const { language, t } = useLanguage();
  const { isLight } = useTheme();

  if (!subServices || subServices.length === 0) {
    return null;
  }

  // Generate WhatsApp inquiry link with pre-filled context
  const getSubServiceWhatsAppLink = (sub: SubService) => {
    const title = language === 'ar' ? sub.titleAr : sub.titleEn || sub.titleAr;
    const parent = parentServiceTitle ? ` (ضمن ${parentServiceTitle})` : '';
    const text = encodeURIComponent(
      `مرحباً شركة العريقي إنفركول،\nأود الاستفسار وطلب دراسة / عرض سعر للخدمة المتخصصة:\n📌 "${title}"${parent}.\nيرجى تزويدي بالتفاصيل والمواصفات المتاحة.`
    );
    return `https://wa.me/967770931413?text=${text}`;
  };

  // 1. Compact / Inside Card Variant (for Home & Services list cards)
  if (variant === 'card' || variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#C87D55]">
            <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse" />
            <span>{t('تطبيقات وتجهيزات فرعية متخصصة:', 'Specialized Sub-Services & Systems:')}</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C87D55]/15 text-[#C87D55] border border-[#C87D55]/30">
            {subServices.length} {t('أنظمة', 'Systems')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {subServices.map((sub) => {
            const title = language === 'ar' ? sub.titleAr : sub.titleEn || sub.titleAr;
            const desc = language === 'ar' ? sub.descAr : sub.descEn || sub.descAr;
            const badge = language === 'ar' ? sub.badgeAr : sub.badgeEn;

            return (
              <div
                key={sub.id}
                className={`relative group/sub rounded-xl p-3 border transition-all duration-300 flex flex-col justify-between ${
                  isLight
                    ? 'bg-slate-50/90 hover:bg-white border-slate-200/90 hover:border-[#C87D55] hover:shadow-md'
                    : 'bg-[#0B192C]/60 hover:bg-[#1E3E62]/40 border-slate-700/80 hover:border-[#C87D55] hover:shadow-lg'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/sub:scale-110 ${
                        isLight
                          ? 'bg-[#0B192C] text-[#C87D55] group-hover/sub:bg-[#C87D55] group-hover/sub:text-white'
                          : 'bg-[#1E3E62] text-[#C87D55] group-hover/sub:bg-[#C87D55] group-hover/sub:text-white'
                      }`}
                    >
                      <ServiceIcon name={sub.iconName} className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      {badge && (
                        <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 mb-1 border border-amber-500/20">
                          {badge}
                        </span>
                      )}
                      <h4
                        className={`text-xs font-bold line-clamp-2 leading-snug transition-colors ${
                          isLight
                            ? 'text-slate-900 group-hover/sub:text-[#C87D55]'
                            : 'text-slate-100 group-hover/sub:text-[#C87D55]'
                        }`}
                      >
                        {title}
                      </h4>
                    </div>
                  </div>

                  {desc && (
                    <p
                      className={`text-[11px] leading-relaxed line-clamp-2 ${
                        isLight ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      {desc}
                    </p>
                  )}

                  {sub.featuresAr && sub.featuresAr.length > 0 && (
                    <div className="pt-1.5 border-t border-slate-200/50 dark:border-slate-800 space-y-1">
                      {sub.featuresAr.slice(0, 2).map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/40 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold">
                  <span className="text-[#C87D55] flex items-center gap-1 group-hover/sub:translate-x-0.5 transition-transform">
                    <span>{t('طلب تسعيرة وتفاصيل', 'Get Quote & Specs')}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>

                  <a
                    href={getSubServiceWhatsAppLink(sub)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white transition-colors"
                    title={t('استفسار مباشر عبر واتساب', 'Inquire via WhatsApp')}
                  >
                    <MessageCircle className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. Expanded / Detail Page Variant (for ServiceDetailPage & prominent sections)
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C87D55] uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>{t('الخدمات والحلول الفرعية المتخصصة', 'Specialized Sub-Services & Systems')}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {t('منظومات التجميد والتبريد المركزي المتخصصة', 'Specialized Freezing & Central Refrigeration Systems')}
          </h3>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {t('حلول هندسية مصممة خصيصاً لمشاريع المياه والمواد الغذائية', 'Engineered custom solutions for water & food industries')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {subServices.map((sub) => {
          const title = language === 'ar' ? sub.titleAr : sub.titleEn || sub.titleAr;
          const desc = language === 'ar' ? sub.descAr : sub.descEn || sub.descAr;
          const badge = language === 'ar' ? sub.badgeAr : sub.badgeEn;
          const features = language === 'ar' ? sub.featuresAr : sub.featuresEn || sub.featuresAr;

          return (
            <div
              key={sub.id}
              className={`rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 ${
                isLight
                  ? 'bg-white hover:border-[#C87D55] shadow-sm hover:shadow-xl border-slate-200'
                  : 'bg-[#0B192C]/80 hover:bg-[#1E3E62]/30 hover:border-[#C87D55] shadow-md hover:shadow-2xl border-slate-800'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0B192C] text-[#C87D55] group-hover:bg-[#C87D55] group-hover:text-white transition-colors duration-300 flex items-center justify-center shadow-inner">
                      <ServiceIcon name={sub.iconName} className="w-6 h-6" />
                    </div>
                    <div>
                      {badge && (
                        <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#C87D55]/15 text-[#C87D55] border border-[#C87D55]/30 mb-1">
                          {badge}
                        </span>
                      )}
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#C87D55] transition-colors leading-snug">
                        {title}
                      </h4>
                    </div>
                  </div>
                </div>

                {desc && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {desc}
                  </p>
                )}

                {features && features.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {t('المواصفات والضمانات الهندسية:', 'Engineering Specs & Guarantees:')}
                    </div>
                    <ul className="space-y-1.5">
                      {features.map((feat, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={getSubServiceWhatsAppLink(sub)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{t('طلب تسعيرة فورية عبر واتساب', 'Direct WhatsApp Quote')}</span>
                </a>

                {onInquire ? (
                  <button
                    onClick={() => onInquire(sub)}
                    className="px-4 py-2 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>{t('طلب دراسة هندسية', 'Engineering Study')}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <a
                    href="tel:770931413"
                    className="text-xs font-bold text-[#C87D55] hover:underline flex items-center gap-1"
                  >
                    <span>{t('اتصال بالمهندس المختص: 770931413', 'Call Engineer: 770931413')}</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
