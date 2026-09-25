import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/api.js';
import { Product } from '../types.js';
import { staticProducts } from '../data/staticProducts.js';
import {
  Tag,
  Search,
  Filter,
  MessageCircle,
  Phone,
  CheckCircle2,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  X,
  Sparkles,
  Zap
} from 'lucide-react';

interface ProductsPageProps {
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

export const ProductsPage: React.FC<ProductsPageProps> = ({ navigate }) => {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [loading, setLoading] = useState(false);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [importedEconomyOnly, setImportedEconomyOnly] = useState(false);

  const categories = useMemo(
    () => [
      { id: 'all', nameAr: 'كافة الأقسام', nameEn: 'All Categories' },
      { id: 'تكييف مركزي', nameAr: 'تكييف مركزي و VRF', nameEn: 'Central AC & VRF' },
      { id: 'غرف تبريد وتجميد', nameAr: 'غرف تبريد وتجميد', nameEn: 'Cold Storage & Freezers' },
      { id: 'تكييف جداري سبليت', nameAr: 'مكيفات سبليت ودولابي', nameEn: 'Split & Floor AC' },
      { id: 'قطع غيار واكسسوارات', nameAr: 'قطع غيار وضواغط', nameEn: 'Spare Parts & Compressors' },
    ],
    []
  );

  // Quick industrial queries for immediate one-click search
  const quickIndustrialTags = [
    { label: t('أنظمة 380V / 3 Phase', '380V / 3 Phase Systems'), query: '380V' },
    { label: t('تقنية الإنفرتر Inverter', 'Inverter Technology'), query: 'Inverter' },
    { label: t('ضواغط سكرول Copeland', 'Copeland Scroll Compressors'), query: 'Copeland' },
    { label: t('متوافق مع الطاقة الشمسية Solar', 'Solar Compatible AC'), query: 'شمسية' },
    { label: t('تبريد منخفض -25°C', 'Low Temp -25°C Freezers'), query: '-25' },
  ];

  useEffect(() => {
    api.getProducts()
      .then((data) => {
        setProducts(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Real-time dynamic filtering
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search query across name, brand, model, capacity, category, specs, and description
    if (searchTerm.trim()) {
      const q = normalizeSearchText(searchTerm);
      list = list.filter((p) => {
        const nameAr = normalizeSearchText(p.nameAr);
        const nameEn = normalizeSearchText(p.nameEn);
        const brand = normalizeSearchText(p.brand || '');
        const model = normalizeSearchText(p.model || '');
        const capacity = normalizeSearchText(p.capacity || '');
        const category = normalizeSearchText(p.category || '');
        const descAr = normalizeSearchText(p.descAr || '');
        const descEn = normalizeSearchText(p.descEn || '');
        
        // Search inside specifications values and keys
        const specsText = p.specifications
          ? normalizeSearchText(
              Object.entries(p.specifications)
                .map(([k, v]) => `${k} ${v}`)
                .join(' ')
            )
          : '';

        return (
          nameAr.includes(q) ||
          nameEn.includes(q) ||
          brand.includes(q) ||
          model.includes(q) ||
          capacity.includes(q) ||
          category.includes(q) ||
          descAr.includes(q) ||
          descEn.includes(q) ||
          specsText.includes(q)
        );
      });
    }

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Condition filter
    if (selectedCondition !== 'all') {
      list = list.filter((p) => p.condition === selectedCondition);
    }

    // Availability Status filter
    if (selectedStatus !== 'all') {
      list = list.filter((p) => p.status === selectedStatus);
    }

    // Imported economy only
    if (importedEconomyOnly) {
      list = list.filter((p) => p.isImportedEconomy);
    }

    return list;
  }, [products, searchTerm, selectedCategory, selectedCondition, selectedStatus, importedEconomyOnly]);

  // Dynamic live item counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    categories.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = products.filter((p) => p.category === cat.id).length;
      }
    });
    return counts;
  }, [products, categories]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCondition('all');
    setSelectedStatus('all');
    setImportedEconomyOnly(false);
  };

  const isAnyFilterActive =
    Boolean(searchTerm) ||
    selectedCategory !== 'all' ||
    selectedCondition !== 'all' ||
    selectedStatus !== 'all' ||
    importedEconomyOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header Banner */}
      <div className="bg-[#0B192C] text-white p-8 sm:p-12 rounded-3xl border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3E62] text-[#C87D55] text-xs font-bold">
            <Tag className="w-3.5 h-3.5" />
            <span>{t('كتالوج الأجهزة وقطع الغيار والخيارات الاقتصادية', 'Products, Parts & Budget Deals')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            {t('أجهزة التكييف والتبريد وقطع الغيار', 'HVAC Equipment & Spare Parts')}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t(
              'نوفر وحدات التكييف الجديدة بالكرتون بضمان معتمد، بالإضافة إلى باقة مختارة بعناية من الأجهزة المستعملة النظيفة والمستوردة الاقتصادية المفحوصة بأيدي مهندسينا، مع توفير الضواغط وقطع الغيار الأصلية لكافة المشاريع في اليمن.',
              'Supplying brand new systems with certified warranty, as well as thoroughly inspected imported economy units, inspected pre-owned equipment, and original compressors for industrial and commercial projects across Yemen.'
            )}
          </p>
        </div>
      </div>

      {/* Real-Time Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
        {/* Search input & drop-down filters */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSearchTerm('');
              }}
              placeholder={t(
                'ابحث فوراً بالاسم، الماركة، السعة، أو المواصفات (مثال: Inverter, 380V, Bitzer, Copeland, 24 طن)...',
                'Search in real-time by name, brand, capacity, or specs (e.g. Inverter, 380V, Bitzer, Copeland)...'
              )}
              className="w-full ps-12 pe-10 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm text-slate-900 placeholder:text-slate-400 font-medium transition shadow-inner"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute end-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
                title={t('مسح البحث', 'Clear Search')}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 w-full lg:w-auto">
            {/* Condition selector */}
            <div className="relative flex-1 sm:w-44">
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full py-3.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#C87D55] transition appearance-none cursor-pointer"
              >
                <option value="all">{t('كافة الحالات (جديد / مستعمل)', 'All Conditions')}</option>
                <option value="new">{t('جديد بالكرتون فقط', 'Brand New Only')}</option>
                <option value="used">{t('مستعمل نظيف مفحوص', 'Inspected Used Only')}</option>
              </select>
            </div>

            {/* Availability status selector */}
            <div className="relative flex-1 sm:w-44">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full py-3.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#C87D55] transition appearance-none cursor-pointer"
              >
                <option value="all">{t('كافة الحالات (متوفر / مباع)', 'All Availability')}</option>
                <option value="available">{t('المتوفر حالياً فقط', 'Available In Stock')}</option>
                <option value="sold">{t('الأجهزة المباعة', 'Sold Units')}</option>
              </select>
            </div>

            {isAnyFilterActive && (
              <button
                onClick={resetFilters}
                className="col-span-2 sm:col-span-1 px-4 py-3.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 border border-rose-200"
                title={t('تفريغ كافة الفلاتر', 'Reset All Filters')}
              >
                <X className="w-4 h-4" />
                <span>{t('تفريغ', 'Reset')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills with Live Item Counts & Imported Economy Checkbox */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const count = categoryCounts[cat.id] ?? 0;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[#0B192C] text-white border-[#0B192C] shadow'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
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

          {/* Imported Economy Deals toggle pill */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200 hover:bg-amber-100 transition shadow-xs">
            <input
              type="checkbox"
              checked={importedEconomyOnly}
              onChange={(e) => setImportedEconomyOnly(e.target.checked)}
              className="rounded text-[#C87D55] focus:ring-[#C87D55] w-4 h-4"
            />
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-600 fill-current" />
              <span>{t('عرض الأجهزة الاقتصادية المستوردة فقط', 'Imported Economy Deals Only')}</span>
            </span>
          </label>
        </div>

        {/* Quick Industrial Search Tags */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C87D55]" />
            <span>{t('اختصارات البحث الصناعي:', 'Industrial Quick Search:')}</span>
          </span>
          {quickIndustrialTags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchTerm(tag.query);
                setSelectedCategory('all');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#C87D55]/10 text-slate-600 hover:text-[#C87D55] text-[11px] font-medium transition border border-slate-200/80"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results summary bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <span>{t('عدد النتائج المعروضة:', 'Showing results:')}</span>
          <strong className="text-slate-900 font-black text-sm">
            {filteredProducts.length} {t('منتج', 'items')}
          </strong>
          {selectedCategory !== 'all' && (
            <span className="text-slate-400">
              ({t('في قسم:', 'in:')}{' '}
              {language === 'ar'
                ? categories.find((c) => c.id === selectedCategory)?.nameAr
                : categories.find((c) => c.id === selectedCategory)?.nameEn}
              )
            </span>
          )}
          {searchTerm && (
            <span className="text-[#C87D55] font-semibold">
              - {t('مطابقة لـ:', 'matching:')} &ldquo;{searchTerm}&rdquo;
            </span>
          )}
        </div>

        <span className="text-[#C87D55] font-semibold text-[11px]">
          {t('جميع الأجهزة تخضع للفحص الهندسي والتأكد من ضغوط التبريد', 'All units undergo comprehensive engineering diagnostics')}
        </span>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">
          {t('جاري تحميل كتالوج المنتجات...', 'Loading products catalogue...')}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center space-y-5 shadow-sm max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#C87D55] flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">
              {t('لم يتم العثور على منتجات مطابقة للبحث', 'No matching products found')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              {t(
                'جرب تعديل كلمات البحث أو اختيار قسم مختلف، أو تواصل معنا للاستفسار عن توفر طلبك أو توريد معدات خاصة لمنشأتك.',
                'Try adjusting your search criteria, or contact our engineering procurement team for special orders.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold transition shadow"
            >
              {t('عرض كافة المنتجات', 'Show All Products')}
            </button>
            <a
              href="https://wa.me/967770931413?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%A8%D8%AD%D8%AB%20%D8%B9%D9%86%20%D9%85%D9%86%D8%AA%D8%AC%20%D8%A3%D9%88%20%D9%82%D8%B7%D8%B9%D8%A9%20%D8%BA%D9%8A%D8%A7%D8%B1%20%D8%AA%D9%83%D9%8A%D9%8A%D9%81%20%D8%AE%D8%A7%D8%B5%D8%A9"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('طلب توريد خاص عبر واتساب', 'Special Order via WhatsApp')}</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate('product-detail', product.slug)}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-[#C87D55] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  <img
                    src={product.mainImage || '/images/products/vrf-system.jpg'}
                    alt={language === 'ar' ? product.nameAr : product.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/products/vrf-system.jpg';
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-2.5 start-2.5 flex flex-col gap-1 z-10">
                    {product.condition === 'used' ? (
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-600 text-white text-[11px] font-bold shadow-md">
                        {t('مستعمل نظيف', 'Inspected Used')}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-bold shadow-md">
                        {t('جديد بالكرتون', 'Brand New')}
                      </span>
                    )}

                    {product.isImportedEconomy && (
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-[11px] font-bold shadow-md">
                        {t('مستورد اقتصادي', 'Imported Economy')}
                      </span>
                    )}
                  </div>

                  {/* Sold Out Overlay */}
                  {product.status === 'sold' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                      <span className="px-4 py-1.5 bg-rose-600 text-white font-black text-sm rounded uppercase tracking-wider shadow-xl">
                        {t('تم البيع', 'Sold Out')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-bold text-[#C87D55]">{product.brand || product.category}</span>
                    {product.capacity && <span className="font-semibold">{product.capacity}</span>}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#C87D55] transition line-clamp-2">
                    {language === 'ar' ? product.nameAr : product.nameEn}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {language === 'ar' ? product.descAr : product.descEn}
                  </p>

                  {product.model && (
                    <div className="text-[11px] text-slate-400 font-mono">
                      {t('الموديل:', 'Model:')} {product.model}
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  {product.showPrice && product.price ? (
                    <div>
                      <span className="text-base font-black text-[#0B192C]">
                        {product.price.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-500 ms-1">{t('ريال', 'YER')}</span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-slate-600">{t('السعر عند الطلب', 'Price on Request')}</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://wa.me/967770931413?text=${encodeURIComponent(
                      `مرحباً العريقي إنفركول، أود الاستفسار عن تفاصيل وتوفر المنتج: ${product.nameAr}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition"
                    title="استفسار عبر واتساب"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => navigate('product-detail', product.slug)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-[#0B192C] hover:text-white text-slate-700 transition"
                    title="عرض التفاصيل"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
