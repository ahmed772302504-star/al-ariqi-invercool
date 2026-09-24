import React from 'react';
import { useTheme } from '../../context/ThemeContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { Sun, Moon, Eye, Sparkles } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'topbar' | 'button' | 'segmented' | 'floating';
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'button',
  className = '',
  showLabel = true
}) => {
  const { theme, isLight, toggleTheme, setTheme } = useTheme();
  const { language, t } = useLanguage();

  // Screen reader accessible announcement
  const labelText = isLight
    ? t('الوضع الكحلي', 'Navy Theme')
    : t('عالي التباين', 'High Contrast');

  const fullLabel = isLight
    ? t('التبديل إلى الوضع الكحلي الاحترافي', 'Switch to Professional Navy Theme')
    : t('التبديل إلى الوضع الفاتح عالي التباين', 'Switch to High-Contrast Light Mode');

  if (variant === 'topbar') {
    return (
      <button
        onClick={toggleTheme}
        id="header-theme-toggle"
        role="switch"
        aria-checked={isLight}
        aria-label={fullLabel}
        title={fullLabel}
        className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded transition font-medium text-xs border ${
          isLight
            ? 'bg-white hover:bg-slate-100 text-[#0B192C] border-slate-300 shadow-sm'
            : 'bg-slate-800/80 hover:bg-slate-700 text-[#C87D55] border-slate-700'
        } ${className}`}
      >
        {isLight ? (
          <>
            <Moon className="w-3 h-3 text-[#0B192C]" aria-hidden="true" />
            {showLabel && <span>{t('الوضع الكحلي', 'Navy')}</span>}
          </>
        ) : (
          <>
            <Sun className="w-3 h-3 text-amber-400" aria-hidden="true" />
            {showLabel && <span>{t('عالي التباين', 'High Contrast')}</span>}
          </>
        )}
      </button>
    );
  }

  if (variant === 'segmented') {
    return (
      <div
        role="radiogroup"
        aria-label={t('اختيار مظهر الموقع وإمكانية الوصول', 'Website appearance and accessibility')}
        className={`p-1 rounded-2xl flex items-center gap-1 ${
          isLight
            ? 'bg-slate-200 border border-slate-300'
            : 'bg-slate-800/80 border border-slate-700'
        } ${className}`}
      >
        <button
          type="button"
          role="radio"
          aria-checked={!isLight}
          onClick={() => setTheme('navy')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition ${
            !isLight
              ? 'bg-[#0B192C] text-[#C87D55] shadow-md border border-[#C87D55]/30'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>{t('الوضع الكحلي (الافتراضي)', 'Navy Theme (Default)')}</span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={isLight}
          onClick={() => setTheme('light')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition ${
            isLight
              ? 'bg-white text-[#0B192C] shadow-md border border-slate-300'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>{t('الفاتح عالي التباين (وضوح الشمس)', 'High-Contrast Light')}</span>
        </button>
      </div>
    );
  }

  if (variant === 'floating') {
    return (
      <button
        onClick={toggleTheme}
        id="floating-theme-toggle"
        role="switch"
        aria-checked={isLight}
        aria-label={fullLabel}
        title={fullLabel}
        className={`group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border ${
          isLight
            ? 'bg-white text-[#0B192C] border-slate-300 hover:bg-slate-50 ring-2 ring-slate-400'
            : 'bg-[#0B192C] text-amber-400 border-slate-700 hover:bg-[#1E3E62]'
        } ${className}`}
      >
        {isLight ? (
          <Moon className="w-5 h-5 text-[#0B192C]" aria-hidden="true" />
        ) : (
          <Sun className="w-5 h-5 text-amber-400" aria-hidden="true" />
        )}
        <span className="absolute end-full me-3 px-3 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
          {fullLabel}
        </span>
      </button>
    );
  }

  // Default button variant
  return (
    <button
      onClick={toggleTheme}
      id="theme-toggle-btn"
      role="switch"
      aria-checked={isLight}
      aria-label={fullLabel}
      title={fullLabel}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
        isLight
          ? 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300 shadow-sm'
          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
      } ${className}`}
    >
      {isLight ? (
        <>
          <Moon className="w-3.5 h-3.5 text-[#0B192C]" aria-hidden="true" />
          <span>{t('الوضع الكحلي', 'Navy Theme')}</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          <span>{t('عالي التباين', 'High Contrast')}</span>
        </>
      )}
    </button>
  );
};
