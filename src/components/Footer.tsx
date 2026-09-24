import React from 'react';
import { useApp } from '../context';
import {
  Phone,
  MessageCircle,
  MapPin,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Heart,
  ExternalLink,
  Lock
} from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  openQuoteModal: () => void;
  openTechModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentTab,
  openQuoteModal,
  openTechModal
}) => {
  const { lang, t, settings } = useApp();

  const phonePrimary = settings?.phonePrimary || '770931413';
  const phoneSecondary = settings?.phoneSecondary || '772302504';
  const whatsappPrimary = settings?.whatsappPrimary || '770931413';
  const developerName = settings?.developerName || 'م/ أحمد وليد العريقي';
  const developerPhone1 = settings?.developerPhone1 || '772302504';
  const developerPhone2 = settings?.developerPhone2 || '738603124';

  return (
    <footer className="bg-[#060E18] text-slate-300 border-t border-slate-800/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E3E62] to-[#0B192C] border-2 border-[#C87D55] flex items-center justify-center shadow-lg">
                <span className="text-2xl font-black text-white">IC</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  {lang === 'ar' ? 'العريقي إنفركول' : 'AL-ARRIQI INVERCOOL'}
                </h3>
                <p className="text-xs text-[#C87D55] font-semibold">
                  {t('أنظمة التكييف والتبريد الهندسي المتكامل', 'Integrated HVAC & Engineering')}
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400">
              {t(
                'الرواد في تقديم حلول التكييف الاقتصادي والتبريد المركزي وغرف التبريد وتوفير الطاقة في الجمهورية اليمنية بخبرة هندسية وكوادر معتمدة.',
                'Pioneering smart HVAC solutions, cold rooms, energy-saving cooling systems & expert technical maintenance across Yemen.'
              )}
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B192C] border border-[#C87D55]/30 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-[#C87D55]" />
                <span>{t('ضمان هندسي معتمد وتوفير قطع أصلية', 'Certified Engineering Warranty & Genuine Parts')}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              {t('روابط سريعة', 'Quick Links')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => setCurrentTab('services')}
                  className="hover:text-[#C87D55] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C87D55]"></span>
                  {t('خدمات التكييف والتبريد وغرف التجميد', 'HVAC, Cooling & Cold Rooms')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('products')}
                  className="hover:text-[#C87D55] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C87D55]"></span>
                  {t('معرض الأجهزة ومكيفات التوفير المستوردة', 'AC Store & Imported Inverters')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('projects')}
                  className="hover:text-[#C87D55] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C87D55]"></span>
                  {t('مشاريعنا المنفذة في محافظات اليمن', 'Projects Delivered in Yemen')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('calculator')}
                  className="hover:text-[#C87D55] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C87D55]"></span>
                  {t('حاسبة سعة وحجم التكييف الدقيقة', 'Precise AC Sizing Calculator')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('maintenance')}
                  className="hover:text-[#C87D55] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C87D55]"></span>
                  {t('طلب صيانة طارئة أو دورية', 'Emergency / Routine Maintenance')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact & Emergency */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              {t('التواصل والدعم الفوري', 'Direct Contact & Support')}
            </h4>
            <div className="space-y-3 text-xs">
              <a
                href={`tel:${phonePrimary}`}
                className="flex items-start gap-2.5 hover:text-white transition-colors group"
              >
                <Phone className="w-4 h-4 text-[#C87D55] mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-semibold text-white">{t('هاتف الإدارة والمبيعات:', 'Sales & Management:')}</div>
                  <div dir="ltr" className="text-slate-400">{phonePrimary} / {phoneSecondary}</div>
                </div>
              </a>

              <a
                href={`https://wa.me/967${whatsappPrimary.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-emerald-400 transition-colors group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-semibold text-white">{t('خدمة الواتساب المباشرة 24/7:', 'WhatsApp 24/7 Support:')}</div>
                  <div dir="ltr" className="text-slate-400">967 {whatsappPrimary}</div>
                </div>
              </a>

              <div className="flex items-start gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-[#C87D55] mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-white">{t('التغطية الجغرافية:', 'Service Coverage:')}</div>
                  <div>{t('صنعاء - عدن - تعز - مأرب - الحديدة وكافة المدن اليمنية', 'Sana\'a, Aden, Taiz, Marib, Hodeidah & all Yemen')}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-slate-400">
                <Clock className="w-4 h-4 text-[#C87D55] mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-white">{t('ساعات العمل:', 'Working Hours:')}</div>
                  <div>{t('السبت - الخميس: 8:00 صباحاً - 8:00 مساءً (الطوارئ: 24 ساعة)', 'Sat - Thu: 8am - 8pm (Emergency: 24/7)')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Rapid Actions & Admin */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              {t('خدمة العملاء السريعة', 'Customer Actions')}
            </h4>
            <p className="text-xs text-slate-400">
              {t(
                'يمكنك حجز موعد فني فوري أو طلب دراسة هندسية وعرض سعر شامل لمشروعك خلال دقائق.',
                'Book an instant technician visit or request a full engineering quotation in minutes.'
              )}
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={openTechModal}
                className="w-full py-2.5 px-3 rounded-lg text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>{t('إرسال طلب فني كشف', 'Request Diagnostic Technician')}</span>
              </button>
              <button
                onClick={openQuoteModal}
                className="w-full py-2.5 px-3 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#C87D55] to-[#A85D35] hover:brightness-110 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{t('طلب دراسة وعرض سعر', 'Request Engineering Quote')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Developer Credit & Rights */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              &copy; {new Date().getFullYear()}{' '}
              <strong className="text-slate-300">
                {lang === 'ar' ? 'العريقي إنفركول (AL-ARRIQI INVERCOOL)' : 'AL-ARRIQI INVERCOOL'}
              </strong>
              . {t('جميع الحقوق محفوظة.', 'All Rights Reserved.')}
            </span>
          </div>

          {/* DEVELOPER SIGNATURE - IMMUTABLE COMPLIANCE */}
          <div className="p-3 bg-[#0B192C]/80 rounded-xl border border-slate-800 text-slate-300 text-center md:text-right shadow-sm">
            <div className="flex items-center justify-center md:justify-end gap-1.5 text-xs text-[#C87D55] font-bold">
              <span>{t('تصميم وتطوير وبرمجة النظام:', 'Designed & Developed by:')}</span>
              <span className="text-white font-black">{developerName}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-center md:justify-end gap-3" dir="ltr">
              <a href={`tel:${developerPhone1}`} className="hover:text-white transition-colors">
                📞 {developerPhone1}
              </a>
              <span>•</span>
              <a href={`tel:${developerPhone2}`} className="hover:text-white transition-colors">
                📱 {developerPhone2}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
