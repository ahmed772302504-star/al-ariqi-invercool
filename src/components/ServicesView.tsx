import React, { useState } from 'react';
import { useApp } from '../context';
import { Service } from '../types';
import {
  Wrench,
  Snowflake,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Building,
  Wind,
  Phone,
  Flame,
  X
} from 'lucide-react';

interface ServicesProps {
  openQuoteModal: () => void;
  openTechModal: () => void;
  setCurrentTab: (tab: string) => void;
}

export const ServicesView: React.FC<ServicesProps> = ({
  openQuoteModal,
  openTechModal,
  setCurrentTab
}) => {
  const { lang, t, services } = useApp();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Snowflake':
        return <Snowflake className="w-6 h-6" />;
      case 'Building':
        return <Building className="w-6 h-6" />;
      case 'Wind':
        return <Wind className="w-6 h-6" />;
      case 'Zap':
        return <Zap className="w-6 h-6" />;
      default:
        return <Wrench className="w-6 h-6" />;
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C87D55]/10 border border-[#C87D55]/30 text-xs font-bold text-[#A85D35]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('حلول هندسية متكاملة للتكييف والتبريد وأنظمة HVAC', 'Integrated HVAC, Cold Rooms & Cooling Engineering')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B192C]">
            {t('خدماتنا الهندسية والتنفيذية', 'Our Engineering Services')}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t(
              'نقدم لعملائنا في اليمن أحدث حلول التكييف الموفرة للطاقة وتصميم وتنفيذ غرف التبريد والتجميد وتمديدات مجاري الهواء والصيانة الوقائية بإشراف كوادر هندسية معتمدة.',
              'Delivering modern energy-efficient HVAC, cold chain storage design, commercial ductwork, and certified maintenance across Yemen.'
            )}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:border-[#C87D55]/60 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Image Banner */}
              <div className="relative aspect-16/9 bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setSelectedService(srv)}>
                <img
                  src={srv.image}
                  alt={srv.titleAr}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-2 text-white">
                  <div className="w-9 h-9 rounded-xl bg-[#C87D55] text-white flex items-center justify-center shadow">
                    {getIcon(srv.iconName)}
                  </div>
                  <h3 className="text-sm font-bold text-white shadow-sm">
                    {lang === 'ar' ? srv.titleAr : srv.titleEn}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {lang === 'ar' ? srv.shortDescAr : srv.shortDescEn}
                  </p>

                  {/* Key Features Bullet List */}
                  <ul className="space-y-2 text-xs text-slate-700">
                    {(lang === 'ar' ? srv.featuresAr : srv.featuresEn).slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedService(srv)}
                    className="text-xs font-bold text-[#0B192C] hover:text-[#C87D55] flex items-center gap-1 transition-colors"
                  >
                    <span>{t('المزيد من التفاصيل', 'Full Details')}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>

                  <button
                    onClick={openQuoteModal}
                    className="px-3 py-1.5 rounded-lg bg-[#C87D55]/10 hover:bg-[#C87D55] text-[#A85D35] hover:text-white text-xs font-bold transition-colors"
                  >
                    {t('طلب دراسة', 'Get Quote')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Service Modal */}
        {selectedService && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <img
                  src={selectedService.image}
                  alt={selectedService.titleAr}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-3 right-3 rtl:right-auto rtl:left-3 w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B192C] text-[#C87D55] flex items-center justify-center">
                    {getIcon(selectedService.iconName)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {lang === 'ar' ? selectedService.titleAr : selectedService.titleEn}
                    </h2>
                    <span className="text-xs text-[#A85D35] font-semibold">{t('خدمة هندسية معتمدة', 'Certified Engineering Service')}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {lang === 'ar' ? selectedService.descAr : selectedService.descEn}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900">{t('المزايا الهندسية والمواصفات:', 'Key Specifications & Highlights:')}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(lang === 'ar' ? selectedService.featuresAr : selectedService.featuresEn).map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-[#C87D55] mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedService(null);
                      openTechModal();
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    {t('طلب فني كشف مباشر', 'Request Tech Inspection')}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedService(null);
                      openQuoteModal();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#C87D55] hover:bg-[#A85D35] text-white text-xs font-bold shadow-md transition-colors"
                  >
                    {t('طلب دراسة وعرض سعر', 'Request Engineering Quote')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
