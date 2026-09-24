import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/api.js';
import { Wrench, CheckCircle2, Phone, MessageCircle, AlertTriangle, Upload, X, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { generateWhatsAppUrl } from '../components/common/FloatingContact.js';

interface RequestServicePageProps {
  navigate: (route: string) => void;
}

export const RequestServicePage: React.FC<RequestServicePageProps> = ({ navigate }) => {
  const { language, t } = useLanguage();
  const [governates, setGovernates] = useState<string[]>([]);
  const [servicesList, setServicesList] = useState<string[]>([]);

  // Form State
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [governate, setGovernate] = useState('صنعاء');
  const [city, setCity] = useState('');
  const [serviceType, setServiceType] = useState('صيانة تكييف مركزي');
  const [equipmentType, setEquipmentType] = useState('تكييف مركزي');
  const [problemDesc, setProblemDesc] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'emergency'>('normal');
  const [images, setImages] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    api.getGovernates().then((govs) => {
      setGovernates(govs);
      if (govs.length > 0) setGovernate(govs[0]);
    });
    api.getServices().then((srvs) => {
      setServicesList(srvs.map((s) => s.titleAr));
    });
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(t('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت', 'Image size must not exceed 5MB'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target?.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!clientName.trim() || !phone.trim() || !problemDesc.trim()) {
      setErrorMessage(t('يرجى ملء جميع الحقول المطلوبة', 'Please fill in all required fields'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitMaintenanceRequest({
        clientName: clientName.trim(),
        phone: phone.trim(),
        governate,
        city: city.trim() || governate,
        serviceType,
        equipmentType,
        problemDesc: problemDesc.trim(),
        priority,
        images
      });

      setSubmittedRef(res.requestNumber);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0B192C] text-white p-8 rounded-3xl border border-slate-800 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3E62] text-[#C87D55] text-xs font-bold">
          <Wrench className="w-3.5 h-3.5" />
          <span>{t('نموذج طلب خدمة صيانة معتمد', 'Maintenance Request Portal')}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">
          {t('طلب خدمة صيانة وفحص هندسي', 'Request Maintenance & Diagnosis')}
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          {t(
            'سجل طلب صيانة لمنشأتك أو منزلك في أي محافظة يمنية، وسيتواصل معك مهندسونا فوراً لتأكيد الموعد ومعاينة المشكلة.',
            'Submit a maintenance request across any Yemen governorate. Our engineering team will contact you promptly to schedule diagnosis.'
          )}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {submittedRef ? (
          /* Success Screen */
          <motion.div
            key="service-success"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 24,
              duration: 0.5,
            }}
            className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Background Decorative Glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#C87D55]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Animated Checkmark Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 18,
                delay: 0.12,
              }}
              className="relative w-20 h-20 mx-auto flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: [1, 1.45, 1], opacity: [0.6, 0, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full bg-emerald-400"
              />
              <div className="relative w-18 h-18 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 border-2 border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="space-y-2"
            >
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {t('تم استلام طلبك بنجاح!', 'Request Submitted Successfully!')}
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                {t('شكراً لثقتك بشركة العريقي إنفركول. تم قيد طلبك برقم المرجع أدناه:', 'Thank you for choosing AL-ARRIQI INVERCOOL. Your reference number is:')}
              </p>

              {/* Reference Badge */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.35, type: 'spring', stiffness: 350, damping: 20 }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#0B192C] text-[#C87D55] font-mono font-black text-xl tracking-wider shadow-lg my-2 border border-[#C87D55]/30"
              >
                <Sparkles className="w-4 h-4 text-[#C87D55] animate-pulse" />
                <span>{submittedRef}</span>
              </motion.div>

              <p className="text-xs text-slate-500">
                {t('احتفظ بهذا الرقم لمتابعة حالة الطلب مع خدمة العملاء.', 'Keep this reference number to follow up with support.')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto space-y-3"
            >
              <div className="text-xs text-slate-500">{t('للتواصل والمتابعة المباشرة والسريعة:', 'Direct Follow-Up:')}</div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={generateWhatsAppUrl({
                    type: priority === 'emergency' ? 'emergency' : 'maintenance',
                    lang: language === 'en' ? 'en' : 'ar',
                    referenceNumber: submittedRef || undefined,
                    customerName: clientName || undefined,
                    phone: phone || undefined,
                    city: `${governate}${city ? ` - ${city}` : ''}`,
                    equipmentType,
                    details: `${serviceType}${problemDesc ? ` (${problemDesc})` : ''}`,
                    urgency: priority,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{t('متابعة الطلب عبر واتساب (770931413)', 'Follow up on WhatsApp (770931413)')}</span>
                </a>

                <a
                  href="tel:770931413"
                  className="px-5 py-2.5 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  <Phone className="w-4 h-4 text-[#C87D55]" />
                  <span className="dir-ltr font-mono">770931413</span>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="pt-2"
            >
              <button
                type="button"
                onClick={() => {
                  setSubmittedRef(null);
                  setProblemDesc('');
                  setImages([]);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors active:scale-95"
              >
                <RotateCcw className="w-4 h-4 text-[#C87D55]" />
                <span>{t('تقديم طلب صيانة آخر', 'Submit another request')}</span>
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* Form */
          <motion.form
            key="service-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg space-y-6"
          >
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('اسم العميل أو اسم المنشأة *', 'Client / Facility Name *')}
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder={t('مثال: شركة النور / م. خالد', 'e.g. Al-Noor Co. / Eng. Khaled')}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('رقم الهاتف للتواصل *', 'Phone Number *')}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="770000000"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm dir-ltr text-start font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('المحافظة (الجمهورية اليمنية) *', 'Governorate (Yemen) *')}
              </label>
              <select
                value={governate}
                onChange={(e) => setGovernate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm font-medium"
              >
                {governates.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('المدينة / الحي / العنوان التفصيلي', 'City / District / Address')}
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={t('مثال: شارع الستين، بالقرب من...', 'e.g. 60th Street, near...')}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('نوع الخدمة المطلوبة', 'Service Type')}
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm font-medium"
              >
                <option value="صيانة تكييف مركزي">{t('صيانة تكييف مركزي', 'Central AC Maintenance')}</option>
                <option value="صيانة غرف تبريد">{t('صيانة غرف تبريد وتجميد', 'Cold Rooms Maintenance')}</option>
                <option value="صيانة مكيفات سبليت ودولابي">{t('صيانة مكيفات سبليت / دولابي', 'Split/Floor AC Maintenance')}</option>
                <option value="فحص تسريب وشحن فريون">{t('فحص تسريب وشحن فريون', 'Leak Detection & Gas Refill')}</option>
                <option value="تغيير وتركيب كمبروسر">{t('تغيير وتركيب كمبروسر', 'Compressor Replacement')}</option>
                <option value="عقد صيانة وقائية دورية">{t('عقد صيانة دورية سنوي', 'Annual Maintenance Contract')}</option>
                <option value="أخرى">{t('خدمة أخرى', 'Other Service')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('درجة الأولوية والطارئ', 'Priority Level')}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm font-medium"
              >
                <option value="normal">{t('عادي (خلال 24-48 ساعة)', 'Normal (24-48h)')}</option>
                <option value="urgent">{t('عاجل (خلال اليوم)', 'Urgent (Same day)')}</option>
                <option value="emergency">{t('طوارئ فورية (مستشفى / مخازن تبريد)', 'Emergency (Immediate Dispatch)')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t('وصف العطل أو الأعراض الملاحظة *', 'Problem Description *')}
            </label>
            <textarea
              required
              rows={4}
              value={problemDesc}
              onChange={(e) => setProblemDesc(e.target.value)}
              placeholder={t('مثال: المكيف يخرج هواء حار، صوت غير طبيعي بالكمبروسر، تسريب ماء، توقف المفتاح الكهربائي...', 'Describe the issue: cooling stopped, noise, gas leak, thermostat trip...')}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm leading-relaxed"
            ></textarea>
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              {t('إرفاق صور للجهاز أو العطل أو لوحة البيانات (اختياري)', 'Attach Photos of Unit or Error Code (Optional)')}
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="cursor-pointer px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#C87D55] bg-slate-50 hover:bg-slate-100 transition flex items-center gap-2 text-xs font-bold text-slate-700">
                <Upload className="w-4 h-4 text-[#C87D55]" />
                <span>{t('رفع صور (JPG, PNG)', 'Upload Photos')}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {images.map((img, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <img src={img} alt="upload" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 end-1 bg-rose-600 text-white rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: submitting ? 1 : 1.01 }}
            whileTap={{ scale: submitting ? 1 : 0.99 }}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C87D55] to-[#B86B3E] hover:from-[#d97742] hover:to-[#C87D55] disabled:bg-slate-400 text-white font-black text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t('جاري تسجيل الطلب...', 'Submitting...')}</span>
              </>
            ) : (
              <span>{t('تأكيد وإرسال طلب الصيانة', 'Submit Maintenance Request')}</span>
            )}
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
    </div>
  );
};
