import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import { GalleryItem } from '../../types.js';
import { Lightbox } from './Lightbox.js';
import { VideoPlayer } from './VideoPlayer.js';
import {
  Image as ImageIcon,
  Video,
  Eye,
  Layers,
  Sparkles,
  Building2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface SectionGalleryProps {
  items: GalleryItem[];
  sectionTitle?: string;
  loading?: boolean;
}

export const SectionGallery: React.FC<SectionGalleryProps> = ({
  items,
  sectionTitle,
  loading = false
}) => {
  const { language, t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');
  
  // Lightbox State for active item
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (loading) {
    return (
      <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center text-slate-500 animate-pulse">
        {t('جاري تحميل معرض أعمال القسم...', 'Loading section gallery...')}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  // Filter items
  const filteredItems = items.filter((item) => {
    if (filter === 'images') return item.mediaType === 'image' || !item.mediaType;
    if (filter === 'videos') return item.mediaType === 'video';
    return true;
  });

  const hasVideos = items.some((i) => i.mediaType === 'video' || i.videoUrl);
  const hasImages = items.some((i) => i.mediaType === 'image' || !i.mediaType || (i.images && i.images.length > 0));

  const openLightboxForItem = (item: GalleryItem, initialIndex = 0) => {
    setActiveItem(item);
    setActiveImageIndex(initialIndex);
  };

  const closeLightbox = () => {
    setActiveItem(null);
    setActiveImageIndex(0);
  };

  // Active item images array
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
    <div className="space-y-6 pt-4">
      {/* Header with Title and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[#C87D55] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('معرض وتوثيق الأعمال السابقة', 'Past Work & Visual Gallery')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {sectionTitle
              ? t(`أعمال ومشاريع منفذة: ${sectionTitle}`, `Field Work & Execution: ${sectionTitle}`)
              : t('معرض الأعمال والمشاريع السابقة', 'Past Works & Projects Gallery')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t(
              'استعرض صور وفيديوهات حية للأعمال المنفذة ومراحل التركيب والصيانة الميدانية بدقة وجودة عالية مع بيانات العملاء والمحافظات.',
              'Browse real field installations, repairs, and diagnostics with multi-photo documentation and client information.'
            )}
          </p>
        </div>

        {/* Filters if both images and videos exist */}
        {hasVideos && hasImages && (
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl shrink-0 self-start sm:self-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('الكل', 'All')} ({items.length})
            </button>
            <button
              onClick={() => setFilter('images')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                filter === 'images'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#C87D55]" />
              <span>{t('صور', 'Photos')}</span>
            </button>
            <button
              onClick={() => setFilter('videos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                filter === 'videos'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-[#C87D55]" />
              <span>{t('فيديوهات', 'Videos')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid of gallery items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isVideo = item.mediaType === 'video';
          const title = language === 'ar' ? item.titleAr : item.titleEn || item.titleAr;
          const caption = language === 'ar'
            ? item.captionAr || item.descriptionAr
            : item.captionEn || item.descriptionEn || item.captionAr;
          
          const client = item.clientNameAr || item.clientName || item.clientNameEn;
          const loc = item.location || item.city;
          const allImages = Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.mediaUrl];
          const hasMultiplePhotos = allImages.length > 1;

          if (isVideo) {
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
              >
                <div className="p-3 bg-slate-900 text-white rounded-t-3xl">
                  <VideoPlayer videoUrl={item.mediaUrl} title={title} />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap text-[11px] mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 font-bold border border-rose-200">
                        <Video className="w-3 h-3" />
                        <span>{t('فيديو توثيقي', 'Video Doc')}</span>
                      </span>
                      {client && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                          <Building2 className="w-3 h-3 text-[#C87D55]" />
                          <span>{client}</span>
                        </span>
                      )}
                      {loc && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">
                          <MapPin className="w-3 h-3 text-amber-600" />
                          <span>{loc}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{title}</h3>
                    {caption && (
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
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
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image with hover zoom & inspect button */}
              <div
                onClick={() => openLightboxForItem(item, 0)}
                className="relative aspect-[4/3] bg-slate-900 overflow-hidden cursor-pointer"
                title={t('انقر لتكبير وتصفح الصور', 'Click to enlarge and browse photos')}
              >
                <img
                  src={allImages[0]}
                  alt={title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>
                
                {/* Badges on Top */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                  {hasMultiplePhotos ? (
                    <div className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md border border-white/10">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>{allImages.length} {t('صور', 'Photos')}</span>
                    </div>
                  ) : (
                    <div className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md border border-white/10">
                      <ImageIcon className="w-3.5 h-3.5 text-[#C87D55]" />
                      <span>{t('صورة ميدانية', 'Field Photo')}</span>
                    </div>
                  )}

                  {item.videoUrl && (
                    <span className="px-2.5 py-1 rounded-xl bg-rose-600/90 text-white text-[11px] font-bold flex items-center gap-1 shadow-md">
                      <Video className="w-3 h-3" />
                      <span>{t('فيديو', 'Video')}</span>
                    </span>
                  )}
                </div>

                {/* Inspect Action Hover Overlay with cursor-pointer */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                  <div className="px-4 py-2 rounded-2xl bg-[#C87D55] text-white text-xs font-bold flex items-center gap-2 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all">
                    <Maximize2 className="w-4 h-4" />
                    <span>{hasMultiplePhotos ? t('تصفح المعرض الكامل', 'Browse Full Album') : t('تكبير وفحص الصورة', 'Enlarge & Inspect')}</span>
                  </div>
                </div>
              </div>

              {/* Caption and description info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  {/* Client & City Badges */}
                  {(client || loc) && (
                    <div className="flex items-center gap-2 flex-wrap text-[11px] mb-2">
                      {client && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-medium border border-slate-200">
                          <Building2 className="w-3 h-3 text-[#C87D55]" />
                          <span>{client}</span>
                        </span>
                      )}
                      {loc && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-medium border border-amber-200/80">
                          <MapPin className="w-3 h-3 text-amber-600" />
                          <span>{loc}</span>
                        </span>
                      )}
                    </div>
                  )}

                  <h3
                    onClick={() => openLightboxForItem(item, 0)}
                    className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-[#C87D55] transition cursor-pointer"
                  >
                    {title}
                  </h3>

                  {caption ? (
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      {caption}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-2 italic">
                      {t('عمل موثق بواسطة فريق العريقي إنفركول الهندسي', 'Work verified by AL-ARRIQI INVERCOOL engineering team')}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#C87D55]" />
                    <span>{item.category || sectionTitle || t('أعمال وورش', 'Field Work')}</span>
                  </span>
                  <button
                    onClick={() => openLightboxForItem(item, 0)}
                    className="text-[#C87D55] font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>{t('عرض بالحجم الكامل', 'Full Size')}</span>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upgraded Modal Lightbox */}
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
