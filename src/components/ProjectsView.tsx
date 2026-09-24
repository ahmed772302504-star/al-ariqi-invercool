import React, { useState } from 'react';
import { useApp } from '../context';
import { Project } from '../types';
import {
  Briefcase,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
  ExternalLink,
  Filter,
  Search,
  Building,
  Sparkles,
  X
} from 'lucide-react';

interface ProjectsProps {
  openQuoteModal: () => void;
}

export const ProjectsView: React.FC<ProjectsProps> = ({ openQuoteModal }) => {
  const { lang, t, projects, governates } = useApp();

  const [selectedGov, setSelectedGov] = useState('all');
  const [selectedClientType, setSelectedClientType] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = projects.filter((p) => {
    if (selectedGov !== 'all' && p.governate !== selectedGov) return false;
    if (selectedClientType !== 'all' && p.clientType !== selectedClientType) return false;
    return true;
  });

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3E62]/10 border border-[#1E3E62]/30 text-xs font-bold text-[#1E3E62]">
            <Building className="w-3.5 h-3.5" />
            <span>{t('إنجازات هندسية رائدة في كافة المحافظات اليمنية', 'Leading Engineering Achievements Across Yemen')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B192C]">
            {t('سجل المشاريع والأعمال المنفذة', 'Completed Engineering Projects')}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t(
              'نفخر بتنفيذ أضخم مشاريع التكييف المركزي وأنظمة VRF وغرف التبريد وتمديد مجاري الهواء (Ducting) لكبرى المستشفيات، الفنادق، المصانع، والمباني التجارية والسكنية في اليمن.',
              'Proudly engineered and installed major HVAC systems, VRF solutions, cold chain storage and ducted air networks for hospitals, hotels, factories and residences.'
            )}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-500 shrink-0">{t('المحافظة:', 'Governate:')}</span>
            <button
              onClick={() => setSelectedGov('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                selectedGov === 'all' ? 'bg-[#0B192C] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t('كافة المحافظات', 'All Regions')}
            </button>
            {['صنعاء', 'عدن', 'تعز', 'مأرب', 'الحديدة', 'حضرموت'].map((gov) => (
              <button
                key={gov}
                onClick={() => setSelectedGov(gov)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                  selectedGov === gov ? 'bg-[#0B192C] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {gov}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">{t('القطاع:', 'Sector:')}</span>
            <select
              value={selectedClientType}
              onChange={(e) => setSelectedClientType(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800"
            >
              <option value="all">{t('كافة القطاعات', 'All Sectors')}</option>
              <option value="commercial">{t('تجاري ومكاتب', 'Commercial & Offices')}</option>
              <option value="hospital">{t('مستشفيات وطبي', 'Hospitals & Medical')}</option>
              <option value="hotel">{t('فنادق وضيافة', 'Hotels & Hospitality')}</option>
              <option value="industrial">{t('صناعي ومستودعات', 'Industrial & Warehouses')}</option>
              <option value="residential">{t('سكني وفلل', 'Residential & Villas')}</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:border-[#C87D55]/60 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative aspect-video bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setSelectedProject(item)}>
                <img
                  src={item.images[0] || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?q=80&w=800&auto=format&fit=crop'}
                  alt={item.titleAr}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                  <span className="bg-[#0B192C]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow backdrop-blur-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C87D55]" />
                    <span>{item.governate} - {item.city}</span>
                  </span>
                </div>
                {item.executionDate && (
                  <div className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3">
                    <span className="bg-black/60 text-slate-200 text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                      {item.executionDate}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#A85D35] bg-[#C87D55]/10 px-2 py-0.5 rounded">
                    {item.category}
                  </span>

                  <h3
                    className="text-base font-bold text-slate-900 group-hover:text-[#C87D55] transition-colors cursor-pointer line-clamp-1"
                    onClick={() => setSelectedProject(item)}
                  >
                    {lang === 'ar' ? item.titleAr : item.titleEn}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {lang === 'ar' ? item.descAr : item.descEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  {item.systemsUsed && (
                    <div className="text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">{t('الأنظمة المنفذة:', 'Systems:')}</span> {item.systemsUsed}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setSelectedProject(item)}
                      className="text-xs font-bold text-[#0B192C] hover:text-[#C87D55] flex items-center gap-1 transition-colors"
                    >
                      <span>{t('عرض تفاصيل المشروع', 'Project Details')}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={openQuoteModal}
                      className="text-[11px] font-semibold text-[#A85D35] hover:underline"
                    >
                      {t('طلب مشروع مماثل', 'Request Similar')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Details Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <img
                  src={selectedProject.images[0] || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?q=80&w=800&auto=format&fit=crop'}
                  alt={selectedProject.titleAr}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-3 right-3 rtl:right-auto rtl:left-3 w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#A85D35]">
                    <span>{selectedProject.governate}</span>
                    <span>•</span>
                    <span>{selectedProject.category}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {lang === 'ar' ? selectedProject.titleAr : selectedProject.titleEn}
                  </h2>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'ar' ? selectedProject.descAr : selectedProject.descEn}
                </p>

                {/* Additional Images Carousel / Gallery if exists */}
                {selectedProject.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {selectedProject.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt=""
                        className="rounded-lg h-20 w-full object-cover border border-slate-200"
                      />
                    ))}
                  </div>
                )}

                {/* Services Provided Badges */}
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-700 block mb-2">{t('الأعمال الهندسية المنجزة:', 'Scope of Work Delivered:')}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(lang === 'ar' ? selectedProject.servicesProvidedAr : selectedProject.servicesProvidedEn).map((srv, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-800 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-slate-200">
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-mono">
                    {t('تاريخ الإنجاز:', 'Completion:')} {selectedProject.executionDate}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      openQuoteModal();
                    }}
                    className="px-5 py-2 rounded-xl bg-[#C87D55] hover:bg-[#A85D35] text-white text-xs font-bold transition-colors"
                  >
                    {t('طلب دراسة لمشروع مماثل', 'Quote a Similar Project')}
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
