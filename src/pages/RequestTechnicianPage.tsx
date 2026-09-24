import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/api.js';
import { UserCheck, CheckCircle2, Phone, MessageCircle, AlertTriangle, Calendar, Clock, RotateCcw, Sparkles } from 'lucide-react';
import { generateWhatsAppUrl } from '../components/common/FloatingContact.js';

interface RequestTechnicianPageProps {
  navigate: (route: string) => void;
}

export const RequestTechnicianPage: React.FC<RequestTechnicianPageProps> = ({ navigate }) => {
  const { language, t } = useLanguage();
  const [governates, setGovernates] = useState<string[]>([]);

  // Form
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [governate, setGovernate] = useState('صنعاء');
  const [city, setCity] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [equipmentType, setEquipmentType] = useState('تكييف مركزي');
  const [malfunctionType, setMalfunctionType] = useState('توقف التبريد فجأة');
  const [preferredVisitTime, setPreferredVisitTime] = useState('في أقرب وقت ممكن');
  const [problemDesc, setProblemDesc] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    api.getGovernates().then((govs) => {
      setGovernates(govs);
      if (govs.length > 0) setGovernate(govs[0]);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!clientName.trim() || !phone.trim() || !problemDesc.trim()) {
      setErrorMessage(t('يرجى إكمال البيانات الأساسية', 'Please fill required fields'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitTechnicianRequest({
        clientName: clientName.trim(),
        phone: phone.trim(),
        governate,
        city: city.trim() || governate,
        locationDetails: locationDetails.trim(),
        equipmentType,
        malfunctionType,
        preferredVisitTime,
        problemDesc: problemDesc.trim()
      });

      setSubmittedRef(res.requestNumber);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit technician request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedRef(null);
    setProblemDesc('');
    setLocationDetails('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0B192C] text-white p-8 rounded-3xl border border-slate-800 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3E62] text-[#C87D55] text-xs font-bold">
          <UserCheck className="w-3.5 h-3.5" />
          <span>{t('زيارة ميدانية وفحص شامل', 'Field Diagnosis & Technician Visit')}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">
          {t('اطلب زيارة فني تكييف وتبريد متخصص', 'Book a Certified HVAC Technician')}
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          {t(
            'فنيونا ومهندسونا مجهزون بأحدث أجهزة قياس الغاز والكهرباء لفحص موقعك وإصلاح الأعطال في مختلف محافظات الجمهورية اليمنية.',
            'Our certified technicians are equipped with advanced refrigerant and electrical diagnostic tools to resolve your HVAC issues on-site.'
          )}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {submittedRef ? (
          <motion.div
            key="technician-success"
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
                {t('تم تسجيل طلب زيارة الفني بنجاح!', 'Technician Visit Booked!')}
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                {t(
                  'سيتم الاتصال بك خلال دقائق لتأكيد الموعد وإرسال الفني الأقرب إليك. رقم الطلب المعتمد:',
                  'Our dispatcher will call you shortly to confirm technician arrival. Request #:'
                )}
              </p>

              {/* Reference Badge with spring animation */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.35, type: 'spring', stiffness: 350, damping: 20 }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#0B192C] text-[#C87D55] font-mono font-black text-xl tracking-wider shadow-lg my-2 border border-[#C87D55]/30"
              >
                <Sparkles className="w-4 h-4 text-[#C87D55] animate-pulse" />
                <span>{submittedRef}</span>
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-3 pt-2"
            >
              <a
                href={generateWhatsAppUrl({
                  type: 'technician',
                  lang: language === 'en' ? 'en' : 'ar',
                  referenceNumber: submittedRef || undefined,
                  customerName: clientName || undefined,
                  phone: phone || undefined,
                  city: `${governate}${city ? ` - ${city}` : ''}${locationDetails ? ` (${locationDetails})` : ''}`,
                  equipmentType,
                  issueDescription: `${malfunctionType}${problemDesc ? ` - ${problemDesc}` : ''}`,
                  preferredTime: preferredVisitTime,
                  urgency: malfunctionType.includes('توقف') || malfunctionType.includes('طوارئ') ? 'emergency' : 'urgent',
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{t('تأكيد موعد الفني عبر واتساب (770931413)', 'Confirm Technician on WhatsApp (770931413)')}</span>
              </a>

              <a
                href="tel:770931413"
                className="px-5 py-3 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <Phone className="w-4 h-4 text-[#C87D55]" />
                <span className="dir-ltr font-mono">770931413</span>
              </a>

              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors active:scale-95"
              >
                <RotateCcw className="w-4 h-4 text-[#C87D55]" />
                <span>{t('حجز زيارة فني جديدة', 'Book Another Visit')}</span>
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* Form with Framer Motion */
          <motion.form
            key="technician-form"
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
                {t('اسم العميل الكريم *', 'Your Name *')}
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder={t('مثال: محمد علي', 'e.g. Mohammed Ali')}
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
                {t('المحافظة (اليمن) *', 'Governorate *')}
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
                {t('المدينة والشارع بالتحديد', 'Specific Location / Street')}
              </label>
              <input
                type="text"
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                placeholder={t('مثال: حي الأصبحي، جوار مستشفى...', 'e.g. District, near landmark...')}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('نوع العطل الملاحظ', 'Malfunction Symptom')}
              </label>
              <select
                value={malfunctionType}
                onChange={(e) => setMalfunctionType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm font-medium"
              >
                <option value="توقف التبريد فجأة">{t('توقف التبريد تماماً (يخرج هواء عادي)', 'No cooling at all')}</option>
                <option value="تسريب ماء من الوحدة الداخلية">{t('تسريب ماء من الوحدة الداخلية', 'Water leaking inside')}</option>
                <option value="صوت عالي أو اهتزاز غير طبيعي">{t('صوت عالي أو اهتزاز من الكمبروسر', 'Loud noise or vibration')}</option>
                <option value="فصل القاطع الكهربائي">{t('فصل القاطع الكهربائي فور التشغيل', 'Tripping circuit breaker')}</option>
                <option value="ظهور رمز خطأ بالشاشة">{t('ظهور رمز خطأ (Error Code)', 'Error code on display')}</option>
                <option value="شحن فريون وفحص">{t('فحص تسريب وشحن غاز فريون', 'Gas leak & refill')}</option>
                <option value="فحص شامل">{t('فحص شامل وصيانة وقائية', 'General diagnostic inspection')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('الوقت المفضل لزيارة الفني', 'Preferred Visit Time')}
              </label>
              <select
                value={preferredVisitTime}
                onChange={(e) => setPreferredVisitTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm font-medium"
              >
                <option value="في أقرب وقت ممكن">{t('في أقرب وقت ممكن (طوارئ)', 'As soon as possible (Urgent)')}</option>
                <option value="صباحاً (8 ص - 12 م)">{t('صباحاً (8 ص - 12 ظهراً)', 'Morning (8am - 12pm)')}</option>
                <option value="عصراً (2 م - 6 م)">{t('عصراً (2 م - 6 مساءً)', 'Afternoon (2pm - 6pm)')}</option>
                <option value="مساءً (6 م - 9 م)">{t('مساءً (6 م - 9 ليلاً)', 'Evening (6pm - 9pm)')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t('تفاصيل المشكلة ونوع المكيف *', 'Problem Details & AC Brand/Type *')}
            </label>
            <textarea
              required
              rows={4}
              value={problemDesc}
              onChange={(e) => setProblemDesc(e.target.value)}
              placeholder={t('اكتب تفاصيل العطل، ماركة الجهاز، كم طن تقريباً، وأي ملاحظات تساعد الفني...', 'Describe the problem, unit brand, ton capacity, any helpful notes...')}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm leading-relaxed"
            ></textarea>
          </div>

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: submitting ? 1 : 1.01 }}
            whileTap={{ scale: submitting ? 1 : 0.99 }}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C87D55] to-[#B86B3E] hover:from-[#d97742] hover:to-[#C87D55] disabled:bg-slate-400 text-white font-black text-base shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t('جاري تأكيد الحجز...', 'Booking...')}</span>
              </>
            ) : (
              <span>{t('تأكيد طلب زيارة الفني', 'Confirm Technician Booking')}</span>
            )}
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
    </div>
  );
};
