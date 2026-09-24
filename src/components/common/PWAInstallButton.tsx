import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { Download, Share2, X, Smartphone } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'floating' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'navbar',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { t } = useLanguage();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // If not installable and not iOS, no prompt to show
  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <>
      {isInstallable && (
        <button
          onClick={install}
          title={t('تثبيت التطبيق على جهازك للعمل دون إنترنت', 'Install App on your device for offline use')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition duration-200 shadow-sm ${
            variant === 'navbar'
              ? 'bg-[#C87D55] text-white hover:bg-[#B86B3E]'
              : 'bg-[#0B192C] text-white hover:bg-slate-800'
          } ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t('تثبيت التطبيق', 'Install App')}</span>
        </button>
      )}

      {isIOS && !isInstallable && (
        <button
          onClick={() => setShowIOSGuide(true)}
          title={t('تثبيت التطبيق على الآيفون', 'Install App on iPhone')}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold text-xs border border-slate-300 text-slate-700 hover:bg-slate-100 transition ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-[#C87D55]" />
          <span>{t('تثبيت التطبيق', 'Install App')}</span>
        </button>
      )}

      {/* iOS Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-right space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-[#C87D55]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {t('تثبيت التطبيق على آيفون / آيباد', 'Install on iPhone / iPad')}
                </h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0B192C] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  1
                </span>
                <span>
                  {t('اضغط على زر المشاركة', 'Tap the Share icon')}{' '}
                  <Share2 className="w-3.5 h-3.5 inline mx-1 text-blue-600" />{' '}
                  {t('في شريط متصفح سفاري بالأسفل.', 'in Safari toolbar.')}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0B192C] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  2
                </span>
                <span>
                  {t(
                    'قم بالتمرير للأسفل واختر "إضافة إلى الشاشة الرئيسية".',
                    'Scroll down and select "Add to Home Screen".'
                  )}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0B192C] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  3
                </span>
                <span>
                  {t('سيصبح التطبيق متاحاً ويعمل حتى دون اتصال بالإنترنت.', 'The app will work instantly even without internet.')}
                </span>
              </p>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-[#0B192C] text-white text-xs font-bold hover:bg-slate-800 transition"
            >
              {t('حسناً، فهمت', 'Got it')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
