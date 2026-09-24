import React from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { useSettings } from '../../context/SettingsContext.js';
import { ThemeToggle } from '../common/ThemeToggle.js';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  Code2
} from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { language, t } = useLanguage();
  const { isLight } = useTheme();
  const { settings, logoIconUrl } = useSettings();

  const handleNav = (route: string) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={`pt-16 pb-8 transition-colors duration-200 border-t ${
        isLight
          ? 'bg-white text-slate-800 border-slate-300'
          : 'bg-[#060E18] text-slate-300 border-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b ${
            isLight ? 'border-slate-300' : 'border-slate-800'
          }`}
        >
          {/* Column 1: Company Brand & Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-14 h-14 rounded-2xl border-2 border-[#C87D55] p-1.5 flex items-center justify-center shadow-lg overflow-hidden shrink-0 ${
                  isLight ? 'bg-slate-100' : 'bg-[#060E18]'
                }`}
              >
                <img
                  key={`footer-logo-${settings?.logoUpdatedAt || settings?.updatedAt || 'init'}`}
                  src={logoIconUrl}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo-icon.svg';
                  }}
                  alt="AL-ARRIQI INVERCOOL"
                  className="w-full h-full object-contain filter drop-shadow transition-all duration-300"
                />
              </div>
              <div>
                <h3
                  className={`text-xl font-black tracking-wide ${
                    isLight ? 'text-slate-950' : 'text-white'
                  }`}
                >
                  {language === 'ar' ? 'العريقي إنفركول' : 'AL-ARRIQI INVERCOOL'}
                </h3>
                <p
                  className={`text-xs font-semibold ${
                    isLight ? 'text-[#A85D35]' : 'text-[#C87D55]'
                  }`}
                >
                  {language === 'ar' ? 'حلول متكاملة للتكييف والتبريد' : 'Integrated HVAC Solutions'}
                </p>
              </div>
            </div>

            <p
              className={`text-sm leading-relaxed ${
                isLight ? 'text-slate-700 font-normal' : 'text-slate-400'
              }`}
            >
              {t(
                'الريادة الهندسية المتخصصة في أنظمة التكييف والتبريد وأنظمة HVAC والتبريد المركزي وغرف التبريد الكبيرة في كافة محافظات الجمهورية اليمنية.',
                'Specialized engineering leadership in HVAC systems, central refrigeration, and commercial cold rooms across all Yemen governorates.'
              )}
            </p>

            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-800'
                  : 'bg-[#0B192C] border-slate-700 text-[#C87D55]'
              }`}
            >
              <span>🇾🇪</span>
              <span>{t('نخدمكم في جميع محافظات الجمهورية اليمنية', 'Serving all governorates in Yemen')}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4
              className={`font-bold text-base mb-4 flex items-center gap-2 border-b pb-2 ${
                isLight ? 'text-slate-950 border-slate-300' : 'text-white border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#C87D55]"></span>
              <span>{t('روابط سريعة', 'Quick Links')}</span>
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { route: 'services', ar: 'جميع الخدمات الهندسية', en: 'All Engineering Services' },
                { route: 'products', ar: 'كتالوج المنتجات وقطع الغيار', en: 'Products & Spare Parts Catalog' },
                { route: 'projects', ar: 'المشاريع المنفذة', en: 'Executed Projects' },
                { route: 'gallery', ar: 'معرض الأعمال والصور', en: 'Work Gallery' },
                { route: 'reviews', ar: 'آراء وتقييمات العملاء', en: 'Client Reviews' },
              ].map((item) => (
                <li key={item.route}>
                  <button
                    onClick={() => handleNav(item.route)}
                    className={`transition flex items-center gap-1.5 ${
                      isLight
                        ? 'text-slate-700 hover:text-[#A85D35] font-medium'
                        : 'text-slate-400 hover:text-[#C87D55]'
                    }`}
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#C87D55]" />
                    <span>{t(item.ar, item.en)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Action Portal */}
          <div>
            <h4
              className={`font-bold text-base mb-4 flex items-center gap-2 border-b pb-2 ${
                isLight ? 'text-slate-950 border-slate-300' : 'text-white border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#C87D55]"></span>
              <span>{t('طلبات الصيانة والمشاريع', 'Service & Quote Portal')}</span>
            </h4>
            <div className="space-y-2.5">
              <button
                onClick={() => handleNav('request-service')}
                className={`w-full text-start px-3.5 py-2 rounded-lg border text-sm font-semibold transition flex items-center justify-between ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-900 shadow-sm'
                    : 'bg-[#0B192C] hover:bg-[#1E3E62] border-slate-700 text-slate-200'
                }`}
              >
                <span>{t('اطلب صيانة فورية', 'Request Maintenance')}</span>
                <span className="text-[#C87D55] text-xs font-bold">←</span>
              </button>
              <button
                onClick={() => handleNav('request-quote')}
                className={`w-full text-start px-3.5 py-2 rounded-lg border text-sm font-semibold transition flex items-center justify-between ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-900 shadow-sm'
                    : 'bg-[#0B192C] hover:bg-[#1E3E62] border-slate-700 text-slate-200'
                }`}
              >
                <span>{t('اطلب عرض سعر لمشروعك', 'Request Project Quote')}</span>
                <span className="text-[#C87D55] text-xs font-bold">←</span>
              </button>
              <button
                onClick={() => handleNav('request-technician')}
                className={`w-full text-start px-3.5 py-2 rounded-lg border text-sm font-semibold transition flex items-center justify-between ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-900 shadow-sm'
                    : 'bg-[#0B192C] hover:bg-[#1E3E62] border-slate-700 text-slate-200'
                }`}
              >
                <span>{t('اطلب زيارة فني متخصص', 'Book a Technician Visit')}</span>
                <span className="text-[#C87D55] text-xs font-bold">←</span>
              </button>
            </div>

            <div
              className={`mt-4 pt-3 border-t text-xs space-y-1 ${
                isLight ? 'border-slate-300 text-slate-700' : 'border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C87D55]" />
                <span>{t('السبت - الخميس: 8:00 ص - 8:00 م', 'Sat - Thu: 8:00 AM - 8:00 PM')}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('طوارئ التبريد والصيانة: 24/7', 'Emergency Repairs: 24/7')}</span>
              </div>
            </div>
          </div>

          {/* Column 4: Official Company Contact Details */}
          <div>
            <h4
              className={`font-bold text-base mb-4 flex items-center gap-2 border-b pb-2 ${
                isLight ? 'text-slate-950 border-slate-300' : 'text-white border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#C87D55]"></span>
              <span>{t('بيانات التواصل الرسمية', 'Official Company Contact')}</span>
            </h4>

            <div className="space-y-3 text-sm">
              <div
                className={`p-3 rounded-xl border space-y-1.5 ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#0B192C] border-slate-700'
                }`}
              >
                <div className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                  {t('رقم هاتف الشركة الرسمي:', 'Company Official Phone:')}
                </div>
                <a
                  href="tel:770931413"
                  id="footer-company-phone"
                  className={`flex items-center gap-2 font-bold text-base transition ${
                    isLight ? 'text-slate-950 hover:text-[#A85D35]' : 'text-white hover:text-[#C87D55]'
                  }`}
                >
                  <Phone className="w-4 h-4 text-[#C87D55]" />
                  <span className="dir-ltr font-mono">770931413</span>
                </a>
              </div>

              <div
                className={`p-3 rounded-xl border space-y-1.5 ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#0B192C] border-slate-700'
                }`}
              >
                <div className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                  {t('خدمة العملاء عبر WhatsApp:', 'Company WhatsApp:')}
                </div>
                <a
                  href="https://wa.me/967770931413"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="footer-company-whatsapp"
                  className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold text-base transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <span className="dir-ltr font-mono">770931413</span>
                </a>
              </div>

              <div
                className={`flex items-center gap-2 text-xs ${
                  isLight ? 'text-slate-700 font-medium' : 'text-slate-400'
                }`}
              >
                <MapPin className="w-4 h-4 text-[#C87D55] shrink-0" />
                <span>{t('الجمهورية اليمنية - كافة المحافظات', 'Republic of Yemen - All Governorates')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal, Theme Switcher & Policy Links */}
        <div
          className={`py-6 flex flex-wrap justify-between items-center gap-4 text-xs border-b ${
            isLight ? 'text-slate-700 border-slate-300' : 'text-slate-400 border-slate-800/80'
          }`}
        >
          <div>
            © {new Date().getFullYear()}{' '}
            {language === 'ar' ? 'العريقي إنفركول (AL-ARRIQI INVERCOOL)' : 'AL-ARRIQI INVERCOOL'}.{' '}
            {t('جميع الحقوق محفوظة.', 'All rights reserved.')}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Direct Theme Switcher In Footer */}
            <ThemeToggle variant="button" />

            <button
              onClick={() => handleNav('privacy')}
              id="footer-privacy-link"
              className={`transition ${isLight ? 'hover:text-black font-medium' : 'hover:text-slate-200'}`}
            >
              {t('سياسة الخصوصية', 'Privacy Policy')}
            </button>
            <button
              onClick={() => handleNav('terms')}
              id="footer-terms-link"
              className={`transition ${isLight ? 'hover:text-black font-medium' : 'hover:text-slate-200'}`}
            >
              {t('الشروط والأحكام', 'Terms & Conditions')}
            </button>
            <button
              onClick={() => handleNav('admin-login')}
              id="footer-admin-link"
              className="text-amber-600 hover:text-amber-700 font-bold transition"
            >
              {t('لوحة الإدارة', 'Admin Portal')}
            </button>
          </div>
        </div>

        {/* Developer Attribution with full clearance and clean visual hierarchy */}
        <div
          className={`pt-6 mt-4 pb-20 sm:pb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-5 rounded-2xl border shadow-sm ${
            isLight
              ? 'bg-slate-50 border-slate-300 text-slate-900'
              : 'bg-[#04080F] border-slate-800/80 text-slate-200 shadow-inner'
          }`}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-xs">
            <div
              className={`flex items-center gap-2.5 font-bold ${
                isLight ? 'text-slate-950' : 'text-slate-200'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-[#C87D55]/20 border border-[#C87D55] flex items-center justify-center text-[#C87D55]">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="text-sm">
                {t(
                  'تمت البرمجة والتطوير بواسطة: م/ أحمد وليد العريقي',
                  'Engineered & Developed by: Eng. Ahmed Waleed Al-Arriqi'
                )}
              </span>
            </div>

            {/* Developer Contact 1 & 2 */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {/* Phone 1 */}
              <div
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition shadow-sm ${
                  isLight
                    ? 'bg-white border-slate-300 hover:border-[#C87D55]'
                    : 'bg-[#0B192C] border-slate-700 hover:border-[#C87D55] shadow-md'
                }`}
              >
                <span className="text-xs font-bold text-[#C87D55]">{t('مطور 1:', 'Dev 1:')}</span>
                <a
                  href="tel:772302504"
                  id="dev-phone-1"
                  className={`font-mono font-bold transition tracking-wider text-sm dir-ltr ${
                    isLight ? 'text-slate-950 hover:text-[#C87D55]' : 'text-white hover:text-[#C87D55]'
                  }`}
                  title="اتصال مباشر بالمطور"
                >
                  772302504
                </a>
                <a
                  href="https://wa.me/967772302504"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="dev-whatsapp-1"
                  className="p-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1"
                  title="واتساب المطور 1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">واتساب</span>
                </a>
              </div>

              {/* Phone 2 */}
              <div
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition shadow-sm ${
                  isLight
                    ? 'bg-white border-slate-300 hover:border-[#C87D55]'
                    : 'bg-[#0B192C] border-slate-700 hover:border-[#C87D55] shadow-md'
                }`}
              >
                <span className="text-xs font-bold text-[#C87D55]">{t('مطور 2:', 'Dev 2:')}</span>
                <a
                  href="tel:738603124"
                  id="dev-phone-2"
                  className={`font-mono font-bold transition tracking-wider text-sm dir-ltr ${
                    isLight ? 'text-slate-950 hover:text-[#C87D55]' : 'text-white hover:text-[#C87D55]'
                  }`}
                  title="اتصال مباشر بالمطور"
                >
                  738603124
                </a>
                <a
                  href="https://wa.me/967738603124"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="dev-whatsapp-2"
                  className="p-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1"
                  title="واتساب المطور 2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">واتساب</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
