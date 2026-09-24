import React, { useState } from 'react';
import { useApp } from '../context';
import {
  Wrench,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  Calendar,
  Layers,
  MapPin,
  Check,
  Zap,
  RotateCcw
} from 'lucide-react';

interface MaintenanceProps {
  openQuoteModal: () => void;
  openTechModal: () => void;
}

export const MaintenanceView: React.FC<MaintenanceProps> = ({
  openQuoteModal,
  openTechModal
}) => {
  const { lang, t, governates, submitMaintenance } = useApp();

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ requestNumber?: string; message?: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    governate: 'صنعاء',
    city: '',
    serviceType: 'صيانة دورية وغسيل شامل',
    equipmentType: 'مكيف سبليت جداري',
    priority: 'normal',
    problemDesc: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.clientName.trim() || !formData.phone.trim() || !formData.problemDesc.trim()) {
      setErrorMsg(t('يرجى تعبئة الاسم والهاتف وتفاصيل المشكلة', 'Please enter name, phone, and problem details'));
      return;
    }

    setLoading(true);
    try {
      const res = await submitMaintenance(formData);
      if (res.success) {
        setSuccessData({
          requestNumber: res.requestNumber,
          message: res.message
        });
      } else {
        setErrorMsg(res.message || t('حدث خطأ أثناء إرسال طلب الصيانة', 'Error submitting maintenance request'));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const maintenancePlans = [
    {
      titleAr: 'صيانة الغسيل والتعقيم الشامل',
      titleEn: 'Complete Chemical Cleaning & Sterilization',
      price: t('تبدأ من 8,000 ريال يمني', 'From 8,000 YER'),
      featuresAr: [
        'غسيل المبخر الداخلي والراديتر بمواد مخصصة مضادة للبكتيريا',
        'تنظيف المكثف الخارجي بضغط مائي عالٍ لإزالة الغبار المتكلس',
        'تسليك وتنظيف مجاري ومضخات تصريف مياه التكييف',
        'فحص ضغط غاز التبريد والتأكد من عدم وجود تهريب'
      ],
      featuresEn: [
        'Chemical antibacterial cleaning of evaporator coil',
        'High-pressure condenser wash removing packed dirt',
        'Flushing and unclogging condensation drain pipes',
        'Refrigerant gas pressure check and leak detection'
      ]
    },
    {
      titleAr: 'الفحص الدوري وفحص الغاز والكمبروسر',
      titleEn: 'Comprehensive Performance & Gas Audit',
      price: t('تشخيص فني دقيق وضمان', 'Precise Diagnostic & Warranty'),
      featuresAr: [
        'فحص واختبار أمبير وسحب الكهرباء للضاغط (الكمبروسر)',
        'قياس درجات حرارة دخول وخروج الهواء (Delta T)',
        'شحن غاز R410A أو R32 أصلي عالي النقاوة بميزان إلكتروني',
        'فحص اللوحة الإلكترونية والكونتاكتور والحساسات'
      ],
      featuresEn: [
        'Compressor running current and amp draw inspection',
        'Delta T return and supply air temperature diagnostics',
        'Original R410A/R32 electronic-scale gas replenishment',
        'Motherboard, capacitor & thermistor electrical tests'
      ]
    },
    {
      titleAr: 'عقود الصيانة السنوية للمنشآت والمباني',
      titleEn: 'Annual Maintenance Contracts (AMC) for Facilities',
      price: t('عقود مخصصة وتخفيضات للشركات', 'Custom SLA & Corporate Discounts'),
      featuresAr: [
        'زيارات دورية منتظمة مجدولة طوال العام (شهرياً/فصلياً)',
        'أولوية قصوى واستجابة فورية لبلاغات الطوارئ 24/7',
        'خصم خاص ومميز على كافة قطع الغيار الأصلية',
        'تقارير فنية دورية وإشراف هندسي معتمد'
      ],
      featuresEn: [
        'Scheduled periodic visits throughout the year',
        'Top priority & immediate response to 24/7 emergencies',
        'Preferential corporate pricing on genuine spare parts',
        'Comprehensive technical health reports per visit'
      ]
    }
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3E62]/10 border border-[#1E3E62]/30 text-xs font-bold text-[#1E3E62]">
            <Wrench className="w-3.5 h-3.5" />
            <span>{t('صيانة هندسية معتمدة - قطع غيار أصلية - ضمان للخدمة', 'Certified Engineering Maintenance - Genuine Parts - Full Warranty')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B192C]">
            {t('خدمات وطلبات صيانة التكييف والتبريد', 'HVAC Maintenance & Emergency Repair')}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t(
              'فريق هندسي متخصص مجهز بأحدث أدوات القياس وشحن الغاز وقطع الغيار الأصلية لصيانة كافة مكيفات السبليت، الكونسيلد، الدكت، وأنظمة وغرف التبريد.',
              'Specialized HVAC engineering technicians equipped with digital gauges, genuine compressors, and specialized cleaning equipment across all Yemeni cities.'
            )}
          </p>
        </div>

        {/* Maintenance Plans Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {maintenancePlans.map((plan, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:border-[#C87D55]/60 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#0B192C] text-[#C87D55] flex items-center justify-center font-bold">
                    0{idx + 1}
                  </div>
                  <span className="text-xs font-bold text-[#A85D35] bg-[#C87D55]/10 px-2.5 py-1 rounded-full">
                    {plan.price}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0B192C]">
                  {lang === 'ar' ? plan.titleAr : plan.titleEn}
                </h3>

                <ul className="space-y-2.5 text-xs text-slate-600">
                  {(lang === 'ar' ? plan.featuresAr : plan.featuresEn).map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => {
                    const el = document.getElementById('maintenance-form-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-[#0B192C] bg-slate-100 hover:bg-[#C87D55] hover:text-white transition-colors text-center"
                >
                  {t('طلب هذه الخدمة الآن', 'Request this service')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Maintenance Request Form Section */}
        <div id="maintenance-form-section" className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Info Panel */}
            <div className="lg:col-span-5 bg-[#0B192C] text-white p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-[#C87D55] font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t('طوارئ 24 ساعة - استجابة سريعة', '24/7 Emergency Dispatch')}</span>
                </div>
                <h2 className="text-2xl font-black">
                  {t('سجل بلاغ صيانة وسنتواصل بك خلال 15 دقيقة', 'Log a Repair Request - Fast Response')}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t(
                    'سواء كان العطل توقفاً مفاجئاً، تسريب ماء، ضعفاً في التبريد أو حاجة لغسيل وصيانة دورية، سيصلك فنيونا المعتمدون في الموعد المحدد مع أدوات الفحص المتطورة.',
                    'Whether it is total shutdown, water leak, lack of cooling, or periodic servicing, our qualified technicians will arrive with advanced diagnostic tools.'
                  )}
                </p>

                <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-[#C87D55]" />
                    <span>{t('ضمان كتابي معتمد على أعمال الصيانة وقطع الغيار', 'Written warranty on all repairs and parts')}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Zap className="w-4 h-4 text-[#C87D55]" />
                    <span>{t('فحص تسريب الغاز بأجهزة كاشفة إلكترونية دقيقة', 'Electronic halogen refrigerant leak detection')}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-[#C87D55]" />
                    <span>{t('شفافية كاملة في الأسعار والتشخيص قبل البدء', 'Upfront pricing and honest technical audit')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#060E18] p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-400">{t('للطوارئ والحالات العاجلة جداً:', 'Direct Emergency Hotlines:')}</div>
                <div className="flex items-center gap-4 text-xs font-mono font-bold text-white" dir="ltr">
                  <a href="tel:770931413" className="hover:text-[#C87D55]">770931413</a>
                  <span>/</span>
                  <a href="tel:772302504" className="hover:text-[#C87D55]">772302504</a>
                </div>
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="lg:col-span-7 p-6 sm:p-8">
              {successData ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {t('تم تسجيل طلب الصيانة بنجاح!', 'Maintenance Ticket Created!')}
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-sm mx-auto">
                    <span className="text-xs text-slate-500 block mb-1">{t('رقم البلاغ / التذكرة:', 'Ticket Number:')}</span>
                    <span className="text-2xl font-mono font-black text-[#C87D55]">{successData.requestNumber}</span>
                  </div>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    {successData.message}
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setSuccessData(null)}
                      className="px-6 py-2.5 rounded-lg bg-[#0B192C] text-white text-xs font-bold hover:bg-[#1E3E62]"
                    >
                      {t('تسجيل طلب آخر', 'Submit Another Request')}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {t('اسم العميل / المنشأة *', 'Client / Facility Name *')}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        placeholder={t('مثال: أحمد عبد الله', 'e.g. Ahmed')}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#C87D55]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {t('رقم الهاتف للتواصل *', 'Contact Phone *')}
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="77XXXXXXX"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#C87D55]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {t('المحافظة *', 'Governate *')}
                      </label>
                      <select
                        value={formData.governate}
                        onChange={(e) => setFormData({ ...formData, governate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#C87D55]"
                      >
                        {governates.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {t('المدينة / الحي السكني', 'City / Neighborhood')}
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder={t('الحي / الشارع', 'District / Street')}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#C87D55]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {t('نوع الخدمة المطلوبة', 'Service Type')}
                      </label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#C87D55]"
                      >
                        <option value="صيانة دورية وغسيل شامل">{t('صيانة دورية وغسيل كيميائي شامل', 'Periodic Cleaning & Wash')}</option>
                        <option value="إصلاح عطل مفاجئ / طوارئ">{t('إصلاح عطل مفاجئ / طوارئ', 'Emergency Breakdown Repair')}</option>
                        <option value="شحن غاز تبريد وفحص تهريب">{t('شحن غاز تبريد وفحص تهريب', 'Refrigerant Gas Recharge')}</option>
                        <option value="فك وتركيب ونقل مكيف">{t('فك وتركيب ونقل مكيف', 'Uninstall, Move & Reinstall')}</option>
                        <option value="صيانة غرف ومستودعات تبريد">{t('صيانة غرف ومستودعات تبريد', 'Cold Storage Repair')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {t('درجة الاستعجال', 'Urgency')}
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#C87D55]"
                      >
                        <option value="normal">{t('عادي (خلال 24-48 ساعة)', 'Normal (24-48 hrs)')}</option>
                        <option value="high">{t('مستعجل (خلال اليوم نفسه)', 'Urgent (Same Day)')}</option>
                        <option value="emergency">{t('طوارئ فورية (مستشفيات/مخازن مبردة)', 'Immediate Emergency (Cold Store/Hospital)')}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('وصف المشكلة أو مظاهر العطل بالتفصيل *', 'Problem Symptoms & Description *')}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.problemDesc}
                      onChange={(e) => setFormData({ ...formData, problemDesc: e.target.value })}
                      placeholder={t('يرجى وصف المشكلة (مثال: المكيف يخرج هواء حار، صوت مزعج، تقطير ماء داخل الغرفة، رمز خطأ على الشاشة...)', 'Describe problem: blowing warm air, noisy, leaking water, error code on display...')}
                      className="w-full p-3 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#C87D55]"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0B192C] to-[#1E3E62] hover:brightness-110 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                      <span>{t('إرسال طلب الصيانة واعتماد البلاغ', 'Submit Maintenance Request')}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
