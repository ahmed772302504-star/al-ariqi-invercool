import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/api.js';
import { Project } from '../types.js';
import { Lightbox } from '../components/common/Lightbox.js';
import { VideoPlayer } from '../components/common/VideoPlayer.js';
import {
  Building,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileText,
  MessageCircle
} from 'lucide-react';

interface ProjectDetailPageProps {
  slug: string;
  navigate: (route: string, param?: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ slug, navigate }) => {
  const { language, t } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (slug) {
      api.getProject(slug)
        .then(setProject)
        .catch(() => setProject(null))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500">{t('جاري التحميل...', 'Loading...')}</div>;
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">{t('المشروع غير موجود', 'Project not found')}</h2>
        <button onClick={() => navigate('projects')} className="text-sm font-bold text-[#C87D55]">
          {t('العودة لكافة المشاريع', 'Back to projects')}
        </button>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back link */}
      <button
        onClick={() => navigate('projects')}
        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#C87D55] transition"
      >
        {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span>{t('العودة لكافة المشاريع المنفذة', 'Back to all projects')}</span>
      </button>

      {/* Main card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl p-6 sm:p-10 space-y-8">
        {/* Title & Meta */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-[#0B192C] text-[#C87D55] font-bold">
              {project.category}
            </span>
            {(project.clientNameAr || project.clientName) && (
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold flex items-center gap-1.5 border border-slate-200">
                <Building className="w-3.5 h-3.5 text-[#C87D55]" />
                <span>{project.clientNameAr || project.clientName}</span>
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#C87D55]" />
              <span>{project.governate} - {project.city}</span>
            </span>
            {project.executionDate && (
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#C87D55]" />
                <span>{project.executionDate}</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-snug">
            {language === 'ar' ? project.titleAr : project.titleEn}
          </h1>
        </div>

        {/* Image Grid with Lightbox click */}
        {project.images && project.images.length > 0 && (
          <div className="space-y-3">
            <div
              onClick={() => openLightbox(0)}
              className="relative h-80 sm:h-96 rounded-2xl overflow-hidden cursor-zoom-in group shadow-md"
            >
              <img
                src={project.images[0]}
                alt={project.titleAr}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
            </div>

            {project.images.length > 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {project.images.slice(1).map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => openLightbox(idx + 1)}
                    className="relative h-24 rounded-xl overflow-hidden cursor-zoom-in group border border-slate-200"
                  >
                    <img
                      src={img}
                      alt={`prj-${idx}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Project Description */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">{t('نبذة وتفاصيل تنفيذ المشروع', 'Project Scope & Execution Details')}</h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {language === 'ar' ? project.descAr : project.descEn || project.descAr}
          </p>
        </div>

        {/* Video Section if available */}
        {project.videoUrl && (
          <div className="pt-2">
            <VideoPlayer
              videoUrl={project.videoUrl}
              title={language === 'ar' ? project.titleAr : project.titleEn}
            />
          </div>
        )}

        {/* Systems used & Services provided */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
          {project.systemsUsed && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h3 className="text-xs font-bold text-[#C87D55] uppercase">{t('الأنظمة والمعدات المنفذة', 'Installed Systems')}</h3>
              <p className="text-sm font-semibold text-slate-900">{project.systemsUsed}</p>
            </div>
          )}

          {project.servicesProvidedAr && project.servicesProvidedAr.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="text-xs font-bold text-[#C87D55] uppercase">{t('نطاق الأعمال الهندسية', 'Engineering Scope')}</h3>
              <ul className="space-y-1 text-xs text-slate-700">
                {(language === 'ar' ? project.servicesProvidedAr : project.servicesProvidedEn || project.servicesProvidedAr).map((srv, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{srv}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Call to action */}
        <div className="p-6 rounded-2xl bg-[#0B192C] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-start">
            <h3 className="text-base font-bold">{t('هل تخطط لمشروع تكييف أو تبريد مماثل؟', 'Planning a similar HVAC project?')}</h3>
            <p className="text-xs text-slate-300">{t('احصل على دراسة فنية وعرض سعر هندسي مجاني لمنشأتك الآن.', 'Get a free technical consultation and formal quote.')}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('request-quote')}
              className="px-5 py-2.5 rounded-xl bg-[#C87D55] hover:bg-[#B86B3E] text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>{t('طلب عرض سعر لمشروعي', 'Request Quote')}</span>
            </button>
            <a
              href="https://wa.me/967770931413"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition"
              title="محادثة واتساب"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={project.images}
        currentIndex={lightboxIndex}
        onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : project.images.length - 1))}
        onNext={() => setLightboxIndex((prev) => (prev < project.images.length - 1 ? prev + 1 : 0))}
        onSelectIndex={(idx) => setLightboxIndex(idx)}
        title={language === 'ar' ? project.titleAr : project.titleEn}
        clientName={project.clientNameAr || project.clientName}
        location={`${project.governate} - ${project.city}`}
        caption={language === 'ar' ? project.descAr : project.descEn}
        videoUrl={project.videoUrl}
      />
    </div>
  );
};
