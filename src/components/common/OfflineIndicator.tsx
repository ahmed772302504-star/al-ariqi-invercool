import React, { useState } from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { WifiOff, Database, X } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (isOnline) {
    return null;
  }

  if (dismissed) {
    return (
      <button
        onClick={() => setDismissed(false)}
        className="fixed bottom-4 start-4 z-50 p-2.5 rounded-full bg-amber-600 text-white shadow-xl hover:bg-amber-700 transition flex items-center justify-center border-2 border-white"
        title={t('أنت في وضع عدم الاتصال', 'You are currently offline')}
      >
        <WifiOff className="w-5 h-5 animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 start-5 end-5 sm:end-auto sm:max-w-md z-50 animate-bounce-once">
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0B192C] text-white shadow-2xl border border-amber-500/50 flex items-start gap-3 backdrop-blur-md">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
          <WifiOff className="w-5 h-5" />
        </div>

        <div className="flex-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-0.5">
            <Database className="w-3.5 h-3.5" />
            <span>{t('وضع التصفح دون إنترنت (المناطق النائية)', 'Offline Browsing Mode (Remote Areas)')}</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
            {t(
              'لا يتوفر اتصال بالشبكة حالياً. موقع العريقي إنفركول يعمل الآن بكفاءة من الذاكرة المحلية المخزنة وتصفح الصور والمشاريع متاح.',
              'No active connection. Browsing cached services, project photos, and contacts seamlessly offline.'
            )}
          </p>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          aria-label="Dismiss offline notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
