import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { useSettings } from '../context/SettingsContext.js';
import { api } from '../services/api.js';
import { Service } from '../types.js';
import { SubServicesGrid } from '../components/common/SubServicesGrid.js';
import {
  Wrench,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Search,
  X,
  Filter,
  Layers,
  Building,
  Cpu,
  ShieldCheck,
  Snowflake,
  Play,
  Sparkles,
  PhoneCall,
  MessageCircle,
  HelpCircle,
  Factory
} from 'lucide-react';

interface ServicesPageProps {
  navigate: (route: string, param?: string) => void;
}

// Normalize Arabic & English text for flexible, error-tolerant real-time search
function normalizeSearchText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[أإآء]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '') // remove arabic tashkeel diacritics
    .trim();
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ navigate }) => {
  const { language, t } = useLanguage();
  const { settings, getCacheBusted } = useSettings();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    api.getServices()
      .then((srvs) => {
        setServices(srvs);
      })
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  // Category definitions tailored for industrial, commercial, and enterprise clients
  const serviceCategories = useMemo(
    () => [
      {
        id: 'all',
        nameAr: 'كافة الخدمات الهندسية',
        nameEn: 'All Engineering Services',
        icon: Layers,
        slugs: [] as string[]
      },
      {
        id: 'industrial',
        nameAr: 'التبريد والمشاريع الصناعية',
        nameEn: 'Industrial & Central Cooling',
        icon: Factory,
        slugs: ['commercial-industrial', 'central-refrigeration', 'cold-rooms', 'chillers-industrial']
      },
      {
        id: 'central-hvac',
        nameAr: 'التكييف المركزي والـ VRF',
        nameEn: 'Central HVAC & VRF Systems',
        icon: Building,
        slugs: ['central-ac-systems', 'central-refrigeration', 'installation-commissioning']
      },
      {
        id: 'cold-storage',
        nameAr: 'غرف وثلاجات التبريد',
        nameEn: 'Cold Rooms & Freezers',
        icon: Snowflake,
        slugs: ['cold-rooms', 'refrigeration-repair', 'central-refrigeration']
      },
      {
        id: 'maintenance-contracts',
        nameAr: 'عقود الصيانة والتشخيص',
        nameEn: 'Maintenance & Contracts',
        icon: ShieldCheck,
        slugs: ['preventive-maintenance', 'ac-repair-maintenance', 'diagnostics-repair', 'refrigeration-repair']
      },
      {
        id: 'institutional',
        nameAr: 'المستشفيات والشركات والفنادق',
        nameEn: 'Institutional & Healthcare',
        icon: Cpu,
        slugs: ['hospital-projects', 'hotel-projects', 'corporate-facilities', 'residential-projects']
      },
      {
        id: 'equipment-parts',
        nameAr: 'التوريد، قطع الغيار والمستلزمات',
        nameEn: 'Supplies & Spare Parts',
        icon: Wrench,
        slugs: ['economic-ac-import', 'spare-parts-sales', 'hvac-supplies-sales', 'used-equipment-sales']
      }
    ],
    []
  );

  // Helper to check if a service belongs to a category
  const matchesCategory = (service: Service, catId: string): boolean => {
    if (catId === 'all') return true;
    const cat = serviceCategories.find((c) => c.id === catId);
    if (!cat) return true;

    // Check slug membership
    if (cat.slugs.includes(service.slug)) return true;

    // Check custom category field if set in admin
    if (service.category && normalizeSearchText(service.category).includes(normalizeSearchText(cat.nameAr))) {
      return true;
    }

    return false;
  };

  // Real-time filtered services list
  const filteredServices = useMemo(() => {
    let list = [...services];

    // Filter by category
    if (selectedCategory !== 'all') {
      list = list.filter((s) => matchesCategory(s, selectedCategory));
    }

    // Filter by real-time search query
    if (searchQuery.trim()) {
      const q = normalizeSearchText(searchQuery);
      list = list.filter((service) => {
        const titleAr = normalizeSearchText(service.titleAr);
        const titleEn = normalizeSearchText(service.titleEn);
        const shortAr = normalizeSearchText(service.shortDescAr || '');
        const shortEn = normalizeSearchText(service.shortDescEn || '');
        const descAr = normalizeSearchText(service.descAr || '');
        const descEn = normalizeSearchText(service.descEn || '');
        const slug = normalizeSearchText(service.slug || '');
        const cat = normalizeSearchText(service.category || '');

        const featuresAr = (service.featuresAr || []).map(normalizeSearchText).join(' ');
        const featuresEn = (service.featuresEn || []).map(normalizeSearchText).join(' ');

        return (
          titleAr.includes(q) ||
          titleEn.includes(q) ||
          shortAr.includes(q) ||
          shortEn.includes(q) ||
          descAr.includes(q) ||
          descEn.includes(q) ||
          featuresAr.includes(q) ||
          featuresEn.includes(q) ||
          slug.includes(q) ||
          cat.includes(q)
        );
      });
    }

    return list;
  }, [services, selectedCategory, searchQuery]);

  // Dynamic count for each category based on total services
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: services.length };
    serviceCategories.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = services.filter((s) => matchesCategory(s, cat.id)).length;
      }
    });
    return counts;
  }, [services, serviceCategories]);

  // Quick search keywords for industrial clients
  const quickIndustrialTags = [
    { label: t('أنظمة VRF والشيلر', 'VRF & Chillers'), query: 'VRF' },
    { label: t('غرف التبريد والبانل', 'Cold Storage & Panels'), query: 'غرف تبريد' },
    { label: t('عقود صيانة دورية للمصانع', 'Periodic Factory Contracts'), query: 'صيانة وقائية' },
    { label: t('مشاريع المستشفيات والمراكز', 'Hospital Cleanrooms'), query: 'مستشفيات' },
    { label: t('قطع الغيار الأصلية والضواغط', 'Genuine Compressors & Parts'), query: 'قطع غيار' }
  ];

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header Banner */}
      <div className="bg-[#0B192C] text-white p-8 sm:p-12 rounded-3xl border border-slate-800 relative overflow-hidden shadow-2xl">
        {settings?.hvacSectionImageUrl && (
          <img
            key={`services-hvac-banner-${settings?.updatedAt || 'init'}`}
            src={getCacheBusted(settings.hvacSectionImageUrl)}
            alt="HVAC and Refrigeration"
            className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity scale-105 pointer-events-none transition-all duration-300"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B192C] via-[#0B192C]/90 to-[#0B192C]/50 pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3E62] text-[#C87D55] text-xs font-bold">
            <Wrench className="w-3.5 h-3.5" />
            <span>{t('17 خدمة هندسية متخصصة', '17 Specialized Engineering Services')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            {t('خدمات التكييف والتبريد وأنظمة HVAC', 'HVAC & Refrigeration Services')}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t(
              'نقدم لعملائنا في كافة محافظات الجمهورية اليمنية حلولاً هندسية متكاملة للمصانع، المستشفيات، الأبراج التجارية، والمشاريع السكنية بمعايير دقيقة لحساب الأحمال الحرارية والتوريد والتركيب والصيانة الوقائية.',
              'Delivering certified engineering solutions across all Yemen governorates: from thermal load calculation and design to supply, ducting, industrial installation, and periodic maintenance contracts.'
            )}
          </p>
        </div>
      </div>

      {/* Real-Time Search & Category Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
        {/* Main Search Input & Reset Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSearchQuery('');
              }}
              placeholder={t(
                'ابحث فوراً بالاسم، النوع، الكلمات الفنية (مثال: VRF, غرف تبريد, صيانة دورية, شيلرات)...',
                'Search in real-time by service name, keyword, or equipment (e.g., VRF, Cold Rooms, Chillers, Duct)...'
              )}
              className="w-full ps-12 pe-10 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm text-slate-900 placeholder:text-slate-400 font-medium transition shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute end-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
                title={t('مسح البحث', 'Clear Search')}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-3.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition flex items-center justify-center gap-2 shrink-0 border border-rose-200"
            >
              <X className="w-4 h-4" />
              <span>{t('إعادة ضبط الفلاتر', 'Reset Filters')}</span>
            </button>
          )}
        </div>

        {/* Industrial Category Filter Pills with Live Item Counts */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#C87D55]" />
              <span>{t('تصفية حسب القطاع والتخصص الهندسي:', 'Filter by Engineering Sector:')}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {serviceCategories.map((cat) => {
              const count = categoryCounts[cat.id] ?? 0;
              const isSelected = selectedCategory === cat.id;
              const Icon = cat.icon;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-[#0B192C] text-white border-[#0B192C] shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#C87D55]' : 'text-slate-500'}`} />
                  <span>{language === 'ar' ? cat.nameAr : cat.nameEn}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                      isSelected ? 'bg-[#1E3E62] text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Industrial Search Shortcuts */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C87D55]" />
            <span>{t('عمليات بحث شائعة للمنشآت:', 'Popular Industrial Queries:')}</span>
          </span>
          {quickIndustrialTags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchQuery(tag.query);
                setSelectedCategory('all');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#C87D55]/10 text-slate-600 hover:text-[#C87D55] text-[11px] font-medium transition border border-slate-200/80"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <span>{t('عرض النتائج:', 'Displaying:')}</span>
          <strong className="text-slate-900 font-black text-sm">
            {filteredServices.length} {t('خدمة هندسية', 'Engineering Services')}
          </strong>
          {selectedCategory !== 'all' && (
            <span className="text-slate-400">
              ({t('في قسم:', 'in category:')}{' '}
              {language === 'ar'
                ? serviceCategories.find((c) => c.id === selectedCategory)?.nameAr
                : serviceCategories.find((c) => c.id === selectedCategory)?.nameEn}
              )
            </span>
          )}
          {searchQuery && (
            <span className="text-[#C87D55] font-semibold">
              - {t('مطابقة لعبارة:', 'matching:')} &ldquo;{searchQuery}&rdquo;
            </span>
          )}
        </div>

        <div className="text-slate-500 text-[11px]">
          {t('نلبي مشاريع القطاعين التجاري والصناعي في كافة محافظات اليمن', 'Serving commercial & industrial sectors throughout Yemen')}
        </div>
      </div>

      {/* Services Grid or Empty State */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">
          {t('جاري تحميل وتحديث الخدمات الهندسية...', 'Loading engineering services...')}
        </div>
      ) : filteredServices.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center space-y-5 shadow-sm max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#C87D55] flex items-center justify-center mx-auto border border-amber-200">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">
              {t('لم نجد خدمات مطابقة لبحثك', 'No matching services found')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              {t(
                'لم يتم العثور على خدمة تطابق معايير البحث الحالية. يمكنك تعديل كلمات البحث أو التواصل مع مهندسينا مباشرة لأي متطلبات تكييف أو تبريد خاصة بمنشأتك.',
                'No service matched your current search filters. Try adjusting keywords or contact our engineering staff directly for custom requirements.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold transition shadow"
            >
              {t('عرض كافة الـ 17 خدمة', 'Show All 17 Services')}
            </button>
            <a
              href="https://wa.me/967770931413?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D9%84%D8%AF%D9%8A%D9%86%D8%A7%20%D8%B7%D9%84%D8%A8%20%D8%AE%D8%AF%D9%85%D8%A9%20%D8%AA%D9%83%D9%8A%D9%8A%D9%81%20%D8%AE%D8%A7%D8%B5%D8%A9%20%D9%84%D9%85%D9%86%D8%B4%D8%A3%D8%AA%D9%86%D8%A7"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('استشارة هندسية عبر واتساب', 'WhatsApp Engineering Consultation')}</span>
            </a>
          </div>
        </div>
      ) : (
        /* Services Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-[#C87D55] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 bg-slate-900 overflow-hidden">
                  <img
                    src={service.image || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop'}
                    alt={language === 'ar' ? service.titleAr : service.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 start-3 px-3 py-1 rounded-md bg-[#0B192C]/90 text-[#C87D55] text-xs font-bold border border-slate-700 backdrop-blur-xs">
                    #{index + 1}
                  </div>
                  {service.videoUrl && (
                    <div className="absolute top-3 end-3 px-2 py-1 rounded-md bg-[#C87D55] text-white text-[10px] font-bold flex items-center gap-1 shadow">
                      <Play className="w-3 h-3 fill-current" />
                      <span>{t('فيديو', 'Video')}</span>
                    </div>
                  )}
                  {service.isFeatured && (
                    <div className="absolute bottom-3 start-3 px-2.5 py-0.5 rounded-md bg-amber-500/90 text-slate-900 text-[10px] font-bold shadow">
                      {t('خدمة رئيسية', 'Featured')}
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#C87D55] transition">
                    {language === 'ar' ? service.titleAr : service.titleEn}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {language === 'ar' ? service.shortDescAr : service.shortDescEn}
                  </p>

                  {service.featuresAr && service.featuresAr.length > 0 && (!service.subServices || service.subServices.length === 0) && (
                    <div className="pt-3 border-t border-slate-100 space-y-1.5">
                      {service.featuresAr.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Sub-Services inside card if available */}
                  {service.subServices && service.subServices.length > 0 && (
                    <div className="pt-2">
                      <SubServicesGrid
                        subServices={service.subServices}
                        parentServiceTitle={language === 'ar' ? service.titleAr : service.titleEn}
                        variant="card"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between gap-3 border-t border-slate-100 mt-4">
                <button
                  onClick={() => navigate('service-detail', service.slug)}
                  className="text-xs font-bold text-[#C87D55] hover:text-[#A85D35] flex items-center gap-1 transition"
                >
                  <span>{t('تفاصيل ومعرض العمل', 'Details & Gallery')}</span>
                  {language === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => navigate('request-service')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-semibold transition"
                >
                  {t('طلب تنفيذ', 'Book Now')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
