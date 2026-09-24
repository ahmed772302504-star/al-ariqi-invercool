import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import { useSettings } from '../../context/SettingsContext.js';
import { api } from '../../services/api.js';
import { ImageUploader } from '../../components/common/ImageUploader.js';
import { Images, Save, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react';

export const AdminSiteImagesTab: React.FC = () => {
  const { t } = useLanguage();
  const { settings: globalSettings, updateSettings } = useSettings();
  const [settings, setSettings] = useState<any>(globalSettings || null);
  const [loading, setLoading] = useState(!globalSettings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const loadSettings = () => {
    setLoading(true);
    api.getSettings()
      .then((data) => {
        setSettings(data);
      })
      .catch((err) => setError(err.message || 'فشل في تحميل بيانات الصور'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (globalSettings) {
      setSettings(globalSettings);
      setLoading(false);
    } else {
      loadSettings();
    }
  }, [globalSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');

    try {
      // updateSettings automatically attaches Cache Buster timestamps, updates LocalStorage,
      // updates React state immediately across Header/Footer/Home/About, and saves to Database!
      const res = await updateSettings(settings);
      if (res?.settings) {
        setSettings(res.settings);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'فشل في حفظ التعديلات');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500">{t('جاري التحميل...', 'Loading...')}</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Images className="w-5 h-5 text-[#C87D55]" />
            <span>{t('إدارة صور وهوية الموقع بالكامل', 'Manage All Site Images & Branding')}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {t(
              'بصفتك المالك، يمكنك هنا استبدال وتعديل ورفع أي صورة في الواجهة الرئيسية (الشعار، العلامة المائية، بنرات الهيرو، وقسم من نحن)',
              'As the owner, upload, change, or replace any image across the website directly'
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={loadSettings}
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>تحديث</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">{t('تم تحديث وتطبيق صور وهوية الموقع فورياً بنجاح!', 'Site images and branding updated successfully!')}</p>
              <p className="text-[11px] text-emerald-700">
                {t(
                  'تم الحفظ في قاعدة البيانات و LocalStorage، وتفعيل مانع الكاش (Cache Buster) وتحديث صور الهيدر والفوتر والواجهة الرئيسية دون الحاجة لإعادة تحميل الصفحة.',
                  'Saved to Database & LocalStorage with active Cache Buster. Re-rendered live across Header, Footer, and Home.'
                )}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold shrink-0 border border-emerald-200">
            {t('تحديث فوري نشط ⚡', 'Live Synced ⚡')}
          </span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Card 1: Official Logo & Identity */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C87D55]"></span>
              <span>1. الشعار الرسمي (Logo) وأيقونة الهوية</span>
            </h3>
            <span className="text-[11px] text-slate-400">يظهر في رأس الموقع وأسفله</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploader
              label="شعار الشركة الرسمي (Logo)"
              value={settings?.logoUrl || '/logo.png'}
              onChange={(url) => setSettings({ ...settings, logoUrl: url })}
              aspectHint="صورة الشعار الكاملة (PNG بخلفية شفافة)"
            />

            <ImageUploader
              label="أيقونة الشعار المربعة (Square Icon)"
              value={settings?.logoIconUrl || '/logo-icon.png'}
              onChange={(url) => setSettings({ ...settings, logoIconUrl: url })}
              aspectHint="تظهر داخل الأيقونات المربعة وشريط التنقل"
            />
          </div>
        </div>

        {/* Card 2: Watermark Logo in Hero Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E3E62]"></span>
              <span>2. الشعار المائي في منتصف واجهة الموقع (Hero Watermark)</span>
            </h3>
            <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              في منتصف الشاشة الرئيسية
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            الشعار المائي الشفاف المتمركز بدقة هندسية في منتصف واجهة الموقع الرئيسية بالخلفية. يمكنك استبداله أو تحديثه هنا بصورة شعار خاصة أو عالية النقاء.
          </p>

          <ImageUploader
            label="صورة الشعار المائي (Watermark Image)"
            value={settings?.watermarkUrl || '/logo.png'}
            onChange={(url) => setSettings({ ...settings, watermarkUrl: url })}
            aspectHint="يفضل شعار PNG مفرّغ عالي الدقة"
          />
        </div>

        {/* Card 3: Hero & About section images */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C87D55]"></span>
              <span>3. صور واجهة الموقع وقسم "من نحن"</span>
            </h3>
            <span className="text-[11px] text-slate-400">بانرات ومشاريع التبريد والتكييف</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploader
              label="صورة بطاقة الهيرو التوضيحية (Hero Feature)"
              value={settings?.heroBannerUrl || ''}
              onChange={(url) => setSettings({ ...settings, heroBannerUrl: url })}
              aspectHint="صورة للأعمال الهندسية أو المعدات في الشاشة الأولى"
              placeholder="اختياري: اترك فارغاً لاستخدام البطاقة الافتراضية"
            />

            <ImageUploader
              label="صورة قسم 'من نحن' والشركة (About Image)"
              value={settings?.aboutImageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop'}
              onChange={(url) => setSettings({ ...settings, aboutImageUrl: url })}
              aspectHint="صورة للمهندسين أو الورشة أو موقع العمل"
            />
          </div>
        </div>

        {/* Card 4: Main Section Interfaces (Air Conditioning, Cold Rooms, Central Refrigeration) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>4. صور واجهات الأقسام الثابتة (خدمات التكييف والتثليج المركزي والأقسام الرئيسية)</span>
            </h3>
            <span className="text-[11px] text-[#C87D55] font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              مطلوبة ومخصصة
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            استبدل وخصص صور واجهات الأقسام الرئيسية في الموقع مثل واجهة التكييف والتثليج المركزي، غرف التبريد، ورش الصيانة، وغيرها. يتم ضغط أي صورة ترفعها تلقائياً للحفاظ على السرعة الفائقة للموقع.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70">
              <ImageUploader
                label="صورة واجهة (خدمات التكييف والتثليج المركزي) *"
                value={settings?.hvacSectionImageUrl || ''}
                onChange={(url) => setSettings({ ...settings, hvacSectionImageUrl: url })}
                aspectHint="الواجهة الرئيسية لخدمات التكييف والتثليج المركزي بموقع الشركة"
                placeholder="https://... أو اضغط لرفع صورة مميزة من استوديو جهازك"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <ImageUploader
                label="صورة واجهة (غرف ومخازن التبريد الكبرى)"
                value={settings?.coldRoomsImageUrl || ''}
                onChange={(url) => setSettings({ ...settings, coldRoomsImageUrl: url })}
                aspectHint="صورة لغرف التبريد الكبرى وعوازل الساندوتش بانل"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <ImageUploader
                label="صورة واجهة (التكييف المركزي التجاري وأنظمة VRF)"
                value={settings?.commercialAircoolImageUrl || ''}
                onChange={(url) => setSettings({ ...settings, commercialAircoolImageUrl: url })}
                aspectHint="صورة لوحدات VRF الخارجية أو أنظمة الدكت المركزي"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <ImageUploader
                label="صورة واجهة (ورش الصيانة وفحص الأعطال الهندسية)"
                value={settings?.maintenanceSectionImageUrl || ''}
                onChange={(url) => setSettings({ ...settings, maintenanceSectionImageUrl: url })}
                aspectHint="صورة لأجهزة التشخيص الهندسي وفنيي الصيانة"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <ImageUploader
                label="صورة واجهة (طوارئ التبريد والدعم الفني 24/7)"
                value={settings?.emergencySupportImageUrl || ''}
                onChange={(url) => setSettings({ ...settings, emergencySupportImageUrl: url })}
                aspectHint="صورة فريق الدعم السريع ومركبات الطوارئ"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <ImageUploader
                label="صورة واجهة (كتالوج الأجهزة والمعدات الاقتصادية)"
                value={settings?.productsCatalogImageUrl || ''}
                onChange={(url) => setSettings({ ...settings, productsCatalogImageUrl: url })}
                aspectHint="صورة معروضات المكيفات وقطع الغيار"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#C87D55]" />
            <div>
              <p className="text-xs font-bold">حفظ واعتماد صور الموقع</p>
              <p className="text-[11px] text-slate-400">يتم تطبيق الصور المحدثة مباشرة على كل زوار الموقع</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#C87D55] to-[#B86B3E] hover:from-[#d97742] hover:to-[#C87D55] disabled:opacity-50 text-white font-bold text-xs shadow-lg transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جاري الحفظ والاعتماد...' : 'حفظ كل الصور الآن'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
