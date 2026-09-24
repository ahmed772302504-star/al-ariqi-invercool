import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import { api } from '../../services/api.js';
import { Service } from '../../types.js';
import {
  Wrench,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  X,
  Eye,
  AlertCircle
} from 'lucide-react';
import { ImageUploader } from '../../components/common/ImageUploader.js';

export const AdminServicesTab: React.FC = () => {
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal / Form state
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadServices = () => {
    setLoading(true);
    api.getServices()
      .then(setServices)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleEdit = (service: Service) => {
    setCurrentService({ ...service });
    setIsEditing(true);
    setError('');
  };

  const handleCreateNew = () => {
    setCurrentService({
      id: '',
      titleAr: '',
      titleEn: '',
      slug: '',
      descAr: '',
      descEn: '',
      contentAr: '',
      contentEn: '',
      category: 'أنظمة التكييف المركزي',
      icon: 'Wind',
      featuresAr: [],
      featuresEn: [],
      benefitsAr: [],
      benefitsEn: [],
      order: services.length + 1,
      isActive: true
    });
    setIsEditing(true);
    setError('');
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`هل أنت متأكد من حذف الخدمة: "${title}"؟`)) {
      try {
        await api.deleteService(id);
        loadServices();
      } catch (err: any) {
        alert(err.message || 'Failed to delete service');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentService?.titleAr || !currentService?.descAr) {
      setError('يرجى ملء الحقول الأساسية (العنوان والوصف المختصر)');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (currentService.id) {
        await api.updateService(currentService.id, currentService);
      } else {
        await api.createService(currentService as any);
      }
      setIsEditing(false);
      loadServices();
    } catch (err: any) {
      setError(err.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const filtered = services.filter((s) =>
    s.titleAr.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t('إدارة الخدمات الهندسية', 'Manage Engineering Services')}</h2>
          <p className="text-xs text-slate-500">{t('إضافة وتعديل وحذف الخدمات ونطاق العمل الميداني', 'Add, edit, or remove services and scope')}</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 rounded-xl bg-[#0B192C] text-white hover:bg-[#1E3E62] text-xs font-bold transition flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4 text-[#C87D55]" />
          <span>{t('إضافة خدمة جديدة', 'Add New Service')}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('ابحث بالاسم أو القسم...', 'Search by name or category...')}
          className="w-full ps-9 pe-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#C87D55]"
        />
      </div>

      {/* Services List Table */}
      {loading ? (
        <div className="text-center py-12 text-slate-500">{t('جاري التحميل...', 'Loading...')}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">#</th>
                  <th className="py-3 px-4 text-start">{t('عنوان الخدمة', 'Service Title')}</th>
                  <th className="py-3 px-4 text-start">{t('القسم / التصنيف', 'Category')}</th>
                  <th className="py-3 px-4 text-center">{t('الحالة', 'Status')}</th>
                  <th className="py-3 px-4 text-end">{t('الإجراءات', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <strong className="text-slate-900 block">{s.titleAr}</strong>
                      <span className="text-[11px] text-slate-400">{s.titleEn}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {s.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {s.isActive !== false ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {t('نشط', 'Active')}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                          {t('معطل', 'Inactive')}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(s)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#0B192C] hover:text-white text-slate-700 transition"
                          title="تعديل"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.titleAr)}
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

      {/* Edit / Add Modal */}
      {isEditing && currentService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {currentService.id ? t('تعديل الخدمة', 'Edit Service') : t('إضافة خدمة جديدة', 'Add New Service')}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600"
              >
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
                  <label className="block font-bold text-slate-700 mb-1">عنوان الخدمة بالعربي *</label>
                  <input
                    type="text"
                    required
                    value={currentService.titleAr || ''}
                    onChange={(e) => setCurrentService({ ...currentService, titleAr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">عنوان الخدمة بالإنجليزي</label>
                  <input
                    type="text"
                    value={currentService.titleEn || ''}
                    onChange={(e) => setCurrentService({ ...currentService, titleEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">القسم / التصنيف</label>
                  <input
                    type="text"
                    value={currentService.category || ''}
                    onChange={(e) => setCurrentService({ ...currentService, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">أيقونة Lucide</label>
                  <input
                    type="text"
                    value={currentService.icon || 'Wind'}
                    onChange={(e) => setCurrentService({ ...currentService, icon: e.target.value })}
                    placeholder="Wind, Wrench, Snowflake, Fan..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] font-mono"
                  />
                </div>
              </div>

              <ImageUploader
                label="صورة الخدمة التوضيحية"
                value={currentService.image || ''}
                onChange={(url) => setCurrentService({ ...currentService, image: url })}
                aspectHint="صورة للأعمال أو المعدات المتعلقة بالخدمة (يتم الضغط والتحسين التلقائي)"
              />

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  رابط فيديو توضيحي للخدمة (YouTube أو Vimeo أو رابط مباشر MP4)
                </label>
                <input
                  type="url"
                  value={currentService.videoUrl || ''}
                  onChange={(e) => setCurrentService({ ...currentService, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=... أو https://.../video.mp4"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] font-mono text-xs"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  يمكنك وضع رابط فيديو من يوتيوب لشرح طريقة عمل الخدمة أو توثيق تركيب الأنظمة
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الوصف المختصر *</label>
                <textarea
                  rows={2}
                  required
                  value={currentService.descAr || ''}
                  onChange={(e) => setCurrentService({ ...currentService, descAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الشرح والتفاصيل الهندسية الكاملة</label>
                <textarea
                  rows={4}
                  value={currentService.contentAr || ''}
                  onChange={(e) => setCurrentService({ ...currentService, contentAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  المميزات والمواصفات (اكتب كل ميزة بسطر جديد)
                </label>
                <textarea
                  rows={3}
                  value={(currentService.featuresAr || []).join('\n')}
                  onChange={(e) =>
                    setCurrentService({
                      ...currentService,
                      featuresAr: e.target.value.split('\n').filter((l) => l.trim().length > 0)
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                ></textarea>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentService.isActive !== false}
                    onChange={(e) => setCurrentService({ ...currentService, isActive: e.target.checked })}
                    className="rounded text-[#C87D55] focus:ring-[#C87D55]"
                  />
                  <span className="font-bold text-slate-700">الخدمة نشطة ومعروضة بالموقع</span>
                </label>
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
                  {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
