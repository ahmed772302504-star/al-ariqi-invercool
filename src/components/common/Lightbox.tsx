import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Building2, Image as ImageIcon, Video, ExternalLink } from 'lucide-react';

export interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onPrev?: () => void;
  onNext?: () => void;
  onSelectIndex?: (index: number) => void;
  title?: string;
  clientName?: string;
  location?: string;
  caption?: string;
  videoUrl?: string;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onPrev,
  onNext,
  onSelectIndex,
  title,
  clientName,
  location,
  caption,
  videoUrl
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        if (onPrev) onPrev();
      }
      if (e.key === 'ArrowRight') {
        if (onNext) onNext();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 animate-in fade-in duration-200 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Bar: Title, Badges, Close Button */}
      <div className="w-full max-w-6xl flex items-center justify-between gap-3 text-white z-50 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {title && (
              <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-md">
                {title}
              </h3>
            )}
            {clientName && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-slate-800/90 text-emerald-400 border border-emerald-500/30">
                <Building2 className="w-3 h-3" />
                <span>{clientName}</span>
              </span>
            )}
            {location && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-slate-800/90 text-amber-300 border border-amber-500/30">
                <MapPin className="w-3 h-3" />
                <span>{location}</span>
              </span>
            )}
          </div>
          {caption && (
            <p className="text-xs text-slate-300 mt-1 line-clamp-1 max-w-2xl font-light">
              {caption}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {videoUrl && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg"
              title="مشاهدة الفيديو"
            >
              <Video className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">فيديو العمل</span>
            </a>
          )}
          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-full bg-slate-800/80 hover:bg-rose-600 text-slate-200 hover:text-white transition shadow-xl cursor-pointer"
            aria-label="إغلاق المعاينة"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Main Preview Center Area */}
      <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-auto overflow-hidden px-1 sm:px-12">
        {/* Navigation arrow Left */}
        {images.length > 1 && onPrev && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute start-1 sm:start-2 top-1/2 -translate-y-1/2 text-white hover:text-white p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-[#C87D55] transition shadow-2xl z-50 cursor-pointer active:scale-90"
            aria-label="الصورة السابقة"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        )}

        {/* The active media (image or video) */}
        <div className="relative max-h-[72vh] flex items-center justify-center">
          {currentImage?.startsWith('data:video') || currentImage?.match(/\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i) ? (
            <video
              src={currentImage}
              controls
              autoPlay
              playsInline
              className="max-w-full max-h-[72vh] rounded-2xl shadow-2xl ring-1 ring-white/10 bg-black"
            >
              متصفحك لا يدعم تشغيل هذا الفيديو
            </video>
          ) : (
            <img
              src={currentImage}
              alt={title || 'معاينة العمل'}
              className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-2xl ring-1 ring-white/10"
              loading="lazy"
            />
          )}
        </div>

        {/* Navigation arrow Right */}
        {images.length > 1 && onNext && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute end-1 sm:end-2 top-1/2 -translate-y-1/2 text-white hover:text-white p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-[#C87D55] transition shadow-2xl z-50 cursor-pointer active:scale-90"
            aria-label="الصورة التالية"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnails & Image Counter */}
      <div className="w-full max-w-3xl flex flex-col items-center gap-2 shrink-0 z-50">
        {images.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-2 custom-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectIndex && onSelectIndex(idx)}
                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'border-[#C87D55] scale-105 shadow-lg shadow-[#C87D55]/30'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        <div className="text-slate-400 text-xs font-mono font-medium flex items-center gap-2">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>
    </div>
  );
};
