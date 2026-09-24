import React, { useState } from 'react';
import { useApp } from '../context';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface ContactProps {
  openQuoteModal: () => void;
  openTechModal: () => void;
}

export const ContactView: React.FC<ContactProps> = ({
  openQuoteModal,
  openTechModal
}) => {
  const { lang, t, settings, faq, submitContact } = useApp();

  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const phonePrimary = settings?.phonePrimary || '770931413';
  const phoneSecondary = settings?.phoneSecondary || '772302504';
  const whatsappPrimary = settings?.whatsappPrimary || '770931413';
  const emailOfficial = settings?.email || 'invercool.ye@gmail.com';
  const developerName = settings?.developerName || 'م/ أحمد وليد العريقي';
  const developerPhone1 = settings?.developerPhone1 || '772302504';
  const developerPhone2 = settings?.developerPhone2 || '738603124';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMsg(t('يرجى كتابة الاسم ورقم الهاتف والرسالة', 'Please enter your name, phone, and message'));
      return;
    }

    setLoading(true);
    try {
      const res = await submitContact(formData);
      if (res.success) {
        setSuccess(true);
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        setErrorMsg(res.message || t('فشل إرسال الرسالة', 'Failed to send message'));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C87D55]/10 border border-[#C87D55]/30 text-xs font-bold text-[#A85D35]">
            <Phone className="w-3.5 h-3.5" />
            <span>{t('قنوات تواصل مباشرة وهندسة معتمدة 24/7', 'Direct Contact Channels & 24/7 Support')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B192C]">
            {t('اتصل بنا وتواصل مع خبرائنا', 'Get In Touch With Invercool')}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t(
              'يسعدنا الرد على كافة استفساراتكم الهندسية، حجز طلبات المعاينة الميدانية، واستقبال طلبات عروض الأسعار في أي وقت.',
              'We are ready to answer your engineering inquiries, schedule on-site inspections, and provide comprehensive HVAC solutions.'
            )}
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Phone */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C87D55]/15 text-[#C87D55] flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0B192C]">
              {t('الاتصال الهاتفي والمبيعات', 'Phone & Sales')}
            </h3>
            <div className="space-y-1 text-xs font-mono font-bold text-slate-800" dir="ltr">
              <div>
                <a href={`tel:${phonePrimary}`} className="hover:text-[#C87D55] transition-colors">
                  {phonePrimary}
                </a>
              </div>
              <div>
                <a href={`tel:${phoneSecondary}`} className="hover:text-[#C87D55] transition-colors">
                  {phoneSecondary}
                </a>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              {t('متاح من 8:00 صباحاً حتى 8:00 مساءً (السبت - الخميس)', 'Available 8am - 8pm (Sat - Thu)')}
            </p>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center mx-auto">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0B192C]">
              {t('خدمة الواتساب المباشرة', 'Instant WhatsApp 24/7')}
            </h3>
            <div className="text-xs font-mono font-bold text-emerald-700" dir="ltr">
              <a
                href={`https://wa.me/967${whatsappPrimary.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                +967 {whatsappPrimary}
              </a>
            </div>
            <p className="text-[11px] text-slate-500">
              {t('رد سريع من المهندس المشرف واستقبال الصور والمواقع', 'Quick engineer reply, receive photos & GPS locations')}
            </p>
          </div>

          {/* Card 3: Location & Coverage */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1E3E62]/15 text-[#1E3E62] flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0B192C]">
              {t('التغطية الجغرافية والفروع', 'Service Coverage in Yemen')}
            </h3>
            <p className="text-xs text-slate-800 font-semibold">
              {t('المركز الرئيسي: صنعاء - فروع وخدمات: عدن، تعز، مأرب، الحديدة', 'Main Center: Sana\'a - Branches: Aden, Taiz, Marib, Hodeidah')}
            </p>
            <p className="text-[11px] text-slate-500">
              {t('فرق صيانة متنقلة تصل لكافة المحافظات', 'Mobile maintenance fleet covering all governorates')}
            </p>
          </div>
        </div>

        {/* Contact Form & Developer Integrity Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Form (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#0B192C]">
                  {t('أرسل لنا رسالة أو استفسار', 'Send us a message')}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {t('يرجى كتابة تفاصيل استفسارك وسيقوم فريقنا بالرد عليك فوراً.', 'Please leave your inquiry details and we will reply promptly.')}
                </p>
              </div>

              {success ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-900">
                    {t('تم إرسال رسالتك بنجاح!', 'Message Sent Successfully!')}
                  </h4>
                  <p className="text-xs text-emerald-700">
                    {t('شكراً لتواصلك معنا، سيقوم فريق خدمة العملاء بالرد والتواصل معك في أقرب وقت.', 'Thank you. Our customer care team will respond shortly.')}
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                  >
                    {t('إرسال رسالة أخرى', 'Send another message')}
                  </button>
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
                        {t('الاسم الكريم *', 'Your Name *')}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t('مثال: محمد العمري', 'e.g. Mohammed')}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#C87D55]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {t('رقم الهاتف للتواصل *', 'Phone Number *')}
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
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('البريد الإلكتروني (اختياري)', 'Email Address (Optional)')}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@mail.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#C87D55]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('نص الرسالة أو الاستفسار *', 'Message / Inquiry *')}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t('اكتب استفسارك هنا...', 'Type your inquiry here...')}
                      className="w-full p-3 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#C87D55]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0B192C] to-[#1E3E62] hover:brightness-110 shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                    <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                    <span>{t('إرسال الرسالة الآن', 'Send Message Now')}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Right Developer & Engineering Credential Box (5 cols) */}
            <div className="lg:col-span-5 bg-[#0B192C] text-white p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C87D55]/20 text-[#C87D55] text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('هندسة يمنية موثوقة ونظام معتمد', 'Certified Yemeni Engineering & System')}</span>
                </div>

                <h3 className="text-xl font-bold">
                  {lang === 'ar' ? 'العريقي إنفركول للحلول الهندسية' : 'AL-ARRIQI INVERCOOL Solutions'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t(
                    'نظام متكامل لإدارة وبرمجة وتصميم مشاريع التكييف والتبريد وأنظمة VRF وغرف التبريد في اليمن وفق أحدث المعايير الهندسية والمناخية.',
                    'Comprehensive engineering system for HVAC design, VRF solutions, and cold chain logistics across Yemen.'
                  )}
                </p>

                {/* Developer Attribution Card */}
                <div className="bg-[#060E18] p-5 rounded-xl border border-slate-700 space-y-3">
                  <div className="text-xs text-[#C87D55] font-bold uppercase tracking-wider">
                    {t('المطور والمصمم والمهندس المسؤول:', 'System Architect & Lead Developer:')}
                  </div>
                  <div className="text-lg font-black text-white">
                    {developerName}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {t(
                      'المشرف على البرمجة، التطوير، وهندسة أنظمة التحكم والحلول الذكية لمؤسسة العريقي إنفركول.',
                      'Lead engineer of digital architecture, system programming and smart controls for Invercool.'
                    )}
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-xs font-mono space-y-1" dir="ltr">
                    <div className="text-slate-300 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#C87D55]" />
                      <a href={`tel:${developerPhone1}`} className="hover:text-white font-bold">{developerPhone1}</a>
                    </div>
                    <div className="text-slate-300 flex items-center gap-2">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <a href={`tel:${developerPhone2}`} className="hover:text-white font-bold">{developerPhone2}</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>{t('خدمة الطوارئ:', 'Emergency Line:')}</span>
                <span className="font-mono text-white font-bold" dir="ltr">{phonePrimary}</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-[#0B192C]">
              {t('الأسئلة الشائعة حول التكييف والتبريد في اليمن', 'Frequently Asked Questions (FAQ)')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('إجابات هندسية موثوقة لأهم الأسئلة التي تشغل بال عملائنا الكرام', 'Technical answers to commonly asked client inquiries')}
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3">
            {faq.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="w-full p-4 text-right rtl:text-right ltr:text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#C87D55] shrink-0" />
                      <span>{lang === 'ar' ? item.questionAr : item.questionEn}</span>
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {lang === 'ar' ? item.answerAr : item.answerEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
