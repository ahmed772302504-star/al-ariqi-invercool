import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { useTheme } from '../context/ThemeContext.js';
import { useSettings } from '../context/SettingsContext.js';
import { api } from '../services/api.js';
import { Service, Product, Project, Review, SiteSettings } from '../types.js';
import { SubServicesGrid } from '../components/common/SubServicesGrid.js';
import { ServiceIcon } from '../components/common/ServiceIcon.js';
import {
  Wrench,
  ShieldCheck,
  Zap,
  Clock,
  Phone,
  MessageCircle,
  FileText,
  ChevronRight,
  Star,
  CheckCircle2,
  Building,
  ThermometerSnowflake,
  Wind,
  Layers,
  ArrowUpRight,
  MapPin,
  Tag
} from 'lucide-react';

interface HomePageProps {
  navigate: (route: string, param?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { language, t } = useLanguage();
  const { isLight } = useTheme();
  const { settings, logoUrl, logoIconUrl, watermarkUrl, getCacheBusted } = useSettings();
  const [services, setServices] = useState<Service[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [governates, setGovernates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getServices().catch(() => []),
      api.getProducts({ featured: true }).catch(() => []),
      api.getProjects({ featured: true }).catch(() => []),
      api.getApprovedReviews().catch(() => []),
      api.getGovernates().catch(() => [])
    ]).then(([srvs, prods, prjs, revs, govs]) => {
      setServices(srvs);
      setFeaturedProducts(prods);
      setFeaturedProjects(prjs);
      setReviews(revs);
      setGovernates(govs);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section
        className={`relative overflow-hidden pt-12 pb-24 border-b transition-colors duration-200 ${
          isLight
            ? 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900 border-slate-300'
            : 'bg-gradient-to-b from-[#060E18] via-[#0B192C] to-[#0B192C] text-white border-slate-800'
        }`}
      >
        {/* Subtle Engineering Grid background */}
        <div
          className={`absolute inset-0 bg-[size:40px_40px] pointer-events-none ${
            isLight
              ? 'bg-[linear-gradient(to_right,#CBD5E1_1px,transparent_1px),linear-gradient(to_bottom,#CBD5E1_1px,transparent_1px)] opacity-60'
              : 'bg-[linear-gradient(to_right,#1E3E6215_1px,transparent_1px),linear-gradient(to_bottom,#1E3E6215_1px,transparent_1px)]'
          }`}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left/Start Column: Text & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-start relative">
              {/* Hero Text Watermark Logo - Positioned directly behind the title & text block, shifted upward */}
              <div 
                aria-hidden="true" 
                className={`absolute -top-10 sm:-top-16 lg:-top-20 left-1/2 -translate-x-1/2 w-[340px] sm:w-[480px] lg:w-[560px] h-[340px] sm:h-[480px] lg:h-[560px] pointer-events-none select-none z-0 overflow-hidden flex items-center justify-center transition-all duration-700 ${
                  isLight ? 'opacity-10 sm:opacity-12' : 'opacity-15 sm:opacity-20'
                }`}
              >
                <img
                  key={`hero-watermark-${settings?.logoUpdatedAt || settings?.updatedAt || 'init'}`}
                  src={watermarkUrl}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = logoIconUrl;
                  }}
                  alt=""
                  className="w-full h-full object-contain filter drop-shadow-[0_0_40px_rgba(200,125,85,0.25)] scale-100 transition-all duration-300"
                />
              </div>

              {/* Engineering Badge */}
              <div
                className={`relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-inner ${
                  isLight
                    ? 'bg-slate-200/90 border border-slate-400 text-slate-900'
                    : 'bg-[#1E3E62]/80 border border-[#C87D55]/60 text-white backdrop-blur-sm'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#C87D55] animate-pulse"></span>
                <span>
                  {t(
                    'الريادة الهندسية في التكييف والتبريد وأنظمة HVAC بالجمهورية اليمنية 🇾🇪',
                    'Engineering Leadership in HVAC & Central Cooling in Yemen 🇾🇪'
                  )}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="relative z-10 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2] drop-shadow-md">
                {language === 'ar' ? (
                  <>
                    <span className={isLight ? 'text-slate-950' : 'text-white drop-shadow-sm'}>العريقي إنفركول</span>
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C87D55] to-[#B86B3E]">
                      حلول متكاملة للتكييف والتبريد
                    </span>
                  </>
                ) : (
                  <>
                    <span className={isLight ? 'text-slate-950' : 'text-white drop-shadow-sm'}>AL-ARRIQI INVERCOOL</span>
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C87D55] to-[#B86B3E]">
                      Integrated HVAC & Refrigeration Solutions
                    </span>
                  </>
                )}
              </h1>

              {/* Description */}
              <p
                className={`relative z-10 text-base sm:text-lg leading-relaxed max-w-2xl font-medium ${
                  isLight ? 'text-slate-800' : 'text-slate-200 drop-shadow-sm'
                }`}
              >
                {t(
                  'تصميم وتوريد وتركيب وصيانة أنظمة التكييف المركزي، وحدات VRF/VRV، غرف ومخازن التبريد والتجميد للمشاريع التجارية والصناعية والسكنية بأعلى المعايير الهندسية وضمان معتمد.',
                  'Engineering design, supply, installation, and precision maintenance for Central AC, VRF/VRV systems, and commercial cold rooms across all Yemen governorates.'
                )}
              </p>

              {/* Call to Action Buttons */}
              <div className="relative z-10 flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => navigate('request-service')}
                  id="hero-request-service-btn"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C87D55] to-[#B86B3E] hover:from-[#d97742] hover:to-[#C87D55] text-white font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Wrench className="w-5 h-5" />
                  <span>{t('اطلب خدمة صيانة', 'Request Maintenance')}</span>
                </button>

                <button
                  onClick={() => navigate('request-quote')}
                  id="hero-request-quote-btn"
                  className="px-6 py-3.5 rounded-xl bg-[#1E3E62] hover:bg-[#254d79] text-white font-bold text-base border border-slate-600 shadow-md hover:scale-105 transition-all flex items-center gap-2"
                >
                  <FileText className="w-5 h-5 text-[#C87D55]" />
                  <span>{t('اطلب عرض سعر', 'Request a Quote')}</span>
                </button>

                <button
                  onClick={() => navigate('products')}
                  id="hero-view-products-btn"
                  className="px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 hover:text-white transition flex items-center gap-2"
                >
                  <span>{t('كتالوج المنتجات', 'Products Catalog')}</span>
                  <ChevronRight className="w-4 h-4 text-[#C87D55]" />
                </button>
              </div>

              {/* Direct Call & WhatsApp Fast Access */}
              <div className="relative z-10 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{t('للتواصل المباشر والطارئ:', 'Direct & Emergency:')}</span>
                  <a
                    href="tel:770931413"
                    className="font-mono font-bold text-[#C87D55] hover:underline text-base dir-ltr"
                  >
                    770931413
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://wa.me/967770931413"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp: 770931413</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right/End Column: Feature Card Visual with Official Emblem */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-gradient-to-br from-[#1E3E62]/40 to-[#0B192C] border border-slate-700 p-6 sm:p-8 shadow-2xl backdrop-blur">
                {/* Official Logo Banner Badge */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-700">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-[#060E18] border-2 border-[#C87D55] p-1 flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                      <img
                        key={`hero-card-emblem-${settings?.logoUpdatedAt || settings?.updatedAt || 'init'}`}
                        src={logoIconUrl}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/logo-icon.svg';
                        }}
                        alt="AL-ARRIQI INVERCOOL Official Logo"
                        className="w-full h-full object-contain filter drop-shadow transition-all duration-300"
                      />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                        {t('العريقي إنفركول', 'AL-ARRIQI INVERCOOL')}
                      </h2>
                      <p className="text-xs text-[#C87D55] font-semibold">{t('شعار الجودة والهندسة المعتمدة', 'Certified Engineering Quality')}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-xs font-bold">
                    {t('طوارئ 24/7', '24/7 Service')}
                  </span>
                </div>

                <div className="space-y-4 my-6">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0B192C]/80 border border-slate-700/60">
                    <ShieldCheck className="w-5 h-5 text-[#C87D55] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-white">{t('ضمان معتمد وقطع غيار أصلية', 'Certified Warranty & Genuine Parts')}</h3>
                      <p className="text-xs text-slate-400">{t('فحص شامل للأجهزة وضمان على التركيب والصيانة', 'Comprehensive diagnostics & certified installation guarantee')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0B192C]/80 border border-slate-700/60">
                    <Zap className="w-5 h-5 text-[#C87D55] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-white">{t('كفاءة طاقة قصوى - تكنولوجيا Inverter', 'Inverter Energy-Saving Technology')}</h3>
                      <p className="text-xs text-slate-400">{t('توفير استهلاك الكهرباء والطاقة الشمسية', 'Optimized for commercial grid and solar power operation')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0B192C]/80 border border-slate-700/60">
                    <Tag className="w-5 h-5 text-[#C87D55] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-white">{t('أجهزة مستعملة واقتصادية مستوردة', 'Quality Used & Imported Economy Units')}</h3>
                      <p className="text-xs text-slate-400">{t('خيارات عملية ومضمونة بأسعار تنافسية تناسب كل ميزانية', 'Thoroughly tested budget units with certified performance')}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{t('تغطية شاملة لكافة محافظات اليمن', 'Serving All Yemeni Governorates')}</span>
                  <button
                    onClick={() => navigate('request-technician')}
                    className="text-xs font-bold text-[#C87D55] hover:text-[#E0956E] flex items-center gap-1"
                  >
                    <span>{t('طلب زيارة فني', 'Book Technician')}</span>
                    <span>←</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & ENGINEERING HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div
            className={`p-6 rounded-2xl border shadow-xl text-center space-y-1 transition-colors ${
              isLight ? 'bg-white border-slate-300' : 'bg-[#0B192C] border-slate-800'
            }`}
          >
            <span className="text-3xl sm:text-4xl font-black text-[#C87D55]">100%</span>
            <p className={`text-sm font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {t('كادر هندسي يمني متخصص', 'Yemeni Engineering Team')}
            </p>
            <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
              {t('خبرة وكفاءة هندسية عالية', 'High standard expertise')}
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border shadow-xl text-center space-y-1 transition-colors ${
              isLight ? 'bg-white border-slate-300' : 'bg-[#0B192C] border-slate-800'
            }`}
          >
            <span className={`text-3xl sm:text-4xl font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>22+</span>
            <p className={`text-sm font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {t('محافظة وموقع مغطى', 'Governorates & Locations')}
            </p>
            <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
              {t('تغطية كافة أرجاء اليمن', 'All across the Republic')}
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border shadow-xl text-center space-y-1 transition-colors ${
              isLight ? 'bg-white border-slate-300' : 'bg-[#0B192C] border-slate-800'
            }`}
          >
            <span className="text-3xl sm:text-4xl font-black text-[#C87D55]">17+</span>
            <p className={`text-sm font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {t('خدمة هندسية متخصصة', 'Specialized HVAC Services')}
            </p>
            <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
              {t('من التصميم حتى الصيانة الدورية', 'Design to periodic care')}
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border shadow-xl text-center space-y-1 transition-colors ${
              isLight ? 'bg-white border-slate-300' : 'bg-[#0B192C] border-slate-800'
            }`}
          >
            <span className="text-3xl sm:text-4xl font-black text-emerald-500">24/7</span>
            <p className={`text-sm font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {t('استجابة طوارئ التبريد', 'Cooling Emergency Response')}
            </p>
            <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
              {t('دعم ومتابعة للمنشآت الحيوية', 'Continuous facility support')}
            </p>
          </div>
        </div>
      </section>

      {/* 3. CORE SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#C87D55] text-xs font-bold uppercase tracking-wider mb-2">
              <Wrench className="w-4 h-4" />
              <span>{t('حلولنا الهندسية', 'Our Engineering Services')}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              {t('خدمات متكاملة في التكييف والتبريد', 'Comprehensive HVAC & Refrigeration Services')}
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-2xl">
              {t(
                'نقدم باقة هندسية كاملة تشمل التأسيس، التوريد، التركيب، والصيانة الدورية لكافة الأنظمة بمختلف السعات للمشاريع السكنية والتجارية والصناعية.',
                'Offering a full spectrum of engineering services including HVAC design, supply, installation, duct fabrication, and certified maintenance.'
              )}
            </p>
          </div>

          <button
            onClick={() => navigate('services')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#C87D55] hover:text-[#A85D35] transition"
          >
            <span>{t('عرض جميع الخدمات (17 خدمة)', 'View All 17 Services')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Section Showcase Banner (Air conditioning & central refrigeration) */}
        {settings?.hvacSectionImageUrl && (
          <div className="mb-8 rounded-3xl overflow-hidden border border-slate-200 shadow-lg relative h-48 sm:h-72 group">
            <img
              key={`hvac-section-${settings?.updatedAt || 'init'}`}
              src={getCacheBusted(settings.hvacSectionImageUrl)}
              alt={t('خدمات التكييف والتثليج المركزي', 'Air Conditioning & Central Refrigeration Services')}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/90 via-[#0B192C]/30 to-transparent flex items-end p-6 sm:p-8">
              <div className="text-white space-y-1">
                <span className="px-3 py-1 rounded-full bg-[#C87D55] text-white text-xs font-bold inline-block">
                  {t('الريادة في التكييف والتثليج المركزي', 'HVAC & Central Refrigeration Excellence')}
                </span>
                <p className="text-sm sm:text-base font-semibold text-slate-100 max-w-xl">
                  {t('تنفيذ هندسي موثوق لمشاريع التكييف المركزي، غرف التجميد، وشبكات مجاري الهواء في كل اليمن', 'Reliable engineering execution for central HVAC, blast freezers, and duct systems across Yemen')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((service) => {
            const hasSubServices = service.subServices && service.subServices.length > 0;

            return (
              <div
                key={service.id}
                onClick={() => navigate('service-detail', service.slug)}
                className={`group rounded-2xl border p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  hasSubServices ? 'col-span-1 md:col-span-2 lg:col-span-2' : 'col-span-1'
                } ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-[#C87D55]'
                    : 'bg-[#0B192C]/70 border-slate-700/80 hover:border-[#C87D55]'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#0B192C] text-[#C87D55] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#C87D55] group-hover:text-white transition-all duration-300 shadow-inner">
                      <ServiceIcon name={service.iconName} className="w-7 h-7" defaultIcon={<Wind className="w-7 h-7" />} />
                    </div>
                    {hasSubServices && (
                      <span className="px-3 py-1 rounded-full bg-[#C87D55]/15 text-[#C87D55] text-xs font-black border border-[#C87D55]/30">
                        {t('حلول تجميد وتبريد متعددة ❄️', 'Integrated Systems ❄️')}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className={`text-lg font-bold group-hover:text-[#C87D55] transition ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {language === 'ar' ? service.titleAr : service.titleEn}
                    </h3>
                    <p className={`text-xs mt-2 line-clamp-3 leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {language === 'ar' ? service.shortDescAr : service.shortDescEn}
                    </p>
                  </div>

                  {/* Standard key features */}
                  {service.featuresAr && service.featuresAr.length > 0 && !hasSubServices && (
                    <ul className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      {service.featuresAr.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Specialized Sub-Services Grid (ثلاجات تجميد الماء، ثلاجات الدواجن والأغذية، إلخ) */}
                  {hasSubServices && (
                    <div className="pt-2">
                      <SubServicesGrid
                        subServices={service.subServices!}
                        parentServiceTitle={language === 'ar' ? service.titleAr : service.titleEn}
                        variant="card"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#C87D55]">
                  <span>{t('تفاصيل المنظومات وطلب دراسة هندسية', 'System Details & Engineering Booking')}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. WHY CHOOSE US (لماذا العريقي إنفركول؟) */}
      <section className="bg-[#0B192C] text-white py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-[#C87D55] text-xs font-bold uppercase tracking-wider">
              {t('مميزاتنا الهندسية', 'Engineering Strengths')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              {t('لماذا تختار العريقي إنفركول؟', 'Why Choose AL-ARRIQI INVERCOOL?')}
            </h2>
            <p className="text-slate-400 text-sm">
              {t(
                'نجمع بين الدقة الهندسية، الحلول الموفرة للطاقة، والالتزام الصارم بالمواعيد لضمان أعلى درجات الراحة والاستدامة لمنشأتك.',
                'Combining engineering precision, inverter energy efficiency, and strict timeline adherence to ensure maximum comfort and reliability.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#060E18] border border-slate-800 space-y-3 hover:border-[#C87D55] transition">
              <div className="w-12 h-12 rounded-xl bg-[#1E3E62] text-[#C87D55] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">{t('دقة هندسية وتشخيص علمي', 'Scientific Diagnostics')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t(
                  'استخدام أحدث أجهزة كشف الأعطال وقياس ضغوط وسائط التبريد وفحص كفاءة الكمبروسرات قبل البدء بأي صيانة.',
                  'State-of-the-art diagnostic tools to measure refrigerant pressures, electrical parameters, and compressor efficiency.'
                )}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#060E18] border border-slate-800 space-y-3 hover:border-[#C87D55] transition">
              <div className="w-12 h-12 rounded-xl bg-[#1E3E62] text-[#C87D55] flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">{t('حلول تبريد موفرة للطاقة Inverter', 'Inverter Energy Saving')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t(
                  'أنظمة متطورة توفر حتى 50% من استهلاك الكهرباء، وتتوافق بكفاءة مع منظومات الطاقة الشمسية والمولدات في اليمن.',
                  'Smart HVAC systems reducing power consumption by up to 50%, fully compatible with solar systems and generators.'
                )}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#060E18] border border-slate-800 space-y-3 hover:border-[#C87D55] transition">
              <div className="w-12 h-12 rounded-xl bg-[#1E3E62] text-[#C87D55] flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">{t('سرعة الاستجابة والالتزام بالوقت', 'Rapid Response & Reliability')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t(
                  'جاهزية فرق الصيانة والتدخل السريع لخدمة المشاريع الكبرى والمستشفيات والمصانع ومخازن التبريد الغذائي.',
                  'Prompt response team dedicated to mission-critical facilities, hospitals, cold storage, and commercial towers.'
                )}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#060E18] border border-slate-800 space-y-3 hover:border-[#C87D55] transition">
              <div className="w-12 h-12 rounded-xl bg-[#1E3E62] text-[#C87D55] flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">{t('قطع غيار أصلية وضمان معتمد', 'Certified Parts & Warranty')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t(
                  'نوفر قطع الغيار الأصلية لكافة العلامات التجارية العالمية، مع ضمانات رسمية واضحة على القطع والصيانة.',
                  'Genuine replacement components for world-class HVAC brands with official warranty on all work carried out.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS & USED/IMPORTED ECONOMY UNITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#C87D55] text-xs font-bold uppercase tracking-wider mb-2">
              <Tag className="w-4 h-4" />
              <span>{t('الكتالوج والمنتجات', 'Products & Catalog')}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              {t('أحدث الأجهزة وقطع الغيار والخيارات الاقتصادية', 'Featured Units, Spare Parts & Economy Deals')}
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-2xl">
              {t(
                'تصفح باقة واسعة من أجهزة التكييف المركزي، وحدات VRF، المكيفات الجدارية، والأجهزة المستعملة والمستوردة الاقتصادية المفحوصة هندسياً.',
                'Explore our range of central AC, split units, commercial VRF systems, and thoroughly inspected imported economy and used units.'
              )}
            </p>
          </div>

          <button
            onClick={() => navigate('products')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#C87D55] hover:text-[#A85D35] transition"
          >
            <span>{t('عرض كافة المنتجات', 'View All Products')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <div
              key={product.id}
              onClick={() => navigate('product-detail', product.slug)}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-[#C87D55] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Product Image & Status Badges */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={product.mainImage}
                    alt={language === 'ar' ? product.nameAr : product.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Status & Condition Badges */}
                  <div className="absolute top-2 start-2 flex flex-col gap-1">
                    {product.condition === 'used' ? (
                      <span className="px-2 py-0.5 rounded bg-amber-600 text-white text-[10px] font-bold shadow">
                        {t('مستعمل نظيف', 'Inspected Used')}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold shadow">
                        {t('جديد بالكرتون', 'Brand New')}
                      </span>
                    )}

                    {product.isImportedEconomy && (
                      <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold shadow">
                        {t('مستورد اقتصادي', 'Imported Economy')}
                      </span>
                    )}
                  </div>

                  {product.status === 'sold' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="px-3 py-1 bg-rose-600 text-white font-black text-sm rounded uppercase tracking-wider">
                        {t('تم البيع', 'Sold Out')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-[#C87D55]">{product.brand || product.category}</span>
                    {product.capacity && <span>{product.capacity}</span>}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#C87D55] transition line-clamp-2">
                    {language === 'ar' ? product.nameAr : product.nameEn}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {language === 'ar' ? product.descAr : product.descEn}
                  </p>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {product.showPrice && product.price ? (
                    <span className="text-sm font-black text-[#0B192C]">
                      {product.price.toLocaleString()} {t('ريال', 'YER')}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-500">{t('السعر عند الطلب', 'Price on Request')}</span>
                  )}
                </div>

                <a
                  href={`https://wa.me/967770931413?text=${encodeURIComponent(
                    `مرحباً العريقي إنفركول، أستفسر عن المنتج: ${product.nameAr}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition"
                  title="استفسار سريع عبر واتساب"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FEATURED PROJECTS PREVIEW */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#C87D55] text-xs font-bold uppercase tracking-wider mb-2">
                <Building className="w-4 h-4" />
                <span>{t('المشاريع المنفذة', 'Executed Projects')}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
                {t('سجل إنجازاتنا الهندسية في اليمن', 'Engineering Track Record Across Yemen')}
              </h2>
              <p className="text-slate-600 text-sm mt-2 max-w-2xl">
                {t(
                  'مشاريع تكييف مركزي، غرف تبريد عملاقة، وأنظمة تهوية للمصانع والأبراج التجارية والمشافي المنفذة في مختلف المحافظات.',
                  'Central HVAC installations, industrial cold stores, and cleanroom ventilation projects executed across major Yemeni governorates.'
                )}
              </p>
            </div>

            <button
              onClick={() => navigate('projects')}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#C87D55] hover:text-[#A85D35] transition"
            >
              <span>{t('استعراض كافة المشاريع', 'Explore All Projects')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                onClick={() => navigate('project-detail', project.slug)}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 bg-slate-900 overflow-hidden">
                    <img
                      src={project.images[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop'}
                      alt={language === 'ar' ? project.titleAr : project.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 start-3 px-2.5 py-1 rounded-md bg-[#0B192C]/90 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur">
                      <MapPin className="w-3.5 h-3.5 text-[#C87D55]" />
                      <span>{project.governate}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <span className="text-xs font-semibold text-[#C87D55]">{project.category}</span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#C87D55] transition">
                      {language === 'ar' ? project.titleAr : project.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {language === 'ar' ? project.descAr : project.descEn}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between text-xs font-bold text-[#C87D55]">
                  <span>{t('عرض تفاصيل المشروع والصور', 'View Project & Specs')}</span>
                  <span>←</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. YEMEN GOVERNORATES COVERAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`rounded-3xl p-8 sm:p-12 border shadow-2xl relative overflow-hidden transition-colors ${
            isLight
              ? 'bg-slate-50 border-2 border-slate-300 text-slate-900'
              : 'bg-gradient-to-br from-[#0B192C] to-[#1E3E62] text-white border-slate-700'
          }`}
        >
          <div className="relative z-10 max-w-3xl space-y-4">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
                isLight
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-[#C87D55]/20 text-[#E0956E] border-[#C87D55]/40'
              }`}
            >
              <span>🇾🇪</span>
              <span>{t('تغطية شاملة لكل اليمن', 'Yemen-wide Full Coverage')}</span>
            </div>
            <h2 className={`text-2xl sm:text-4xl font-black leading-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {t(
                'نصلكم أينما كنتم في جميع محافظات الجمهورية اليمنية',
                'Serving Clients Across All Yemen Governorates'
              )}
            </h2>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>
              {t(
                'سواء كنت في صنعاء، عدن، تعز، الحديدة، إب، حضرموت، مأرب، ذمار أو أي محافظة يمنية أخرى، فإن فرقنا الهندسية وفنيينا جاهزون لتنفيذ مشاريع التكييف والتبريد وصيانة المنشآت الحيوية بأعلى جودة.',
                'Whether in Sanaa, Aden, Taiz, Hodeidah, Ibb, Hadramout, Marib, Dhamar or any other governorate, our engineers and technicians are equipped to deliver top-tier HVAC and refrigeration services.'
              )}
            </p>

            <div className="flex flex-wrap gap-2 pt-3">
              {governates.map((gov) => (
                <span
                  key={gov}
                  className={`px-3 py-1 rounded-lg border text-xs font-semibold ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900 shadow-sm'
                      : 'bg-[#060E18]/70 border-slate-700 text-slate-200'
                  }`}
                >
                  {gov}
                </span>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('request-technician')}
                className="px-6 py-3 rounded-xl bg-[#C87D55] hover:bg-[#B86B3E] text-white font-bold text-sm shadow-lg transition"
              >
                {t('اطلب فنيًا في محافظتك الآن', 'Book a Technician in Your Area')}
              </button>
              <a
                href="tel:770931413"
                className={`px-6 py-3 rounded-xl font-bold text-sm border transition flex items-center gap-2 ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300 shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600'
                }`}
              >
                <Phone className="w-4 h-4 text-[#C87D55]" />
                <span className="dir-ltr font-mono">770931413</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CLIENT REVIEWS & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#C87D55] text-xs font-bold uppercase tracking-wider mb-2">
              <Star className="w-4 h-4" />
              <span>{t('آراء العملاء', 'Client Testimonials')}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              {t('ماذا يقول عملاؤنا عن خدماتنا؟', 'What Our Clients Say About Us')}
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-2xl">
              {t(
                'نفخر بثقة عملائنا في مختلف محافظات الجمهورية اليمنية ورضاهم عن دقة التنفيذ والصيانة الهندسية.',
                'We take immense pride in client satisfaction and trust across residential, commercial, and industrial facilities in Yemen.'
              )}
            </p>
          </div>

          <button
            onClick={() => navigate('reviews')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#C87D55] hover:text-[#A85D35] transition"
          >
            <span>{t('عرض جميع التقييمات وإضافة رأيك', 'View All & Add Your Review')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed italic">
                  "{language === 'ar' ? review.textAr : review.textEn || review.textAr}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{review.clientName}</h4>
                  <span className="text-xs text-slate-400">{review.city}</span>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {t('عميل موثق', 'Verified Client')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION (Need HVAC Service?) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#C87D55] to-[#B86B3E] text-white p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-start">
            <h2 className="text-2xl sm:text-3xl font-black">
              {t('هل تبحث عن استشارة هندسية أو صيانة فورية لمنشأتك؟', 'Need HVAC Engineering or Emergency Maintenance?')}
            </h2>
            <p className="text-white/90 text-sm max-w-xl">
              {t(
                'تواصل معنا الآن، وسيقوم مهندسونا بتقديم دراسة فنية دقيقة وتوفير أفضل الحلول الاقتصادية والمستدامة.',
                'Contact us today for prompt engineering consultation, certified maintenance, and cost-effective HVAC solutions.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <button
              onClick={() => navigate('request-quote')}
              className="px-6 py-3.5 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] text-white font-bold text-sm shadow-xl transition"
            >
              {t('طلب عرض سعر مجاني', 'Request Free Quote')}
            </button>
            <a
              href="https://wa.me/967770931413"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-white text-[#0B192C] hover:bg-slate-100 font-bold text-sm shadow-xl transition flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>{t('محادثة واتساب مباشرة', 'WhatsApp Chat')}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
