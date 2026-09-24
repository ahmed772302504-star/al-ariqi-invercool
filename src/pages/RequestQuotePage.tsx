import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/api.js';
import { FileText, CheckCircle2, Phone, MessageCircle, AlertTriangle, Building, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { generateWhatsAppUrl } from '../components/common/FloatingContact.js';

interface RequestQuotePageProps {
  navigate: (route: string) => void;
}

export const RequestQuotePage: React.FC<RequestQuotePageProps> = ({ navigate }) => {
  const { language, t } = useLanguage();
  const [governates, setGovernates] = useState<string[]>([]);

  // Form State
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [governate, setGovernate] = useState('صنعاء');
  const [city, setCity] = useState('');
  const [projectType, setProjectType] = useState('مبنى تجاري / مكاتب');
  const [requiredSystem, setRequiredSystem] = useState('تكييف مركزي VRF');
  const [projectArea, setProjectArea] = useState('');
  const [unitsCount, setUnitsCount] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [notes, setNotes] = useState('');

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

    if (!clientName.trim() || !phone.trim() || !projectDesc.trim()) {
      setErrorMessage(t('يرجى ملء الاسم ورقم الهاتف ووصف المشروع', 'Please fill in required fields'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitQuoteRequest({
        clientName: clientName.trim(),
        companyName: companyName.trim(),
        phone: phone.trim(),
        governate,
        city: city.trim() || governate,
        projectType,
        requiredSystem,
        projectArea: projectArea.trim(),
        unitsCount: unitsCount.trim(),
        projectDesc: projectDesc.trim(),
        notes: notes.trim()
      });

      setSubmittedRef(res.requestNumber);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit quote request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedRef(null);
    setProjectDesc('');
    setNotes('');
    setProjectArea('');
    setUnitsCount('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0B192C] text-white p-8 rounded-3xl border border-slate-800 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3E62] text-[#C87D55] text-xs font-bold">
          <FileText className="w-3.5 h-3.5" />
          <span>{t('دراسة فنية وعرض سعر هندسي', 'Engineering Project Quote')}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">
          {t('اطلب عرض سعر لمشروعك', 'Request a Detailed Project Quote')}
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          {t(
            'يقوم مهندسونا بحساب الأحمال الحرارية واقتراح أفضل المنظومات الهندسية الموفرة للطاقة وتقديم عرض فني ومالي مفصل لمشروعك.',
            'Our HVAC engineers will calculate thermal loads, recommend energy-efficient configurations, and provide comprehensive commercial quotes.'
          )}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {submittedRef ? (
          /* Success Screen with Framer Motion Transition */
          <motion.div
            key="quote-success"
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
                {t('تم استلام طلب عرض السعر بنجاح!', 'Quote Request Received!')}
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                {t(
                  'سيتواصل معك مهندس الحسابات والمشاريع لمراجعة المخططات وتقديم العرض. رقم المرجع المعتمد:',
                  'Our engineering team will review your specifications. Your reference number:'
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
                  type: 'quote',
                  lang: language === 'en' ? 'en' : 'ar',
                  referenceNumber: submittedRef || undefined,
                  customerName: clientName + (companyName ? ` (${companyName})` : ''),
                  phone,
                  city: `${governate}${city ? ` - ${city}` : ''}`,
                  projectType: `${projectType} - ${requiredSystem}`,
                  details: projectDesc || notes || (projectArea ? `المساحة: ${projectArea} م²` : undefined),
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{t('متابعة العرض عبر واتساب (770931413)', 'Follow up on WhatsApp (770931413)')}</span>
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
                <span>{t('طلب تسعير لمشروع آخر', 'Submit Another Quote')}</span>
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* Form with Framer Motion */
          <motion.form
            key="quote-form"
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
                {t('اسم المسؤول أو صاحب المشروع *', 'Contact Name *')}
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder={t('مثال: م. أحمد صالح', 'e.g. Eng. Ahmed')}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('اسم المنشأة / الشركة (اختياري)', 'Company / Entity (Optional)')}
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={t('مثال: مجموعة البركة التجارية', 'e.g. Al-Baraka Trading Group')}
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
                {t('نوع المشروع', 'Project Type')}
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm font-medium"
              >
                <option value="مبنى تجاري / مكاتب">{t('مبنى تجاري / مكاتب وشركات', 'Commercial Building')}</option>
                <option value="مستشفى / مركز صحي">{t('مستشفى / مركز طبي / مختبرات', 'Hospital / Medical Center')}</option>
                <option value="غرف ومخازن تبريد">{t('غرف ومخازن تبريد وتجميد غذائي', 'Cold Rooms & Food Storage')}</option>
                <option value="مصنع / منشأة صناعية">{t('مصنع / صالة إنتاج صناعي', 'Factory / Industrial Plant')}</option>
                <option value="مول / مركز تسوق">{t('مول / مركز تسوق وسوبرماركت', 'Shopping Mall / Supermarket')}</option>
                <option value="فيلا / قصر سكني">{t('فيلا سكنية / مجمع سكني', 'Residential Villa / Compound')}</option>
                <option value="آخر">{t('مشروع آخر', 'Other')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('المنظومة المفضلة / المطلوبة', 'Required HVAC System')}
              </label>
              <select
                value={requiredSystem}
                onChange={(e) => setRequiredSystem(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm font-medium"
              >
                <option value="تكييف مركزي VRF">{t('تكييف مركزي بنظام VRF/VRV ذكي', 'VRF / VRV Central System')}</option>
                <option value="غرف تبريد وتجميد">{t('غرف تبريد وتجميد متكاملة', 'Turnkey Cold Rooms')}</option>
                <option value="دكت سبليت وتأسيس">{t('دكت سبليت وشبكات توزيع هواء', 'Duct Split & Ventilation')}</option>
                <option value="دراسة هندسية لتحديد الأنسب">{t('دراسة هندسية لتحديد الأنسب', 'Engineering recommendation')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('المساحة الإجمالية التقديرية (متر مربع)', 'Total Area (m²)')}
              </label>
              <input
                type="text"
                value={projectArea}
                onChange={(e) => setProjectArea(e.target.value)}
                placeholder={t('مثال: 500 م2', 'e.g. 500 sqm')}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('عدد الوحدات أو الغرف المتوقعة', 'Estimated Units / Rooms')}
              </label>
              <input
                type="text"
                value={unitsCount}
                onChange={(e) => setUnitsCount(e.target.value)}
                placeholder={t('مثال: 12 وحدة / 4 غرف تبريد', 'e.g. 12 units')}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t('تفاصيل ونطاق المشروع المطلوب تسعيره *', 'Project Details & Scope *')}
            </label>
            <textarea
              required
              rows={4}
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              placeholder={t('اشرح تفاصيل المشروع، الغرض من الاستخدام، المخططات المتوفرة، والجدول الزمني المستهدف...', 'Explain project requirements, intended usage, target completion date...')}
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
                <span>{t('جاري إرسال الطلب...', 'Submitting...')}</span>
              </>
            ) : (
              <span>{t('طلب عرض السعر والدراسة الهندسية', 'Request Engineering Quote')}</span>
            )}
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
    </div>
  );
};
