import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/api.js';
import { Service, GalleryItem } from '../types.js';
import { Wrench, CheckCircle2, Phone, MessageCircle, ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { VideoPlayer } from '../components/common/VideoPlayer.js';
import { SectionGallery } from '../components/common/SectionGallery.js';
import { SubServicesGrid } from '../components/common/SubServicesGrid.js';

interface ServiceDetailPageProps {
  slug: string;
  navigate: (route: string, param?: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ slug, navigate }) => {
  const { language, t } = useLanguage();
  const [service, setService] = useState<Service | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryLoading, setGalleryLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      setGalleryLoading(true);
      
      api.getService(slug)
        .then((srv) => {
          setService(srv);
          // Fetch gallery items for this specific service
          return api.getGallery({ serviceSlug: slug, serviceId: srv.id, category: srv.titleAr });
        })
        .then((items) => {
          setGalleryItems(items || []);
        })
        .catch(() => {
          setService(null);
          setGalleryItems([]);
        })
        .finally(() => {
          setLoading(false);
          setGalleryLoading(false);
        });
    }
  }, [slug]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500">{t('جاري التحميل...', 'Loading...')}</div>;
  }

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">{t('الخدمة غير موجودة', 'Service not found')}</h2>
        <button onClick={() => navigate('services')} className="text-sm font-bold text-[#C87D55]">
          {t('العودة لقائمة الخدمات', 'Back to services')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Breadcrumb back */}
      <button
        onClick={() => navigate('services')}
        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#C87D55] transition"
      >
        {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span>{t('العودة إلى كافة الخدمات', 'Back to all services')}</span>
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
        <div className="relative h-72 sm:h-96 bg-slate-900">
          <img
            src={service.image}
            alt={language === 'ar' ? service.titleAr : service.titleEn}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-transparent to-transparent"></div>
          <div className="absolute bottom-6 start-6 end-6 text-white space-y-2">
            <span className="px-3 py-1 rounded bg-[#C87D55] text-white text-xs font-bold">
              {t('خدمة هندسية معتمدة', 'Certified Engineering Service')}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black">
              {language === 'ar' ? service.titleAr : service.titleEn}
            </h1>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          {/* Overview text */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">{t('وصف وتفاصيل الخدمة', 'Service Overview')}</h2>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              {language === 'ar' ? service.descAr || service.shortDescAr : service.descEn || service.shortDescEn}
            </p>
          </div>

          {/* Key Features */}
          {service.featuresAr && service.featuresAr.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">{t('مميزات ومراحل تنفيذ الخدمة', 'Key Features & Execution Steps')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(language === 'ar' ? service.featuresAr : service.featuresEn || service.featuresAr).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-slate-800">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-Services Showcase if configured (منظومات وتطبيقات التجميد والتبريد الفرعية) */}
          {service.subServices && service.subServices.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <SubServicesGrid
                subServices={service.subServices}
                parentServiceTitle={language === 'ar' ? service.titleAr : service.titleEn}
                variant="detail"
                onInquire={(sub) => {
                  navigate('request-service', service.slug);
                }}
              />
            </div>
          )}

          {/* Video Section if available */}
          {service.videoUrl && (
            <div className="pt-2">
              <VideoPlayer
                videoUrl={service.videoUrl}
                title={language === 'ar' ? service.titleAr : service.titleEn}
              />
            </div>
          )}

          {/* Section-Specific Past Work Gallery (صور وفيديوهات الأعمال السابقة الخاصة بالقسم) */}
          {galleryItems.length > 0 && (
            <div className="pt-6 border-t border-slate-100">
              <SectionGallery
                items={galleryItems}
                sectionTitle={language === 'ar' ? service.titleAr : service.titleEn}
                loading={galleryLoading}
              />
            </div>
          )}

          {/* Quality Assurance */}
          <div className="p-6 rounded-2xl bg-[#0B192C] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-start">
              <div className="flex items-center gap-2 justify-center sm:justify-start text-[#C87D55]">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">{t('ضمان معتمد', 'Certified Warranty')}</span>
              </div>
              <h3 className="text-lg font-bold">{t('هل تود تنفيذ هذه الخدمة في مشروعك؟', 'Interested in this service for your project?')}</h3>
              <p className="text-xs text-slate-300">
                {t('فريقنا الهندسي جاهز لزيارة موقعك وتقديم دراسة شاملة وعرض سعر تنافسي.', 'Our engineers are ready to visit your site and provide tailored engineering proposals.')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => navigate('request-service')}
                className="px-5 py-2.5 rounded-xl bg-[#C87D55] hover:bg-[#B86B3E] text-white font-bold text-xs sm:text-sm transition"
              >
                {t('طلب تنفيذ الخدمة', 'Book Service')}
              </button>
              <a
                href="https://wa.me/967770931413"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
