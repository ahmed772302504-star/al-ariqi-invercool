import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useSettings } from '../../context/SettingsContext.js';
import { Lock, User, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onSuccess?: () => void;
  onLoginSuccess?: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onLoginSuccess, onCancel }) => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const { settings, logoIconUrl } = useSettings();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data.token && data.user) {
        login(data.token, data.user);
        if (onLoginSuccess) {
          onLoginSuccess();
        } else if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(data.error || t('اسم المستخدم أو كلمة المرور غير صحيحة، أو تم تجاوز عدد المحاولات المسموح بها.', 'Invalid username or password, or rate limit exceeded.'));
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Login error');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
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
            {t('لوحة تحكم الإدارة', 'Admin Portal')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('العريقي إنفركول - بوابة تسجيل الدخول الآمنة', 'AL-ARRIQI INVERCOOL - Secure Administrative Access')}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('اسم المستخدم (Admin Username)', 'Username')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('أدخل اسم المستخدم', 'Enter username')}
                className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#C87D55]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('كلمة المرور (Password)', 'Password')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#C87D55]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="admin-login-submit"
            className="w-full py-3 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] disabled:bg-slate-300 text-white font-bold text-sm shadow-md transition"
          >
            {loading ? t('جاري التحقق...', 'Authenticating...') : t('تسجيل الدخول للوحة التحكم', 'Sign In to Dashboard')}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <button onClick={onCancel} className="text-slate-500 hover:text-slate-800">
            ← {t('العودة للموقع الرئيسي', 'Back to main website')}
          </button>
          <span className="text-slate-400 font-mono text-[10px]">
            AL-ARRIQI v2.0
          </span>
        </div>
      </div>
    </div>
  );
};
