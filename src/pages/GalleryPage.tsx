import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/api.js';
import { GalleryItem, Service } from '../types.js';
import { Lightbox } from '../components/common/Lightbox.js';
import { VideoPlayer } from '../components/common/VideoPlayer.js';
import {
  Image as ImageIcon,
  Building2,
  MapPin,
  Eye,
  Maximize2,
  Video,
  Play
} from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Upgraded Lightbox State
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    api.getServices()
      .then((srvs) => setServices(srvs))
      .catch(() => setServices([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const isServiceSlug = services.some((s) => s.slug === selectedCategory);
    const params = isServiceSlug
      ? { serviceSlug: selectedCategory }
      : selectedCategory !== 'all'
      ? { category: selectedCategory }
      : undefined;

    api.getGallery(params)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [selectedCategory, services]);

  const openLightboxForItem = (item: GalleryItem, index = 0) => {
    setActiveItem(item);
    setActiveImageIndex(index);
  };

  const closeLightbox = () => {
    setActiveItem(null);
    setActiveImageIndex(0);
  };

  const activeImages = activeItem
    ? (Array.isArray(activeItem.images) && activeItem.images.length > 0
        ? activeItem.images
        : [activeItem.mediaUrl])
    : [];

  const handlePrevImage = () => {
    if (activeImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : activeImages.length - 1));
  };

  const handleNextImage = () => {
    if (activeImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev < activeImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header Banner */}
      <div className="bg-[#0B192C] text-white p-8 sm:p-12 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3E62] text-[#C87D55] text-xs font-bold">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{t('معرض الصور الميدانية والأعمال', 'Field Work & Photo Gallery')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            {t('معرض أعمال العريقي إنفركول', 'Engineering Work Gallery')}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t(
              'توثيق مصور لأعمال التركيب، لحام مواسير النحاس، تصنيع الدكت، ثلاجات تجميد الماء، ثلاجات حفظ الدواجن واللحوم، وغرف التبريد المنفذة ميدانياً في الجمهورية اليمنية مقسمة حسب التخصص والخدمة مع بيانات العملاء والمحافظات.',
              'Visual documentation of HVAC installations, bottled water freezing facilities, poultry cold hubs, ductwork fabrication, and deep blast freezers.'
            )}
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            selectedCategory === 'all'
              ? 'bg-[#0B192C] text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {t('كافة الأعمال', 'All Works')} ({items.length})
        </button>

        {services.map((srv) => (
          <button
            key={srv.id}
            onClick={() => setSelectedCategory(srv.slug)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              selectedCategory === srv.slug
                ? 'bg-[#C87D55] text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {language === 'ar' ? srv.titleAr : srv.titleEn}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">{t('جاري تحميل الصور...', 'Loading gallery...')}</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500">
          {t('لا توجد صور أو أعمال متوفرة في هذا القسم حالياً', 'No photos available in this category yet')}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const isVideo = item.mediaType === 'video';
            const title = language === 'ar' ? item.titleAr : item.titleEn;
            const caption = language === 'ar' ? item.captionAr || item.descriptionAr : item.captionEn || item.descriptionEn;
            const client = item.clientNameAr || item.clientName || item.clientNameEn;
            const loc = item.location || item.city;
            const itemImages = Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.mediaUrl];
            const hasMultiplePhotos = itemImages.length > 1;

            if (isVideo) {
              return (
                <div key={item.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                  <div className="p-3 bg-slate-900 rounded-t-3xl">
                    <VideoPlayer videoUrl={item.mediaUrl} title={title} />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1 text-[11px]">
                        <span className="font-bold text-[#C87D55] uppercase">
                          {item.category}
                        </span>
                        {client && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            <Building2 className="w-3 h-3 text-[#C87D55]" />
                            <span>{client}</span>
                          </span>
                        )}
                        {loc && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                            <MapPin className="w-3 h-3 text-amber-600" />
                            <span>{loc}</span>
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{title}</h3>
                      {caption && (
                        <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {caption}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div
                  onClick={() => openLightboxForItem(item, 0)}
                  className="relative aspect-[4/3] bg-slate-900 overflow-hidden cursor-pointer"
                  title={t('انقر لتكبير وتصفح الصور', 'Click to enlarge and browse photos')}
                >
                  <img
                    src={itemImages[0] || item.thumbnailUrl || item.mediaUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-108 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>
                  
                  {/* Bottom title info */}
                  <div className="absolute bottom-3 start-3 end-3 text-white">
                    <span className="text-[10px] font-bold text-[#C87D55] block">{item.category}</span>
                    <h3 className="text-xs sm:text-sm font-bold leading-tight drop-shadow">{title}</h3>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                    {hasMultiplePhotos ? (
                      <div className="px-2 py-1 rounded-md bg-black/60 backdrop-blur text-white text-[10px] font-bold flex items-center gap-1 border border-white/10">
                        <ImageIcon className="w-3 h-3 text-amber-400" />
                        <span>{itemImages.length} {t('صور', 'Photos')}</span>
                      </div>
                    ) : (
                      <div className="px-2 py-1 rounded-md bg-black/60 backdrop-blur text-white text-[10px] font-bold flex items-center gap-1 border border-white/10">
                        <Eye className="w-3 h-3 text-[#C87D55]" />
                        <span>{t('تكبير', 'Enlarge')}</span>
                      </div>
                    )}

                    {item.videoUrl && (
                      <div className="px-2 py-1 rounded-md bg-rose-600 text-white text-[10px] font-bold flex items-center gap-1 shadow">
                        <Play className="w-3 h-3 fill-white" />
                        <span>{t('فيديو', 'Video')}</span>
                      </div>
                    )}
                  </div>

                  {/* Inspect Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                    <div className="px-3.5 py-1.5 rounded-xl bg-[#C87D55] text-white text-xs font-bold flex items-center gap-1.5 shadow-xl">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>{hasMultiplePhotos ? t('تصفح كافة الصور', 'View All Photos') : t('تكبير وفحص الصورة', 'Enlarge Photo')}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
                  {(client || loc) && (
                    <div className="flex items-center gap-2 flex-wrap text-[11px]">
                      {client && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-slate-800 font-medium border border-slate-200">
                          <Building2 className="w-3 h-3 text-[#C87D55]" />
                          <span>{client}</span>
                        </span>
                      )}
                      {loc && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-medium border border-amber-200">
                          <MapPin className="w-3 h-3 text-amber-600" />
                          <span>{loc}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {caption && (
                    <p className="text-xs text-slate-600 leading-relaxed">{caption}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      {activeItem && (
        <Lightbox
          isOpen={true}
          onClose={closeLightbox}
          images={activeImages}
          currentIndex={activeImageIndex}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
          onSelectIndex={(idx) => setActiveImageIndex(idx)}
          title={language === 'ar' ? activeItem.titleAr : activeItem.titleEn || activeItem.titleAr}
          clientName={activeItem.clientNameAr || activeItem.clientName || activeItem.clientNameEn}
          location={activeItem.location || activeItem.city}
          caption={language === 'ar' ? activeItem.captionAr || activeItem.descriptionAr : activeItem.captionEn || activeItem.descriptionEn}
          videoUrl={activeItem.videoUrl}
        />
      )}
    </div>
  );
};
