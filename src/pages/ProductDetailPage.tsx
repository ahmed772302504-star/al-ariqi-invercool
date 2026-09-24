import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/api.js';
import { Product } from '../types.js';
import { staticProducts } from '../data/staticProducts.js';
import { Lightbox } from '../components/common/Lightbox.js';
import {
  Tag,
  Phone,
  MessageCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Layers,
  Wrench
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
  navigate: (route: string, param?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, navigate }) => {
  const { language, t } = useLanguage();
  const staticFound = staticProducts.find((p) => p.slug === slug || p.id === slug) || null;
  const [product, setProduct] = useState<Product | null>(staticFound);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>(staticFound?.mainImage || '');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (slug) {
      api.getProduct(slug)
        .then((data) => {
          if (data) {
            setProduct(data);
            setSelectedImage(data.mainImage);
          }
        })
        .catch(() => {
          if (!product && staticFound) {
            setProduct(staticFound);
            setSelectedImage(staticFound.mainImage);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500">{t('جاري التحميل...', 'Loading...')}</div>;
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">{t('المنتج غير موجود', 'Product not found')}</h2>
        <button onClick={() => navigate('products')} className="text-sm font-bold text-[#C87D55]">
          {t('العودة لكافة المنتجات', 'Back to products')}
        </button>
      </div>
    );
  }

  const allImages = [product.mainImage, ...(product.additionalImages || [])].filter(Boolean);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const whatsappMessage = `مرحباً العريقي إنفركول، أود الاستفسار عن تفاصيل وحجز الجهاز: ${product.nameAr} (الموديل: ${product.model || 'غير محدد'})`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back button */}
      <button
        onClick={() => navigate('products')}
        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#C87D55] transition"
      >
        {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span>{t('العودة إلى قائمة المنتجات', 'Back to products catalog')}</span>
      </button>

      {/* Main Product Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Images Column */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Featured Image */}
            <div
              onClick={() => openLightbox(allImages.indexOf(selectedImage))}
              className="relative h-80 sm:h-96 rounded-2xl bg-slate-900 overflow-hidden cursor-zoom-in border border-slate-200 group"
            >
              <img
                src={selectedImage}
                alt={product.nameAr}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Status Badges */}
              <div className="absolute top-3 start-3 flex flex-col gap-1.5 z-10">
                {product.condition === 'used' ? (
                  <span className="px-3 py-1 rounded-lg bg-amber-600 text-white text-xs font-bold shadow-lg">
                    {t('مستعمل نظيف ومفحوص هندسياً', 'Inspected Used Unit')}
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-lg">
                    {t('جديد بالكرتون بضمان معتمد', 'Brand New in Box')}
                  </span>
                )}

                {product.isImportedEconomy && (
                  <span className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-lg">
                    {t('مستورد اقتصادي عالي الجودة', 'High Quality Imported Economy')}
                  </span>
                )}
              </div>

              {product.status === 'sold' && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
                  <span className="px-6 py-2 bg-rose-600 text-white font-black text-lg rounded-xl shadow-2xl">
                    {t('تم البيع', 'Sold Out')}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail list */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                      selectedImage === img ? 'border-[#C87D55] scale-105 shadow' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Specs & Purchasing Action Column */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Category & Brand */}
              <div className="flex items-center gap-3 text-xs font-bold text-[#C87D55]">
                <span>{product.category}</span>
                {product.brand && (
                  <>
                    <span>•</span>
                    <span className="text-slate-600">{product.brand}</span>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                {language === 'ar' ? product.nameAr : product.nameEn}
              </h1>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block mb-0.5">{t('السعر التقديري:', 'Price:')}</span>
                  {product.showPrice && product.price ? (
                    <div className="text-2xl font-black text-[#0B192C]">
                      {product.price.toLocaleString()} <span className="text-sm font-bold text-slate-500">{t('ريال يمني', 'YER')}</span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-slate-700">{t('السعر عند الطلب (تواصل للاستفسار)', 'Price on Request')}</span>
                  )}
                </div>

                <div className="text-end">
                  <span className="text-xs text-slate-500 block mb-0.5">{t('حالة التوفر:', 'Availability:')}</span>
                  {product.status === 'available' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('متوفر حالياً', 'In Stock')}</span>
                    </span>
                  ) : product.status === 'reserved' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md">
                      <span>{t('محجوز مؤقتاً', 'Reserved')}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-md">
                      <span>{t('تم البيع', 'Sold Out')}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'ar' ? product.descAr : product.descEn || product.descAr}
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`https://wa.me/967770931413?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="product-whatsapp-inquiry"
                  className="px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t('حجز أو استفسار عبر WhatsApp', 'Inquire via WhatsApp')}</span>
                </a>

                <a
                  href="tel:770931413"
                  id="product-call-inquiry"
                  className="px-5 py-3.5 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5 text-[#C87D55]" />
                  <span>{t('اتصال مباشر: 770931413', 'Call: 770931413')}</span>
                </a>
              </div>

              <button
                onClick={() => navigate('request-service')}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <Wrench className="w-4 h-4 text-[#C87D55]" />
                <span>{t('طلب خدمة تركيب أو صيانة لهذا الجهاز', 'Request Installation or Service for this unit')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Technical Specifications Table */}
        <div className="mt-12 pt-10 border-t border-slate-200 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C87D55]"></span>
            <span>{t('المواصفات الفنية والهندسية', 'Technical Specifications')}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.brand && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">{t('الماركة / الشركة المصنعة', 'Brand / Manufacturer')}</span>
                <span className="text-sm font-bold text-slate-900">{product.brand}</span>
              </div>
            )}

            {product.model && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">{t('رقم الموديل', 'Model Number')}</span>
                <span className="text-sm font-bold text-slate-900 font-mono">{product.model}</span>
              </div>
            )}

            {product.capacity && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">{t('السعة التبريدية / القدرة', 'Cooling Capacity')}</span>
                <span className="text-sm font-bold text-slate-900">{product.capacity}</span>
              </div>
            )}

            {product.condition && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">{t('حالة الجهاز', 'Condition')}</span>
                <span className="text-sm font-bold text-slate-900">
                  {product.condition === 'used' ? t('مستعمل نظيف مفحوص', 'Used - Tested') : t('جديد كلياً', 'Brand New')}
                </span>
              </div>
            )}

            {product.energyConsumption && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">{t('كفاءة الطاقة واستهلاك الكهرباء', 'Energy Consumption')}</span>
                <span className="text-sm font-bold text-slate-900">{product.energyConsumption}</span>
              </div>
            )}

            {product.warranty && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">{t('مدة وشروط الضمان', 'Warranty')}</span>
                <span className="text-sm font-bold text-slate-900">{product.warranty}</span>
              </div>
            )}

            {product.manufacturingYear && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">{t('سنة الصنع', 'Manufacturing Year')}</span>
                <span className="text-sm font-bold text-slate-900 font-mono">{product.manufacturingYear}</span>
              </div>
            )}

            {product.accessories && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">{t('الملحقات والمشتملات', 'Included Accessories')}</span>
                <span className="text-sm font-bold text-slate-900">{product.accessories}</span>
              </div>
            )}
          </div>

          {/* Dynamic Specs if any */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="pt-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-800">{t('تفاصيل إضافية:', 'Additional Parameters:')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(product.specifications).map(([k, v]) => (
                  <div key={k} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                    <span className="text-slate-500 font-medium">{k}:</span>
                    <span className="text-slate-900 font-bold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.notes && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>{t('ملاحظات الفحص الهندسي:', 'Engineering Diagnostic Notes:')}</strong> {product.notes}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox for image view */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={allImages}
        currentIndex={lightboxIndex}
        onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
        onNext={() => setLightboxIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
        title={product.nameAr}
      />
    </div>
  );
};
