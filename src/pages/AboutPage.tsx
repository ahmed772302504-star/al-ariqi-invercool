import React from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { useSettings } from '../context/SettingsContext.js';
import {
  Building2,
  ShieldCheck,
  Zap,
  Clock,
  Target,
  Users,
  Award,
  Phone,
  MessageCircle,
  MapPin,
  CheckCircle2
} from 'lucide-react';

interface AboutPageProps {
  navigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const { language, t } = useLanguage();
  const { settings, logoIconUrl, getCacheBusted } = useSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero / Header with Official Logo */}
      <div className="bg-[#0B192C] text-white p-8 sm:p-14 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3E62] text-[#C87D55] text-xs font-bold">
              <Building2 className="w-3.5 h-3.5" />
              <span>{t('نبذة تعريفية', 'Company Profile')}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {language === 'ar' ? 'العريقي إنفركول' : 'AL-ARRIQI INVERCOOL'}
              <span className="block text-2xl sm:text-3xl text-[#C87D55] font-semibold mt-2">
                {t('حلول متكاملة للتكييف والتبريد في الجمهورية اليمنية', 'Integrated HVAC & Refrigeration in Yemen')}
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {t(
                'شركة هندسية رائدة متخصصة في تصميم وتوريد وتركيب وصيانة أنظمة التكييف المركزي، وغرف التبريد والتجميد التجارية والصناعية، وحلول التكييف الاقتصادي الموفر للطاقة بكفاءة عالية في شتى محافظات الجمهورية اليمنية.',
                'A leading engineering enterprise specializing in HVAC systems, central cooling, industrial cold rooms, and energy-saving inverter solutions across all governorates of the Republic of Yemen.'
              )}
            </p>
          </div>

          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-[#060E18] border-2 border-[#C87D55] p-2 flex items-center justify-center shadow-2xl shrink-0 overflow-hidden">
            <img
              key={`about-logo-${settings?.logoUpdatedAt || settings?.updatedAt || 'init'}`}
              src={logoIconUrl}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo-icon.svg';
              }}
              alt="AL-ARRIQI INVERCOOL"
              className="w-full h-full object-contain filter drop-shadow transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0B192C] text-[#C87D55] flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">{t('رؤيتنا الهندسية', 'Our Vision')}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t(
              'أن نكون المرجع الهندسي الأول والموثوق به في الجمهورية اليمنية في مجال التكييف والتبريد وأنظمة HVAC، بتقديم أحدث الحلول الذكية الموفرة للطاقة وتوفير صيانة مستدامة تحافظ على استمرارية المنشآت الحيوية والصناعية.',
              'To be the foremost and trusted engineering benchmark in Yemen for HVAC and refrigeration, delivering cutting-edge, energy-efficient solutions and ensuring uninterrupted operation for vital industrial and commercial facilities.'
            )}
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0B192C] text-[#C87D55] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">{t('رسالتنا', 'Our Mission')}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t(
              'توفير حلول تبريد وتكييف هندسية فائقة الجودة تناسب الظروف المناخية في اليمن وتحديات الطاقة، من خلال كادر هندسي مؤهل، واستخدام قطع غيار أصلية، والالتزام بأعلى معايير الأمان والسلامة والضمان.',
              'To deliver high-grade HVAC engineering solutions tailored to Yemen climate and energy challenges, powered by qualified engineers, genuine parts, and uncompromising safety and warranty standards.'
            )}
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{t('قيمنا ومبادئنا الهندسية', 'Our Core Values')}</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('المعايير التي ننطلق منها في كل مشروع صيانة أو تأسيس نقوم به في اليمن', 'The engineering pillars behind every project we undertake')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <ShieldCheck className="w-7 h-7 text-[#C87D55]" />
            <h3 className="text-base font-bold text-slate-900">{t('الدقة والأمانة الهندسية', 'Engineering Integrity')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('تشخيص الأعطال بمعدات متطورة وتحديد المشكلة الحقيقية دون أي مبالغة أو تكاليف غير مبررة.', 'Thorough diagnostics using modern tools to pinpoint exact root causes with full transparency.')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <Zap className="w-7 h-7 text-[#C87D55]" />
            <h3 className="text-base font-bold text-slate-900">{t('كفاءة الطاقة Inverter', 'Inverter Efficiency')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('مراعاة تكلفة استهلاك الكهرباء وتوافق الأنظمة مع منظومات الطاقة البديلة والشمسية في اليمن.', 'Optimizing power consumption to suit solar and commercial generator setups across Yemeni cities.')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <Clock className="w-7 h-7 text-[#C87D55]" />
            <h3 className="text-base font-bold text-slate-900">{t('سرعة الاستجابة للطوارئ', 'Emergency Readiness')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('ندرك حساسية أعطال التبريد في مخازن الأدوية والمواد الغذائية والمستشفيات، ونتحرك على الفور.', 'Understanding the urgency of cooling failures in cold storage and hospitals, ready for immediate dispatch.')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <Users className="w-7 h-7 text-[#C87D55]" />
            <h3 className="text-base font-bold text-slate-900">{t('الشراكة طويلة الأمد', 'Long-term Partnership')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('عقود صيانة دورية سنوية وخدمات ما بعد البيع لضمان أداء يدوم لسنوات طويلة.', 'Preventive annual maintenance contracts and dedicated after-sales support ensuring maximum system lifespan.')}
            </p>
          </div>
        </div>
      </div>

      {/* Official Contact Box */}
      <div className="rounded-3xl bg-[#0B192C] text-white p-8 sm:p-12 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 text-center md:text-start">
          <h3 className="text-xl sm:text-2xl font-black">
            {t('تواصل مع إدارة ومهندسي العريقي إنفركول', 'Connect With Our Engineering Team')}
          </h3>
          <p className="text-slate-300 text-sm max-w-lg">
            {t(
              'يسعدنا تقديم استشارات مجانية حول دراسات الأحمال الحرارية واختيار أنظمة التكييف الأنسب لمنشأتك.',
              'Happy to provide engineering advice on thermal load calculations and optimal system selection for your facilities.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="tel:770931413"
            className="px-6 py-3 rounded-xl bg-[#C87D55] hover:bg-[#B86B3E] text-white font-bold text-sm transition flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span className="dir-ltr font-mono">770931413</span>
          </a>
          <a
            href="https://wa.me/967770931413"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
