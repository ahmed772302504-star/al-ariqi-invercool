import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useSettings } from '../../context/SettingsContext.js';
import { Lock, User, ShieldCheck, AlertCircle, ArrowLeft, Clock } from 'lucide-react';
import {
  verifyCredentials,
  getLockoutRemainingSeconds,
  DEFAULT_ADMIN_USERNAME,
  DEFAULT_ADMIN_PASSWORD_RAW
} from '../../utils/security.js';

interface AdminLoginProps {
  onSuccess?: () => void;
  onLoginSuccess?: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onLoginSuccess, onCancel }) => {
  const { login } = useAuth();
  const { language, t } = useLanguage();
  const { settings, logoIconUrl } = useSettings();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(() => getLockoutRemainingSeconds());

  // Countdown timer for 15-minute brute-force lockout
  useEffect(() => {
    if (lockoutRemaining <= 0) return;

    const timer = setInterval(() => {
      const remaining = getLockoutRemainingSeconds();
      setLockoutRemaining(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        setError('');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check lockout before attempting
    const remainingSeconds = getLockoutRemainingSeconds();
    if (remainingSeconds > 0) {
      setLockoutRemaining(remainingSeconds);
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      setError(
        t(
          `تم قفل تسجيل الدخول مؤقتاً بسبب 3 محاولات خاطئة. يرجى الانتظار (${minutes}:${seconds.toString().padStart(2, '0')}) دقيقة.`,
          `Login temporarily locked due to 3 failed attempts. Please wait (${minutes}:${seconds.toString().padStart(2, '0')}).`
        )
      );
      return;
    }

    setLoading(true);

    try {
      // 1. Verify credentials with SHA-256 via Web Crypto API
      const result = await verifyCredentials(username, password);

      if (result.success) {
        const localToken = 'local_session_' + Date.now();
        const localUser = {
          id: 'admin-1',
          username: username.trim() || DEFAULT_ADMIN_USERNAME,
          role: 'super_admin' as const
        };

        login(localToken, localUser);
        setLoading(false);

        if (onLoginSuccess) {
          onLoginSuccess();
        } else if (onSuccess) {
          onSuccess();
        }
        return;
      }

      // Check if this attempt caused a lock
      const lockAfter = getLockoutRemainingSeconds();
      if (lockAfter > 0) {
        setLockoutRemaining(lockAfter);
      }

      setLoading(false);
      setError(result.error || t('بيانات الدخول غير صحيحة.', 'Invalid credentials.'));
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Login error');
    }
  };

  const isLocked = lockoutRemaining > 0;
  const lockMinutes = Math.floor(lockoutRemaining / 60);
  const lockSeconds = lockoutRemaining % 60;
  const formattedLockTime = `${lockMinutes}:${lockSeconds.toString().padStart(2, '0')}`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 rounded-3xl bg-[#060E18] border-2 border-[#C87D55] p-2 flex items-center justify-center mx-auto shadow-xl overflow-hidden">
            <img
              key={`login-logo-${settings?.logoUpdatedAt || settings?.updatedAt || 'init'}`}
              src={logoIconUrl}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo-icon.svg';
              }}
              alt="AL-ARRIQI INVERCOOL"
              className="w-full h-full object-contain filter drop-shadow transition-all duration-300"
            />
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {t('لوحة تحكم الإدارة الآمنة', 'Secure Admin Portal')}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {t('العريقي إنفركول - بوابة تسجيل الدخول المشفرة (SHA-256)', 'AL-ARRIQI INVERCOOL - SHA-256 Encrypted Access')}
          </p>
        </div>

        {/* Lockout Warning Box with Live Real-time Countdown */}
        {isLocked && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-900 space-y-2 text-center animate-pulse">
            <div className="flex items-center justify-center gap-2 font-bold text-sm text-amber-800">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>{t('النظام في وضع القفل المؤقت', 'System Temporarily Locked')}</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              {t(
                'تم تجاوز 3 محاولات خاطئة متتالية. لحماية النظام تم قفل الدخول مؤقتاً.',
                'Exceeded 3 failed attempts. Login is temporarily locked for security.'
              )}
            </p>
            <div className="inline-block px-4 py-1.5 rounded-xl bg-amber-600 text-white font-mono font-bold text-lg tracking-wider">
              {formattedLockTime}
            </div>
          </div>
        )}

        {/* Regular Error Notification */}
        {error && !isLocked && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('اسم المستخدم (Username)', 'Username')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                disabled={isLocked}
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ahmed"
                className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C87D55] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('كلمة المرور المشفرة (SHA-256 Password)', 'Password')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                disabled={isLocked}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C87D55] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || isLocked}
            id="admin-login-submit"
            className="w-full py-3 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#C87D55]" />
            <span>
              {loading
                ? t('جاري التحقق عبر SHA-256...', 'Authenticating via SHA-256...')
                : isLocked
                ? t(`مغلق (${formattedLockTime})`, `Locked (${formattedLockTime})`)
                : t('تسجيل الدخول الآمن للوحة', 'Secure Dashboard Sign In')}
            </span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('العودة للموقع الرئيسي', 'Back to website')}</span>
          </button>
          <span className="text-slate-400 font-mono text-[10px]">
            SHA-256 • AL-ARRIQI
          </span>
        </div>
      </div>
    </div>
  );
};
