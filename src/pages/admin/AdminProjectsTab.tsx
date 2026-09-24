import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import { api } from '../../services/api.js';
import { Project } from '../../types.js';
import {
  Building,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  X,
  Eye,
  AlertCircle,
  MapPin
} from 'lucide-react';
import { ImageUploader } from '../../components/common/ImageUploader.js';

export const AdminProjectsTab: React.FC = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [governates, setGovernates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal / Form state
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadProjects = () => {
    setLoading(true);
    Promise.all([api.getProjects(), api.getGovernates()]).then(([pList, gList]) => {
      setProjects(pList);
      setGovernates(gList);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleEdit = (p: Project) => {
    setCurrentProject({ ...p });
    setIsEditing(true);
    setError('');
  };

  const handleCreateNew = () => {
    setCurrentProject({
      id: '',
      slug: '',
      titleAr: '',
      titleEn: '',
      descAr: '',
      descEn: '',
      governate: 'صنعاء',
      city: 'صنعاء',
      category: 'مشاريع تكييف مركزي',
      clientType: 'commercial',
      systemsUsed: 'أنظمة VRF إنفرتر متطورة',
      executionDate: '2024',
      images: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop'
      ],
      servicesProvidedAr: ['دراسة وتصميم أحمال', 'توريد وتركيب', 'فحص وضبط تشغيل'],
      servicesProvidedEn: ['Design', 'Supply & Installation', 'Commissioning']
    });
    setIsEditing(true);
    setError('');
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`هل أنت متأكد من حذف المشروع: "${title}"؟`)) {
      try {
        await api.deleteProject(id);
        loadProjects();
      } catch (err: any) {
        alert(err.message || 'Failed to delete project');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject?.titleAr || !currentProject?.governate) {
      setError('يرجى ملء اسم المشروع والمحافظة');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (currentProject.id) {
        await api.updateProject(currentProject.id, currentProject);
      } else {
        await api.createProject(currentProject as any);
      }
      setIsEditing(false);
      loadProjects();
    } catch (err: any) {
      setError(err.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const filtered = projects.filter((p) =>
    p.titleAr.toLowerCase().includes(search.toLowerCase()) ||
    p.governate.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t('إدارة سجل المشاريع المنفذة', 'Manage Executed Projects')}</h2>
          <p className="text-xs text-slate-500">{t('توثيق مشاريع التكييف والتبريد المركزية في كافة المحافظات اليمنية', 'Document HVAC and cold storage installations across Yemen')}</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 rounded-xl bg-[#0B192C] text-white hover:bg-[#1E3E62] text-xs font-bold transition flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4 text-[#C87D55]" />
          <span>{t('إضافة مشروع جديد', 'Add New Project')}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('ابحث بالمشروع أو المحافظة...', 'Search project or governorate...')}
          className="w-full ps-9 pe-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#C87D55]"
        />
      </div>

      {/* Projects Table */}
      {loading ? (
        <div className="text-center py-12 text-slate-500">{t('جاري التحميل...', 'Loading...')}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">المشروع</th>
                  <th className="py-3 px-4 text-start">{t('المحافظة والمدينة', 'Location')}</th>
                  <th className="py-3 px-4 text-start">{t('التصنيف', 'Category')}</th>
                  <th className="py-3 px-4 text-start">{t('الأنظمة المستخدمة', 'Systems')}</th>
                  <th className="py-3 px-4 text-center">{t('سنة التنفيذ', 'Year')}</th>
                  <th className="py-3 px-4 text-end">{t('الإجراءات', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <strong className="text-slate-900 block">{p.titleAr}</strong>
                      <span className="text-[11px] text-slate-400">{p.titleEn}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-[#C87D55]" />
                        <span>{p.governate} - {p.city}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {p.systemsUsed || '-'}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      {p.executionDate || '-'}
                    </td>
                    <td className="py-3 px-4 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#0B192C] hover:text-white text-slate-700 transition"
                          title="تعديل"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.titleAr)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isEditing && currentProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {currentProject.id ? 'تعديل بيانات المشروع' : 'إضافة مشروع جديد'}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم المشروع بالعربي *</label>
                  <input
                    type="text"
                    required
                    value={currentProject.titleAr || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, titleAr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم المشروع بالإنجليزي</label>
                  <input
                    type="text"
                    value={currentProject.titleEn || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, titleEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">المحافظة (الجمهورية اليمنية)</label>
                  <select
                    value={currentProject.governate || 'صنعاء'}
                    onChange={(e) => setCurrentProject({ ...currentProject, governate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                  >
                    {governates.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">المدينة / المنطقة</label>
                  <input
                    type="text"
                    value={currentProject.city || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">تصنيف المشروع</label>
                  <select
                    value={currentProject.category || 'مشاريع تكييف مركزي'}
                    onChange={(e) => setCurrentProject({ ...currentProject, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                  >
                    <option value="مشاريع تكييف مركزي">مشاريع تكييف مركزي</option>
                    <option value="غرف ومخازن تبريد">غرف ومخازن تبريد وتجميد</option>
                    <option value="أنظمة VRF تجارية">أنظمة VRF تجارية</option>
                    <option value="مشاريع تهوية ودكت">مشاريع تهوية ودكت</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم العميل / المنشأة (Client Name)</label>
                  <input
                    type="text"
                    value={currentProject.clientName || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, clientName: e.target.value, clientNameAr: e.target.value })}
                    placeholder="مثال: مصنع مياه شملان / شركة الأغذية والمشروبات"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">فئة العميل</label>
                  <select
                    value={currentProject.clientType || 'commercial'}
                    onChange={(e) => setCurrentProject({ ...currentProject, clientType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                  >
                    <option value="commercial">تجاري / شركات ومولات</option>
                    <option value="industrial">صناعي / مصانع ومخازن</option>
                    <option value="residential">سكني / فلل وقصور</option>
                    <option value="government">حكومي ومؤسسي</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الأنظمة المنفذة</label>
                  <input
                    type="text"
                    value={currentProject.systemsUsed || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, systemsUsed: e.target.value })}
                    placeholder="مثال: 4 وحدات VRF إنفرتر + شبكة دكت مجلفن"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">تاريخ / سنة الإنجاز</label>
                  <input
                    type="text"
                    value={currentProject.executionDate || '2024'}
                    onChange={(e) => setCurrentProject({ ...currentProject, executionDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">وصف المشروع ونطاق الأعمال المنفذة</label>
                <textarea
                  rows={3}
                  value={currentProject.descAr || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, descAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                ></textarea>
              </div>

              <div>
                <ImageUploader
                  label="الصورة الرئيسية للمشروع"
                  value={(currentProject.images && currentProject.images[0]) || ''}
                  onChange={(url) => {
                    const existing = currentProject.images ? [...currentProject.images] : [];
                    if (url) {
                      existing[0] = url;
                    } else {
                      existing.shift();
                    }
                    setCurrentProject({ ...currentProject, images: existing });
                  }}
                  aspectHint="صورة بارزة للمشروع أو الموقع (يتم الضغط والتحسين التلقائي)"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  رابط مقطع فيديو توثيقي للمشروع (YouTube أو Vimeo أو MP4)
                </label>
                <input
                  type="url"
                  value={currentProject.videoUrl || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=... أو https://.../project-video.mp4"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] font-mono text-xs"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  يمكنك ربط فيديو يعرض تفاصيل تركيب شبكة التكييف أو تنفيذ غرف التبريد بالمشروع
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  روابط صور إضافية للمشروع (اكتب كل رابط بسطر جديد)
                </label>
                <textarea
                  rows={3}
                  value={(currentProject.images || []).join('\n')}
                  onChange={(e) =>
                    setCurrentProject({
                      ...currentProject,
                      images: e.target.value.split('\n').filter((l) => l.trim().length > 0)
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] font-mono text-[11px]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-[#C87D55] hover:bg-[#B86B3E] text-white font-bold shadow"
                >
                  {saving ? 'جاري الحفظ...' : 'حفظ بيانات المشروع'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
