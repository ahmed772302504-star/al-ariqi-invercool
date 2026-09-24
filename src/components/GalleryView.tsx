import React, { useState } from 'react';
import { useApp } from '../context';
import { GalleryItem } from '../types';
import {
  Image as ImageIcon,
  Play,
  Filter,
  Eye,
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const GalleryView: React.FC = () => {
  const { lang, t, gallery } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeMedia, setActiveMedia] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'مشاريع تكييف', labelAr: 'مشاريع تكييف', labelEn: 'HVAC Projects' },
    { id: 'غرف تبريد', labelAr: 'غرف تبريد', labelEn: 'Cold Rooms' },
    { id: 'أعمال دكت وتهوية', labelAr: 'دكت وتهوية', labelEn: 'Ductwork & Ventilation' },
    { id: 'صيانة وفحص', labelAr: 'صيانة وفحص', labelEn: 'Maintenance & Service' },
  ];

  const filtered = gallery.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B192C]/10 border border-[#0B192C]/20 text-xs font-bold text-[#0B192C]">
            <ImageIcon className="w-3.5 h-3.5 text-[#C87D55]" />
            <span>{t('معرض الصور الميدانية والفيديوهات الحية لأعمالنا', 'Field Work Photo & Video Gallery')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B192C]">
            {t('معرض الأعمال والتوثيق الميداني', 'Field Installation & Gallery')}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t(
              'شاهد دقة التنفيذ الهندسي، عزل مجاري الهواء، تلحيم النحاس عالي الجودة، وشبكات التبريد المركزي وغرف التجميد التي نفذتها كوادرنا في مختلف المحافظات.',
              'Inspect our precision engineering, clean duct insulation, professional copper brazing, and VRF chiller networks across Yemeni sites.'
            )}
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[#C87D55] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {lang === 'ar' ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveMedia(item)}
              className="group relative aspect-4/3 bg-slate-900 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200"
            >
              <img
                src={item.thumbnailUrl || item.mediaUrl}
                alt={item.titleAr}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold bg-[#C87D55] px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  {item.mediaType === 'video' ? (
                    <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 fill-white" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
                      <Eye className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold leading-snug">
                    {lang === 'ar' ? item.titleAr : item.titleEn}
                  </h4>
                  {item.descriptionAr && (
                    <p className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">
                      {lang === 'ar' ? item.descriptionAr : item.descriptionEn}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeMedia && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full bg-[#0B192C] text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
              <button
                onClick={() => setActiveMedia(null)}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video bg-black flex items-center justify-center">
                {activeMedia.mediaType === 'video' ? (
                  <iframe
                    src={activeMedia.mediaUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={activeMedia.titleAr}
                  ></iframe>
                ) : (
                  <img
                    src={activeMedia.mediaUrl}
                    alt={activeMedia.titleAr}
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>

              <div className="p-6 bg-[#060E18] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#C87D55]">{activeMedia.category}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {lang === 'ar' ? activeMedia.titleAr : activeMedia.titleEn}
                  </h3>
                  {activeMedia.descriptionAr && (
                    <p className="text-xs text-slate-400 mt-1">
                      {lang === 'ar' ? activeMedia.descriptionAr : activeMedia.descriptionEn}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setActiveMedia(null)}
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold self-end sm:self-auto"
                >
                  {t('إغلاق المعاينة', 'Close Preview')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
