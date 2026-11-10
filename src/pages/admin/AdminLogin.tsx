import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useSettings } from '../../context/SettingsContext.js';
import {
  Lock,
  User,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Clock,
  Fingerprint,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import {
  verifyCredentials,
  getLockoutRemainingSeconds,
  DEFAULT_ADMIN_USERNAME,
  OFFICIAL_ADMIN_PASSWORD,
  authenticateWithBiometrics,
  isBiometricAvailable,
  isBiometricEnrolled
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
  const [username, setUsername] = useState('Ahmed');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [biometricNotice, setBiometricNotice] = useState('');
  const [hasBiometrics, setHasBiometrics] = useState(true);
  const [error, setError] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(() => getLockoutRemainingSeconds());

  useEffect(() => {
    isBiometricAvailable().then((avail) => setHasBiometrics(avail));
  }, []);

  // Countdown timer for brute-force lockout
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

  const handleSuccessfulAuth = (authUsername?: string) => {
    const localToken = 'local_session_' + Date.now();
    const localUser = {
      id: 'admin-1',
      username: (authUsername || username || DEFAULT_ADMIN_USERNAME).trim(),
      role: 'super_admin' as const
    };

    login(localToken, localUser);
    setLoading(false);
    setBiometricLoading(false);

    if (onLoginSuccess) {
      onLoginSuccess();
    } else if (onSuccess) {
      onSuccess();
    }
  };

  // Biometric / Fingerprint Authentication Handler
  const handleBiometricAuth = async () => {
    setError('');
    setBiometricNotice('');
    setBiometricLoading(true);

    try {
      const result = await authenticateWithBiometrics();

      if (result.success) {
        setBiometricNotice(t('تم التحقق من بصمة الإصبع بنجاح!', 'Biometric authentication successful!'));
        setTimeout(() => {
          handleSuccessfulAuth('Ahmed');
        }, 300);
        return;
      }

      setBiometricLoading(false);
      if (result.error) {
        setError(result.error);
      }
    } catch (err: any) {
      setBiometricLoading(false);
      setError(err?.message || 'فشل في قراءة البصمة.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBiometricNotice('');

    const trimmedUser = (username || '').trim();
    const trimmedPass = (password || '').trim();

    // Direct immediate check for official credentials
    const isDirectMatch =
      (trimmedUser.toLowerCase() === 'ahmed' || trimmedUser.toLowerCase() === 'admin' || !trimmedUser) &&
      (trimmedPass === '772302504Ahmed' || trimmedPass.toLowerCase() === '772302504ahmed' || trimmedPass === '772302504A$');

    if (isDirectMatch) {
      setLockoutRemaining(0);
      handleSuccessfulAuth(trimmedUser || 'Ahmed');
      return;
    }

    // Check lockout before attempting non-matching credentials
    const remainingSeconds = getLockoutRemainingSeconds();
    if (remainingSeconds > 0) {
      setLockoutRemaining(remainingSeconds);
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      setError(
        t(
          `تم قفل تسجيل الدخول مؤقتاً. يرجى استخدام كلمة المرور المعتمدة: 772302504Ahmed`,
          `Locked. Use official password: 772302504Ahmed`
        )
      );
      return;
    }

    setLoading(true);

    try {
      const result = await verifyCredentials(username, password);

      if (result.success) {
        handleSuccessfulAuth(username);
        return;
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
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
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
            {t('العريقي إنفركول - بوابة تسجيل الدخول الرسمية', 'AL-ARRIQI INVERCOOL - Official Admin Portal')}
          </p>
        </div>

        {/* Lockout Warning Box */}
        {isLocked && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-900 space-y-2 text-center animate-pulse">
            <div className="flex items-center justify-center gap-2 font-bold text-sm text-amber-800">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>{t('النظام في وضع القفل المؤقت', 'System Temporarily Locked')}</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              {t(
                'تم تجاوز المحاولات الخاطئة. تم قفل تسجيل الدخول مؤقتاً.',
                'Exceeded failed attempts. Login is temporarily locked for security.'
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

        {/* Biometric Success Notice */}
        {biometricNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{biometricNotice}</span>
          </div>
        )}

        {/* 1. BIOMETRIC / FINGERPRINT QUICK AUTHENTICATION BUTTON */}
        <div className="space-y-2">
          <button
            type="button"
            disabled={biometricLoading || isLocked}
            onClick={handleBiometricAuth}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-[0.98] border border-emerald-400/30 group"
          >
            <Fingerprint className={`w-5 h-5 text-emerald-200 transition-transform ${biometricLoading ? 'animate-bounce' : 'group-hover:scale-110'}`} />
            <span>
              {biometricLoading
                ? t('جاري قراءة بصمة الإصبع...', 'Verifying fingerprint sensor...')
                : isBiometricEnrolled()
                ? t('تسجيل الدخول ببصمة الإصبع المحفوظة', 'Touch ID / Fingerprint Sign In')
                : t('تسجيل الدخول ببصمة الإصبع (Biometric)', 'Fingerprint / Biometric Login')}
            </span>
          </button>
          <p className="text-[10px] text-center text-slate-400">
            {t('مصادقة بيومترية سريعة وآمنة عبر مستشعر البصمة في الهاتف أو الجهاز', 'Quick biometric authentication via native device fingerprint/FaceID sensor')}
          </p>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 shrink-0">
            {t('أو الدخول بكلمة المرور', 'or login with password')}
          </span>
        </div>

        {/* 2. PASSWORD FORM */}
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                {t('كلمة المرور (Password)', 'Password')}
              </label>
              <button
                type="button"
                onClick={() => setPassword(OFFICIAL_ADMIN_PASSWORD)}
                className="text-[10px] text-[#C87D55] hover:underline font-bold flex items-center gap-1"
                title="تعبئة الرمز المعتمد"
              >
                <Sparkles className="w-3 h-3" />
                <span>{t('تعبئة الرمز المعتمد', 'Autofill Official')}</span>
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLocked}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="772302504Ahmed"
                className="w-full ps-9 pe-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C87D55] disabled:opacity-50 disabled:cursor-not-allowed font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
              <span>{t('كلمة المرور المعتمدة:', 'Official Password:')}</span>
              <code className="font-mono font-bold text-[#C87D55]">{OFFICIAL_ADMIN_PASSWORD}</code>
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
                ? t('جاري التحقق...', 'Authenticating...')
                : isLocked
                ? t(`مغلق (${formattedLockTime})`, `Locked (${formattedLockTime})`)
                : t('تسجيل الدخول للوحة التحكم', 'Sign In to Dashboard')}
            </span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('العودة للموقع الرئيسي', 'Back to website')}</span>
          </button>
          <span className="text-slate-400 font-mono text-[10px]">
            AL-ARRIQI INVERCOOL
          </span>
        </div>
      </div>
    </div>
  );
};

