import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/api.js';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Code2,
  Globe
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { language, t } = useLanguage();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg(t('يرجى ملء الاسم ورقم الهاتف والرسالة', 'Please fill name, phone, and message'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitContactMessage({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        message: message.trim()
      });
      setSuccessMsg(res.message);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-[#0B192C] text-white p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3E62] text-[#C87D55] text-xs font-bold">
          <Phone className="w-3.5 h-3.5" />
          <span>{t('قنوات التواصل الرسمية', 'Official Contact Channels')}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          {t('تواصل مع شركة العريقي إنفركول', 'Contact AL-ARRIQI INVERCOOL')}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          {t(
            'يسعدنا الرد على جميع استفساراتكم الهندسية، حجز مواعيد المعاينة، وتلبية طلبات الصيانة والتوريد في كافة محافظات الجمهورية اليمنية.',
            'We welcome your engineering inquiries, site visit bookings, and HVAC maintenance requests across all governorates in Yemen.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Company Official Phone Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0B192C] text-[#C87D55] flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t('رقم هاتف الشركة الرسمي', 'Official Company Phone')}</h3>
                <p className="text-xs text-slate-500">{t('اتصال هاتفي مباشر وخدمة العملاء', 'Direct telephone line')}</p>
              </div>
            </div>

            <a
              href="tel:770931413"
              id="contact-company-phone"
              className="block p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xl font-mono font-black text-[#0B192C] text-center dir-ltr transition hover:text-[#C87D55]"
            >
              770931413
            </a>
          </div>

          {/* Company WhatsApp Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t('خدمة WhatsApp للشركة', 'Official Company WhatsApp')}</h3>
                <p className="text-xs text-slate-500">{t('محادثة فورية وإرسال مواقع وصور الأعطال', 'Instant chat & location sharing')}</p>
              </div>
            </div>

            <a
              href="https://wa.me/967770931413"
              target="_blank"
              rel="noopener noreferrer"
              id="contact-company-whatsapp"
              className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-base font-bold text-emerald-700 transition"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <span>{t('فتح محادثة واتساب: 770931413', 'Chat on WhatsApp: 770931413')}</span>
            </a>
          </div>

          {/* Facebook & Social */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900">{t('الصفحة الرسمية على فيسبوك', 'Official Facebook Page')}</h3>
            <a
              href="https://facebook.com/alarriqi.invercool"
              target="_blank"
              rel="noopener noreferrer"
              id="contact-company-facebook"
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline"
            >
              <Globe className="w-4 h-4" />
              <span>{t('صفحة العريقي إنفركول على Facebook', 'AL-ARRIQI INVERCOOL Facebook')}</span>
            </a>
          </div>

          {/* Coverage & Operating Hours */}
          <div className="p-6 rounded-3xl bg-[#0B192C] text-white space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#C87D55] font-bold">
              <Clock className="w-4 h-4" />
              <span>{t('ساعات العمل والطوارئ', 'Hours & Emergency')}</span>
            </div>
            <p className="text-xs text-slate-300">
              {t('الدوام الرسمي: السبت إلى الخميس من 8:00 صباحاً حتى 8:00 مساءً.', 'Official Hours: Sat - Thu, 8:00 AM - 8:00 PM.')}
            </p>
            <p className="text-xs text-emerald-400 font-semibold">
              {t('طوارئ الأعطال للمستشفيات وغرف التبريد: متوفرة 24 ساعة.', 'Emergency response for cold stores & medical: 24/7.')}
            </p>
          </div>
        </div>

        {/* Right: Message Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">
                {t('أرسل لنا رسالة أو استفسار', 'Send us a Message')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('املأ النموذج التالي، وسيقوم ممثل خدمة العملاء بالرد عليك بأسرع وقت.', 'Fill the form below and we will get back to you shortly.')}
              </p>
            </div>

            {successMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('الاسم الكريم *', 'Your Name *')}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('اسمك الكامل أو اسم جهة العمل', 'Full name or company')}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    {t('البريد الإلكتروني (اختياري)', 'Email (Optional)')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm dir-ltr text-start"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('نص الرسالة أو الاستفسار *', 'Your Message *')}
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('اكتب تفاصيل استفسارك أو طلبك هنا...', 'Write your inquiry here...')}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-sm leading-relaxed"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] disabled:bg-slate-400 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-[#C87D55]" />
                <span>{submitting ? t('جاري الإرسال...', 'Sending...') : t('إرسال الرسالة الآن', 'Send Message')}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Developer Attribution Card (Strictly Separated as requested in instructions 40, 84, 102) */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#C87D55]">
          <Code2 className="w-4 h-4" />
          <span>{t('معلومات برمجة وتطوير الموقع والنظام', 'System Development & Engineering')}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t('تمت البرمجة والتطوير بواسطة م/ أحمد وليد العريقي', 'Programmed & Developed by Eng. Ahmed Waleed Al-Arriqi')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('للاستفسارات البرمجية والحلول الرقمية للموقع والتطبيق:', 'For software development inquiries:')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800 shadow-sm">
              <span className="text-slate-400">{t('مطور 1:', 'Dev 1:')}</span>
              <a href="tel:772302504" className="hover:text-[#C87D55]">772302504</a>
              <a href="https://wa.me/967772302504" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800 shadow-sm">
              <span className="text-slate-400">{t('مطور 2:', 'Dev 2:')}</span>
              <a href="tel:738603124" className="hover:text-[#C87D55]">738603124</a>
              <a href="https://wa.me/967738603124" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
