import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import { useSettings } from '../../context/SettingsContext.js';
import { api } from '../../services/api.js';
import { Settings, Save, CheckCircle2, AlertCircle, Phone, MessageCircle, Code2, Globe } from 'lucide-react';

export const AdminSettingsTab: React.FC = () => {
  const { t } = useLanguage();
  const { settings: globalSettings, updateSettings } = useSettings();
  const [settings, setSettings] = useState<any>(globalSettings || null);
  const [loading, setLoading] = useState(!globalSettings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (globalSettings) {
      setSettings(globalSettings);
      setLoading(false);
    } else {
      api.getSettings()
        .then(setSettings)
        .finally(() => setLoading(false));
    }
  }, [globalSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');

    try {
      const res = await updateSettings(settings);
      if (res?.settings) {
        setSettings(res.settings);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500">{t('جاري التحميل...', 'Loading...')}</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{t('إعدادات وهوية الشركة وقنوات التواصل', 'Company & Contact Settings')}</h2>
        <p className="text-xs text-slate-500">{t('تعديل أرقام الهواتف الرسمية، الواتساب، والروابط - تنعكس فورياً في الموقع والتطبيق', 'Edit official numbers, WhatsApp channels, and metadata across the app')}</p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t('تم حفظ وتحديث إعدادات الشركة بنجاح!', 'Settings updated successfully!')}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-sm">
        {/* Section 1: Company Identity */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-2 h-2 rounded-full bg-[#C87D55]"></span>
            <span>هوية الشركة والاسم التجاري</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">اسم الشركة بالعربي</label>
              <input
                type="text"
                value={settings?.companyNameAr || ''}
                onChange={(e) => setSettings({ ...settings, companyNameAr: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">اسم الشركة بالإنجليزي</label>
              <input
                type="text"
                value={settings?.companyNameEn || ''}
                onChange={(e) => setSettings({ ...settings, companyNameEn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">العنوان والمقر في اليمن</label>
              <input
                type="text"
                value={settings?.addressAr || ''}
                onChange={(e) => setSettings({ ...settings, addressAr: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Official Contact Channels */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-2 h-2 rounded-full bg-[#C87D55]"></span>
            <span>قنوات الاتصال الرسمية للشركة (يجب أن تظل 770931413 كافتراضي)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">هاتف الشركة الرسمي للاتصال</label>
              <input
                type="text"
                value={settings?.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono focus:outline-none focus:border-[#C87D55]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">رقم واتساب الشركة للدردشة</label>
              <input
                type="text"
                value={settings?.whatsapp || ''}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono focus:outline-none focus:border-[#C87D55]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">البريد الإلكتروني للشركة</label>
              <input
                type="email"
                value={settings?.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono focus:outline-none focus:border-[#C87D55]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">رابط صفحة فيسبوك</label>
              <input
                type="text"
                value={settings?.facebookUrl || ''}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] focus:outline-none focus:border-[#C87D55]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Developer Info (Requirement 40, 84, 102) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Code2 className="w-4 h-4 text-[#C87D55]" />
            <span>بيانات المطور البرمجي (مستقلة وغير قابلة للخلط مع أرقام الشركة)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">اسم المطور</label>
              <input
                type="text"
                value={settings?.developerNameAr || ''}
                onChange={(e) => setSettings({ ...settings, developerNameAr: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">هاتف المطور 1</label>
              <input
                type="text"
                value={settings?.developerPhone1 || ''}
                onChange={(e) => setSettings({ ...settings, developerPhone1: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono focus:outline-none focus:border-[#C87D55]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">هاتف المطور 2</label>
              <input
                type="text"
                value={settings?.developerPhone2 || ''}
                onChange={(e) => setSettings({ ...settings, developerPhone2: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono focus:outline-none focus:border-[#C87D55]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] disabled:bg-slate-300 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#C87D55]" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ وتطبيق الإعدادات فوراً'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
