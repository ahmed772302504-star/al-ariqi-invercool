import React, { useState } from 'react';
import { useApp } from '../context';
import { Product } from '../types';
import {
  ShoppingBag,
  Zap,
  ShieldCheck,
  Filter,
  Search,
  CheckCircle2,
  Tag,
  Phone,
  MessageCircle,
  Sparkles,
  Info,
  Calendar,
  X,
  ExternalLink
} from 'lucide-react';

interface ProductsProps {
  openQuoteModal: () => void;
  openTechModal: () => void;
}

export const ProductsView: React.FC<ProductsProps> = ({
  openQuoteModal,
  openTechModal
}) => {
  const { lang, t, products, settings } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'مكيفات سبليت إنفرتر', labelAr: 'سبليت إنفرتر', labelEn: 'Split Inverter' },
    { id: 'غرف ومعدات تبريد', labelAr: 'غرف ومعدات تبريد', labelEn: 'Cold Rooms' },
    { id: 'مكيفات صحراوية وطاقة شمسية', labelAr: 'صحراوي وطاقة شمسية', labelEn: 'Solar & Desert AC' },
    { id: 'قطع غيار وضواغط', labelAr: 'قطع غيار وضواغط', labelEn: 'Spare Parts & Compressors' },
  ];

  const filtered = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedCondition !== 'all' && p.condition !== selectedCondition) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (p.nameAr + ' ' + p.nameEn + ' ' + (p.brand || '') + ' ' + (p.model || '')).toLowerCase();
      if (!matchName.includes(q)) return false;
    }
    return true;
  });

  const whatsappNumber = settings?.whatsappPrimary || '770931413';

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-700">
            <Zap className="w-3.5 h-3.5" />
            <span>{t('توفير فائق في الطاقة متوافق مع منظومات الطاقة الشمسية والكهرباء التجارية في اليمن', 'Ultra Energy-Saving Compatible with Solar Systems & Generators')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B192C]">
            {t('معرض الأجهزة ومكيفات التوفير المستوردة', 'AC Showroom & Energy-Saving Inverters')}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t(
              'نوفر تشكيلة واسعة من مكيفات الإنفرتر الذكية الموفرة للكهرباء بنسبة تصل إلى 65%، بالإضافة إلى أجهزة التكييف المستوردة الاقتصادية المفحوصة والمضمونة ومعدات غرف التبريد.',
              'Wide selection of smart inverter air conditioners saving up to 65% electrical power, along with certified imported economy units and cold storage equipment.'
            )}
          </p>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('ابحث عن ماركة، موديل، أو نوع المكيف...', 'Search brand, model, capacity...')}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#C87D55]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Condition Filters */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-slate-500 shrink-0">{t('الحالة:', 'Condition:')}</span>
              <button
                onClick={() => setSelectedCondition('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                  selectedCondition === 'all'
                    ? 'bg-[#0B192C] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t('الكل', 'All')}
              </button>
              <button
                onClick={() => setSelectedCondition('new')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                  selectedCondition === 'new'
                    ? 'bg-[#0B192C] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t('جديد بالكرتون', 'Brand New')}
              </button>
              <button
                onClick={() => setSelectedCondition('used_clean')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                  selectedCondition === 'used_clean'
                    ? 'bg-[#0B192C] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t('مستورد كرت نظيف', 'Imported Clean Economy')}
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#C87D55] text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {lang === 'ar' ? cat.labelAr : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              {t('لا توجد منتجات تطابق البحث حالياً', 'No products matched your query')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('يمكنك طلب أي موديل محدد مباشرة عبر التواصل مع فريق المبيعات', 'You can request any specific model directly via our sales team')}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedCondition('all');
              }}
              className="px-4 py-2 bg-[#0B192C] text-white rounded-lg text-xs font-bold"
            >
              {t('إعادة ضبط الفلاتر', 'Reset filters')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:border-[#C87D55]/60 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Top Image Container */}
                <div className="relative aspect-video bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(item)}>
                  <img
                    src={item.mainImage}
                    alt={item.nameAr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Badges */}
                  <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex flex-col gap-1.5 items-start">
                    {item.isImportedEconomy && (
                      <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                        {t('مستورد اقتصادي موفر', 'Imported Economy')}
                      </span>
                    )}
                    {item.condition === 'new' ? (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        {t('جديد بالضمان', 'Brand New')}
                      </span>
                    ) : (
                      <span className="bg-slate-800/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        {t('فحص هندسي مضمون', 'Certified Inspected')}
                      </span>
                    )}
                  </div>

                  {/* Availability Status */}
                  <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3">
                    {item.status === 'available' ? (
                      <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        {t('متوفر في المستودع', 'In Stock')}
                      </span>
                    ) : (
                      <span className="bg-slate-700/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                        {t('مباع / بالطلب', 'Sold / Upon Order')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                      <span>{item.brand}</span>
                      <span className="text-[#C87D55] font-bold">{item.capacity}</span>
                    </div>

                    <h3
                      className="text-sm font-bold text-slate-900 group-hover:text-[#C87D55] transition-colors cursor-pointer line-clamp-1"
                      onClick={() => setSelectedProduct(item)}
                    >
                      {lang === 'ar' ? item.nameAr : item.nameEn}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {lang === 'ar' ? item.descAr : item.descEn}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
                    {item.energyConsumption && (
                      <div className="flex items-center gap-1.5 text-emerald-700">
                        <Zap className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-semibold">{item.energyConsumption}</span>
                      </div>
                    )}
                    {item.warranty && (
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C87D55] shrink-0" />
                        <span>{item.warranty}</span>
                      </div>
                    )}
                  </div>

                  {/* Action & Price Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      {item.showPrice && item.price ? (
                        <div>
                          <div className="text-[10px] text-slate-400 font-semibold">{t('السعر التقريبي:', 'Price:')}</div>
                          <div className="text-sm font-black text-[#0B192C]">
                            {item.price.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">ريال يمني</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#A85D35] font-bold bg-[#C87D55]/10 px-2 py-0.5 rounded">
                          {t('السعر حسب العرض', 'Quote on request')}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedProduct(item)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        {t('التفاصيل', 'Details')}
                      </button>

                      <a
                        href={`https://wa.me/967${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`السلام عليكم، استفسار بخصوص جهاز: ${item.nameAr} (${item.model || ''}) المعروض على موقع إنفركول`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm"
                        title={t('استفسار واتساب فوري', 'Ask on WhatsApp')}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Banner for Custom Orders */}
        <div className="bg-gradient-to-r from-[#0B192C] to-[#1E3E62] text-white p-8 rounded-2xl shadow-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-right rtl:md:text-right ltr:md:text-left">
            <h3 className="text-xl font-black">
              {t('هل تبحث عن جهاز محدد أو كمية للمشاريع الكبرى؟', 'Looking for a specific model or bulk project order?')}
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              {t(
                'نقوم باستيراد وتأمين أجهزة التكييف المركزية ومكيفات التوفير بمختلف القدرات (من 1 طن وحتى 25 طن) مع التوصيل والتركيب والضمان لكافة المحافظات.',
                'We supply commercial HVAC units, central DX units and multi-split inverter systems with professional installation across Yemen.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={openQuoteModal}
              className="px-5 py-2.5 rounded-xl bg-[#C87D55] text-white text-xs font-bold hover:bg-[#A85D35] shadow-lg transition-all"
            >
              {t('طلب تسعيرة كميات', 'Request Bulk Pricing')}
            </button>
            <a
              href="tel:770931413"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
            >
              {t('اتصال بالمبيعات', 'Call Sales')}
            </a>
          </div>
        </div>

        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
              {/* Top Banner */}
              <div className="relative aspect-video sm:aspect-21/9 bg-slate-100 overflow-hidden">
                <img
                  src={selectedProduct.mainImage}
                  alt={selectedProduct.nameAr}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-3 right-3 rtl:right-auto rtl:left-3 w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Details Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#A85D35]">{selectedProduct.category}</span>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">
                      {lang === 'ar' ? selectedProduct.nameAr : selectedProduct.nameEn}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedProduct.brand} - {selectedProduct.model || ''} ({selectedProduct.capacity})
                    </p>
                  </div>

                  <div className="text-left rtl:text-left ltr:text-right">
                    {selectedProduct.showPrice && selectedProduct.price ? (
                      <div>
                        <div className="text-lg font-black text-[#0B192C]">
                          {selectedProduct.price.toLocaleString()} <span className="text-xs font-normal">ريال</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs font-bold bg-[#C87D55]/10 text-[#A85D35] px-2.5 py-1 rounded-full">
                        {t('السعر حسب العرض', 'Price on quote')}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'ar' ? selectedProduct.descAr : selectedProduct.descEn}
                </p>

                {/* Specs Grid */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">{t('استهلاك الكهرباء:', 'Power Draw:')}</span>
                    <span className="font-bold text-slate-800">{selectedProduct.energyConsumption || t('اقتصادي موفر', 'Eco Inverter')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{t('الضمان:', 'Warranty:')}</span>
                    <span className="font-bold text-slate-800">{selectedProduct.warranty || t('ضمان العريقي إنفركول', 'Invercool Warranty')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{t('الحالة:', 'Condition:')}</span>
                    <span className="font-bold text-slate-800">
                      {selectedProduct.condition === 'new' ? t('جديد بالكرتون', 'Brand New') : t('مستورد كرت نظيف مفحوص', 'Imported Clean Tested')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{t('سنة الصنع / التوفر:', 'Availability:')}</span>
                    <span className="font-bold text-slate-800">{selectedProduct.status === 'available' ? t('متوفر فوراً', 'Ready for Delivery') : t('بالحجز المسبق', 'Pre-order')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                  <a
                    href={`https://wa.me/967${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`أود حجز أو طلب تفاصيل إضافية عن المكيف: ${selectedProduct.nameAr}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t('طلب وحجز عبر الواتساب', 'Book via WhatsApp')}</span>
                  </a>

                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      openQuoteModal();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold transition-colors"
                  >
                    {t('طلب عرض سعر رسمي', 'Get Formal Quote')}
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
