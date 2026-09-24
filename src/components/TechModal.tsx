import React, { useState } from 'react';
import { useApp } from '../context';
import { X, UserCheck, CheckCircle2, AlertCircle, Phone, MapPin, Clock, Wrench } from 'lucide-react';

interface TechModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechModal: React.FC<TechModalProps> = ({ isOpen, onClose }) => {
  const { lang, t, governates, submitTechnician } = useApp();

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ requestNumber?: string; message?: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    governate: 'صنعاء',
    city: '',
    locationDetails: '',
    equipmentType: 'مكيف سبليت جداري',
    malfunctionType: 'توقف التبريد فجأة',
    problemDesc: '',
    preferredVisitTime: 'في أقرب وقت ممكن (طارئ)'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.clientName.trim() || !formData.phone.trim() || !formData.problemDesc.trim()) {
      setErrorMsg(t('يرجى تعبئة الاسم ورقم الهاتف ووصف العطل', 'Please fill name, phone and problem description'));
      return;
    }

    setLoading(true);
    try {
      const res = await submitTechnician(formData);
      if (res.success) {
        setSuccessData({
          requestNumber: res.requestNumber,
          message: res.message
        });
      } else {
        setErrorMsg(res.message || t('حدث خطأ أثناء إرسال الطلب', 'Error sending technician request'));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#0B192C] text-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-[#060E18] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1E3E62] text-[#C87D55] flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {t('طلب زيارة فني تشخيص وصيانة', 'Diagnostic Technician Dispatch')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('فنيون مجهزون بأجهزة قياس الغاز والكمبروسر واللحام', 'Equipped with gas gauges, multimeters & tools')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {successData ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-white">
                {t('تم تسجيل طلب الفني بنجاح!', 'Technician Dispatched Successfully!')}
              </h4>
              <div className="bg-[#060E18] p-3.5 rounded-xl border border-slate-800 max-w-sm mx-auto">
                <p className="text-xs text-slate-400 mb-0.5">{t('كود البلاغ:', 'Service Code:')}</p>
                <div className="text-2xl font-mono font-black text-[#C87D55]">{successData.requestNumber}</div>
              </div>
              <p className="text-xs text-slate-300">
                {t(
                  'سيقوم المشرف الفني بالاتصال برقم هاتفك فوراً لتأكيد العنوان وتحديد وقت وصول الفني لموقعك.',
                  'Our technical supervisor will contact your phone immediately to confirm address & arrival.'
                )}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSuccessData(null);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-lg bg-[#C87D55] text-white text-xs font-bold hover:bg-[#A85D35]"
                >
                  {t('تم', 'Done')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {errorMsg && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('اسم العميل *', 'Client Name *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder={t('الاسم الكريم', 'Your Name')}
                    className="w-full bg-[#060E18] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C87D55]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('رقم الهاتف *', 'Phone Number *')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="77XXXXXXX"
                    className="w-full bg-[#060E18] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C87D55]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('المحافظة *', 'Governate *')}
                  </label>
                  <select
                    value={formData.governate}
                    onChange={(e) => setFormData({ ...formData, governate: e.target.value })}
                    className="w-full bg-[#060E18] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C87D55]"
                  >
                    {governates.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('نوع الجهاز', 'Equipment Type')}
                  </label>
                  <select
                    value={formData.equipmentType}
                    onChange={(e) => setFormData({ ...formData, equipmentType: e.target.value })}
                    className="w-full bg-[#060E18] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C87D55]"
                  >
                    <option value="مكيف سبليت جداري">{t('مكيف سبليت جداري', 'Split AC')}</option>
                    <option value="مكيف مركزي / دكت">{t('مكيف مركزي / دكت', 'Central / Ducted')}</option>
                    <option value="غرفة تبريد أو تجميد">{t('غرفة تبريد أو تجميد', 'Cold Room')}</option>
                    <option value="مكيف صحراوي أو مائي">{t('مكيف صحراوي / مائي', 'Desert / Evaporative')}</option>
                    <option value="ثلاجة عرض أو تجارية">{t('ثلاجة عرض أو تجارية', 'Commercial Chiller')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('العنوان التفصيلي / معلم قريب', 'Detailed Address & Landmark')}
                </label>
                <input
                  type="text"
                  value={formData.locationDetails}
                  onChange={(e) => setFormData({ ...formData, locationDetails: e.target.value })}
                  placeholder={t('الحي، الشارع، بجوار...', 'Neighborhood, street, near...')}
                  className="w-full bg-[#060E18] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C87D55]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('وصف المشكلة / العطل *', 'Problem Description *')}
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.problemDesc}
                  onChange={(e) => setFormData({ ...formData, problemDesc: e.target.value })}
                  placeholder={t('مثال: تبريد ضعيف، صوت غير طبيعي، تسريب ماء، كود خطأ بالريموت...', 'e.g. Weak cooling, loud sound, leaking water, error code...')}
                  className="w-full bg-[#060E18] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C87D55]"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('الوقت المفضل للزيارة', 'Preferred Visit Time')}
                </label>
                <select
                  value={formData.preferredVisitTime}
                  onChange={(e) => setFormData({ ...formData, preferredVisitTime: e.target.value })}
                  className="w-full bg-[#060E18] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C87D55]"
                >
                  <option value="في أقرب وقت ممكن (طارئ)">{t('في أقرب وقت ممكن (طارئ)', 'ASAP (Emergency)')}</option>
                  <option value="اليوم خلال الفترة الصباحية">{t('اليوم خلال الفترة الصباحية (9ص - 1م)', 'Today Morning (9am - 1pm)')}</option>
                  <option value="اليوم خلال الفترة المسائية">{t('اليوم خلال الفترة المسائية (3م - 7م)', 'Today Evening (3pm - 7pm)')}</option>
                  <option value="غداً صباحاً">{t('غداً صباحاً', 'Tomorrow Morning')}</option>
                  <option value="التنسيق هاتفياً لاحقاً">{t('التنسيق هاتفياً لاحقاً', 'Coordinate via phone')}</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  {t('إلغاء', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#C87D55] hover:bg-[#A85D35] flex items-center gap-2 disabled:opacity-50"
                >
                  {loading && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  <span>{t('تأكيد طلب الفني', 'Confirm Technician')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
