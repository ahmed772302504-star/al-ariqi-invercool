import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/api.js';
import { Project } from '../types.js';
import { Building, MapPin, Search, Calendar, ChevronRight, X, Play } from 'lucide-react';

interface ProjectsPageProps {
  navigate: (route: string, param?: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ navigate }) => {
  const { language, t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [governates, setGovernates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedGov, setSelectedGov] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedClientType, setSelectedClientType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', nameAr: 'كافة التصنيفات', nameEn: 'All Categories' },
    { id: 'مشاريع تكييف مركزي', nameAr: 'تكييف مركزي', nameEn: 'Central AC' },
    { id: 'غرف ومخازن تبريد', nameAr: 'غرف تبريد', nameEn: 'Cold Rooms' },
    { id: 'أنظمة VRF تجارية', nameAr: 'أنظمة VRF', nameEn: 'VRF Systems' },
    { id: 'مشاريع تهوية ودكت', nameAr: 'تهوية ودكت', nameEn: 'Ventilation & Duct' },
  ];

  useEffect(() => {
    Promise.all([
      api.getProjects(),
      api.getGovernates()
    ]).then(([prjs, govs]) => {
      setProjects(prjs);
      setFilteredProjects(prjs);
      setGovernates(govs);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let list = [...projects];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.titleAr.toLowerCase().includes(q) ||
          p.titleEn.toLowerCase().includes(q) ||
          p.descAr.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      );
    }

    if (selectedGov !== 'all') {
      list = list.filter((p) => p.governate === selectedGov);
    }

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedClientType !== 'all') {
      list = list.filter((p) => p.clientType === selectedClientType);
    }

    setFilteredProjects(list);
  }, [projects, searchTerm, selectedGov, selectedCategory, selectedClientType]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGov('all');
    setSelectedCategory('all');
    setSelectedClientType('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header Banner */}
      <div className="bg-[#0B192C] text-white p-8 sm:p-12 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3E62] text-[#C87D55] text-xs font-bold">
            <Building className="w-3.5 h-3.5" />
            <span>{t('سجل الأعمال والمشاريع المنفذة في اليمن', 'Executed Engineering Projects')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            {t('مشاريعنا الهندسية المنفذة', 'Our Completed Projects')}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t(
              'نفخر بتنفيذ مشاريع التكييف والتبريد المركزية وغرف التبريد العملاقة للمستشفيات، المولات، الأبراج التجارية، والمصانع في شتى محافظات الجمهورية اليمنية.',
              'Proudly executing central HVAC, heavy cold storage, and hospital ventilation projects across diverse governorates of Yemen.'
            )}
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('ابحث بالمشروع أو المدينة...', 'Search project or city...')}
              className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#C87D55]"
            />
          </div>

          {/* Governorate */}
          <select
            value={selectedGov}
            onChange={(e) => setSelectedGov(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:border-[#C87D55]"
          >
            <option value="all">{t('كافة محافظات اليمن', 'All Governorates')}</option>
            {governates.map((gov) => (
              <option key={gov} value={gov}>
                {gov}
              </option>
            ))}
          </select>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:border-[#C87D55]"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {language === 'ar' ? c.nameAr : c.nameEn}
              </option>
            ))}
          </select>

          {/* Client Type */}
          <select
            value={selectedClientType}
            onChange={(e) => setSelectedClientType(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:border-[#C87D55]"
          >
            <option value="all">{t('كافة فئات العملاء', 'All Client Types')}</option>
            <option value="commercial">{t('تجاري / شركات ومولات', 'Commercial')}</option>
            <option value="industrial">{t('صناعي / مصانع ومخازن', 'Industrial')}</option>
            <option value="residential">{t('سكني / قصور وفلل', 'Residential')}</option>
            <option value="government">{t('حكومي ومؤسسي', 'Government / Institutional')}</option>
          </select>
        </div>

        {(searchTerm || selectedGov !== 'all' || selectedCategory !== 'all' || selectedClientType !== 'all') && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              {t('نتائج الفلترة:', 'Filtered results:')} <strong>{filteredProjects.length}</strong> {t('مشروع', 'projects')}
            </span>
            <button
              onClick={resetFilters}
              className="text-rose-600 font-bold hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t('إعادة ضبط الفلاتر', 'Reset filters')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">{t('جاري تحميل المشاريع...', 'Loading projects...')}</div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <Building className="w-12 h-12 text-[#C87D55] mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">{t('لا توجد مشاريع مطابقة للاختيار', 'No projects match your filter')}</h3>
          <button onClick={resetFilters} className="px-4 py-2 rounded-xl bg-[#0B192C] text-white text-xs font-bold">
            {t('إظهار كافة المشاريع', 'Show all projects')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate('project-detail', project.slug)}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-[#C87D55] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 bg-slate-900 overflow-hidden">
                  <img
                    src={project.images[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop'}
                    alt={language === 'ar' ? project.titleAr : project.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 start-3 px-3 py-1 rounded-md bg-[#0B192C]/90 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur">
                    <MapPin className="w-3.5 h-3.5 text-[#C87D55]" />
                    <span>{project.governate}</span>
                  </div>
                  <div className="absolute top-3 end-3 flex items-center gap-1.5">
                    {project.images && project.images.length > 1 && (
                      <span className="px-2 py-1 rounded-md bg-black/70 text-white text-[10px] font-bold backdrop-blur">
                        {project.images.length} {t('صور', 'Photos')}
                      </span>
                    )}
                    {project.videoUrl && (
                      <div className="px-2 py-1 rounded-md bg-rose-600 text-white text-[10px] font-bold flex items-center gap-1 shadow">
                        <Play className="w-3 h-3 fill-current" />
                        <span>{t('فيديو', 'Video')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                    <span className="font-bold text-[#C87D55]">{project.category}</span>
                    {(project.clientNameAr || project.clientName) && (
                      <span className="text-[11px] text-slate-600 font-medium bg-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Building className="w-3 h-3 text-[#C87D55]" />
                        <span>{project.clientNameAr || project.clientName}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#C87D55] transition line-clamp-2">
                    {language === 'ar' ? project.titleAr : project.titleEn}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {language === 'ar' ? project.descAr : project.descEn}
                  </p>

                  {project.systemsUsed && (
                    <div className="pt-2 text-xs text-slate-600">
                      <strong>{t('الأنظمة المنفذة:', 'Systems:')}</strong> {project.systemsUsed}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between text-xs font-bold text-[#C87D55]">
                <span>{t('عرض تفاصيل المشروع والصور', 'View Project & Photos')}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
