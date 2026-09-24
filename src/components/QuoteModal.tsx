import React, { useState } from 'react';
import { useApp } from '../context';
import { X, Sparkles, CheckCircle2, AlertCircle, Upload, Building, Phone, MapPin, User, FileText } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose }) => {
  const { lang, t, governates, submitQuote } = useApp();

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ requestNumber?: string; message?: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    clientName: '',
    companyName: '',
    phone: '',
    governate: 'صنعاء',
    city: '',
    projectType: 'مبنى تجاري / مكاتب',
    requiredSystem: 'أنظمة VRF / VRV موفرة للطاقة',
    projectDesc: '',
    projectArea: '',
    unitsCount: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.clientName.trim() || !formData.phone.trim() || !formData.projectDesc.trim()) {
      setErrorMsg(t('يرجى كتابة الاسم ورقم الهاتف ووصف المشروع', 'Please fill in client name, phone and project details'));
      return;
    }

    setLoading(true);
    try {
      const res = await submitQuote(formData);
      if (res.success) {
        setSuccessData({
          requestNumber: res.requestNumber,
          message: res.message
        });
      } else {
        setErrorMsg(res.message || t('حدث خطأ أثناء إرسال الطلب', 'Error submitting quote request'));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#0B192C] text-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-[#060E18] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C87D55]/20 text-[#C87D55] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {t('طلب دراسة هندسية وعرض سعر مخصص', 'Engineering Study & Quote Request')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('دراسة الأحمال الحرارية وتصميم أنظمة التكييف والتبريد الأنسب', 'Thermal load study and optimal HVAC sizing')}
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

        {/* Content */}
        <div className="p-6">
          {successData ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-white">
                {t('تم استلام طلب عرض السعر بنجاح!', 'Quote Request Received Successfully!')}
              </h4>
              <div className="bg-[#060E18] p-4 rounded-xl border border-slate-800 max-w-md mx-auto">
                <p className="text-xs text-slate-400 mb-1">{t('رقم الطلب المرجعي:', 'Reference Request No:')}</p>
                <div className="text-2xl font-mono font-black text-[#C87D55]">{successData.requestNumber}</div>
              </div>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                {successData.message ||
                  t(
                    'سيقوم المهندس المختص بدراسة بيانات المشروع والتواصل معكم خلال 24 ساعة لتقديم أفضل الحلول الفنية والمالية.',
                    'Our HVAC engineering team will analyze your project requirements and contact you within 24 hours.'
                  )}
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setSuccessData(null);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-lg bg-[#C87D55] text-white text-xs font-bold hover:bg-[#A85D35]"
                >
                  {t('إغلاق', 'Close')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('اسم العميل / المسؤول *', 'Client / Contact Name *')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      placeholder={t('مثال: م. علي صالح', 'e.g. Ali Saleh')}
                      className="w-full bg-[#060E18] border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C87D55]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('رقم الهاتف / الواتساب *', 'Phone / WhatsApp *')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="77XXXXXXX"
                    className="w-full bg-[#060E18] border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C87D55]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('الجهة / المنشأة (إن وجد)', 'Company / Facility (Optional)')}
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder={t('مستشفى، فندق، مول، فيلا...', 'Hospital, Hotel, Villa...')}
                    className="w-full bg-[#060E18] border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C87D55]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('المحافظة *', 'Governate *')}
                  </label>
                  <select
                    value={formData.governate}
                    onChange={(e) => setFormData({ ...formData, governate: e.target.value })}
                    className="w-full bg-[#060E18] border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C87D55]"
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
                    {t('نوع المشروع *', 'Project Type *')}
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full bg-[#060E18] border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C87D55]"
                  >
                    <option value="مبنى تجاري / مكاتب">{t('مبنى تجاري / مكاتب', 'Commercial Building / Offices')}</option>
                    <option value="مستشفى أو مركز صحي">{t('مستشفى أو مركز صحي', 'Hospital / Medical Center')}</option>
                    <option value="فندق أو منتجع سياحي">{t('فندق أو منتجع سياحي', 'Hotel / Resort')}</option>
                    <option value="مستودع أو غرف تبريد">{t('مستودع أو غرف تبريد', 'Warehouse / Cold Storage')}</option>
                    <option value="فيلا أو قصر سكني">{t('فيلا أو قصر سكني', 'Villa / Luxury Residence')}</option>
                    <option value="مصنع أو خط إنتاج">{t('مصنع أو خط إنتاج', 'Factory / Industrial')}</option>
                    <option value="أخرى">{t('أخرى', 'Other')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('النظام المطلوب', 'Requested HVAC System')}
                  </label>
                  <select
                    value={formData.requiredSystem}
                    onChange={(e) => setFormData({ ...formData, requiredSystem: e.target.value })}
                    className="w-full bg-[#060E18] border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C87D55]"
                  >
                    <option value="أنظمة VRF / VRV موفرة للطاقة">{t('أنظمة VRF / VRV متغيرة التدفق', 'Variable Flow VRF / VRV')}</option>
                    <option value="غرف ومخازن تبريد وتجميد">{t('غرف تبريد وتجميد غذائي وطبي', 'Cold Storage Rooms')}</option>
                    <option value="تكييف مركزي دكت ومجاري هواء">{t('تكييف مركزي دكت كونسيلد', 'Ducted Split / Central HVAC')}</option>
                    <option value="مكيفات سبليت إنفرتر اقتصادية">{t('مكيفات سبليت جداري إنفرتر', 'Wall Inverter Splits')}</option>
                    <option value="تهوية ومراوح سحب وتجديد هواء">{t('أنظمة تهوية صناعية وتنقية', 'Ventilation & Air Quality')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('المساحة التقريبية (م²)', 'Approximate Area (m²)')}
                  </label>
                  <input
                    type="text"
                    value={formData.projectArea}
                    onChange={(e) => setFormData({ ...formData, projectArea: e.target.value })}
                    placeholder={t('مثال: 450 م²', 'e.g. 450 m²')}
                    className="w-full bg-[#060E18] border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C87D55]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('عدد الوحدات التقريبي', 'Estimated Units Count')}
                  </label>
                  <input
                    type="text"
                    value={formData.unitsCount}
                    onChange={(e) => setFormData({ ...formData, unitsCount: e.target.value })}
                    placeholder={t('مثال: 12 وحدة', 'e.g. 12 units')}
                    className="w-full bg-[#060E18] border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C87D55]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('تفاصيل المشروع والمواصفات المطلوبة *', 'Project Details & Specifications *')}
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.projectDesc}
                  onChange={(e) => setFormData({ ...formData, projectDesc: e.target.value })}
                  placeholder={t('يرجى ذكر نبذة عن الموقع، ارتفاع الأسقف، العزل، وأي تفضيلات خاصة...', 'Please describe location, ceiling height, insulation or special preferences...')}
                  className="w-full bg-[#060E18] border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#C87D55]"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5"
                >
                  {t('إلغاء', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#C87D55] to-[#A85D35] hover:brightness-110 shadow-lg shadow-[#C87D55]/30 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  <span>{t('إرسال طلب الدراسة الهندسية', 'Submit Quote Request')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
