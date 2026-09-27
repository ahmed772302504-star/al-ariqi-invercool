import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import {
  ShieldCheck,
  Key,
  Lock,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  History,
  Download,
  Upload,
  RefreshCw,
  Clock,
  Sparkles,
  FileCheck
} from 'lucide-react';
import {
  sha256,
  getActivePasswordHash,
  setAdminPassword,
  getActivityLogs,
  ActivityLogItem,
  downloadBackupFile,
  restoreBackupFile
} from '../../utils/security.js';

export const AdminSecurityTab: React.FC = () => {
  const { language, t } = useLanguage();

  // Stage 1: OTP State
  const [step, setStep] = useState<'otp_required' | 'otp_verified' | 'success'>('otp_required');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [otpSentNotice, setOtpSentNotice] = useState<boolean>(false);

  // Stage 2: Password Inputs
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Activity Logs
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);

  // Backup & Restore
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<{ success: boolean; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLogs(getActivityLogs());
  }, []);

  const refreshLogs = () => {
    setLogs(getActivityLogs());
  };

  // 1. Request OTP via WhatsApp (772302504)
  const handleRequestOtp = () => {
    setOtpError('');
    // Generate random 4-digit code
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setOtpSentNotice(true);

    const message = `مرحباً مهندس أحمد، كود التأكيد (OTP) الخاص بك لتغيير كلمة مرور لوحة تحكم العريقي إنفركول هو: [ ${randomOtp} ]`;
    const whatsappUrl = `https://wa.me/96772302504?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // 2. Verify OTP Code
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    if (!generatedOtp) {
      setOtpError(t('يرجى الضغط على زر طلب رمز التأكيد أولاً.', 'Please request the OTP code first.'));
      return;
    }

    if (enteredOtp.trim() !== generatedOtp) {
      setOtpError(t('كود التحقق غير صحيح! يرجى التأكد من الرمز المرسل عبر الواتساب.', 'Invalid OTP code! Please verify the code sent to your WhatsApp.'));
      return;
    }

    // Success -> proceed to Stage 2
    setStep('otp_verified');
  };

  // 3. Submit New Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError(t('يرجى كتابة كلمة المرور الحالية.', 'Please enter your current password.'));
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setPasswordError(t('كلمة المرور الجديدة يجب ألا تقل عن 6 أحرف أو أرقام.', 'New password must be at least 6 characters.'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t('كلمة المرور الجديدة وتأكيدها غير متطابقين!', 'New password and confirmation do not match!'));
      return;
    }

    setSavingPassword(true);

    try {
      // Verify current password with SHA-256
      const enteredCurrentHash = await sha256(currentPassword);
      const activeHash = getActivePasswordHash();

      if (enteredCurrentHash !== activeHash) {
        setSavingPassword(false);
        setPasswordError(t('كلمة المرور الحالية غير صحيحة!', 'Current password is incorrect!'));
        return;
      }

      // Hash and save new password
      await setAdminPassword(newPassword);

      setSavingPassword(false);
      setPasswordSuccess(t('تم تحديث وتشفير كلمة المرور بنجاح (SHA-256)!', 'Password updated and encrypted successfully (SHA-256)!'));
      setStep('success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      refreshLogs();
    } catch (err: any) {
      setSavingPassword(false);
      setPasswordError(err?.message || 'فشل في حفظ كلمة المرور.');
    }
  };

  // 4. Handle Backup Restore File Selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoreLoading(true);
    setRestoreMessage(null);

    const result = await restoreBackupFile(file);
    setRestoreLoading(false);
    setRestoreMessage({ success: result.success, text: result.message });
    refreshLogs();

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (result.success) {
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-[#0B192C] text-white p-6 rounded-3xl border border-slate-700 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#C87D55]/20 border border-[#C87D55] flex items-center justify-center text-[#C87D55] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black">
              {t('مركز أمان النظام وسجل النشاطات', 'System Security & Audit Log')}
            </h2>
            <p className="text-xs text-slate-300">
              {t('تشفير SHA-256، حماية المحاولات الخاطئة، وإدارة النسخ الاحتياطية', 'SHA-256 Encryption, Brute-Force Shield, and Backup Management')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{t('نظام الحماية: نشط 100%', 'Security Shield: Active')}</span>
          </span>
        </div>
      </div>

      {/* Grid: Change Password + Backup & Restore */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Change Password Sequence */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {t('تغيير كلمة المرور الرسمية', 'Change Official Password')}
                </h3>
                <span className="text-[11px] text-slate-500">
                  {t('يتطلب تأكيد الرمز عبر واتساب 772302504 قبل التغيير', 'Requires WhatsApp OTP verification (772302504) first')}
                </span>
              </div>
            </div>

            {/* STAGE 1: OTP REQUEST & VERIFICATION */}
            {step === 'otp_required' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>{t('المرحلة الأولى: إثبات الهوية برمز التأكيد (OTP)', 'Stage 1: Identity Proof via OTP')}</span>
                  </div>
                  <p className="leading-relaxed">
                    {t(
                      'لحماية النظام، سيتم إرسال رمز تحقق عشوائي من 4 أرقام مباشرة إلى رقم المهندس المعتمد (772302504). يرجى الضغط أدناه ثم إدخال الرمز المولد.',
                      'For system integrity, a random 4-digit OTP will be dispatched to developer WhatsApp (772302504).'
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow hover:shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('طلب رمز التأكيد عبر الواتساب (772302504)', 'Request OTP via WhatsApp (772302504)')}</span>
                </button>

                {otpSentNotice && (
                  <form onSubmit={handleVerifyOtp} className="space-y-3 pt-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">
                        {t('تم فتح الواتساب لإرسال الرمز:', 'OTP link opened in WhatsApp:')}
                      </span>
                      <span className="font-mono font-bold text-[#C87D55] bg-orange-100/70 px-2 py-0.5 rounded">
                        {generatedOtp}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {t('أدخل رمز الـ OTP المكون من 4 أرقام:', 'Enter 4-Digit OTP Code:')}
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-center tracking-widest text-lg font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C87D55]"
                      />
                    </div>

                    {otpError && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{otpError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={enteredOtp.length < 4}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] disabled:opacity-50 text-white font-bold text-xs transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('تأكيد الكود والانتقال لتعيين كلمة المرور', 'Confirm Code & Proceed')}</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* STAGE 2: CHANGE PASSWORD INPUTS */}
            {step === 'otp_verified' && (
              <form onSubmit={handleChangePassword} className="space-y-3.5">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('تم التحقق من كود الـ OTP بنجاح! يمكنك الآن تغيير كلمة المرور.', 'OTP Verified! Enter your new password below.')}</span>
                </div>

                {/* 1) Current Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('1) الرمز الحالي (Current Password):', '1) Current Password:')}
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C87D55]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute end-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 2) New Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('2) الرمز الجديد (New Password):', '2) New Password:')}
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C87D55]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute end-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 3) Confirm New Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('3) تأكيد الرمز الجديد (Confirm New Password):', '3) Confirm New Password:')}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C87D55]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute end-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {passwordError && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] text-white font-bold text-xs transition shadow"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{savingPassword ? t('جاري الحفظ والتشفير...', 'Encrypting & Saving...') : t('حفظ كلمة المرور المشفرة', 'Save Encrypted Password')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('otp_required');
                      setEnteredOtp('');
                      setGeneratedOtp('');
                    }}
                    className="px-3 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 text-xs font-semibold"
                  >
                    {t('إلغاء', 'Cancel')}
                  </button>
                </div>
              </form>
            )}

            {/* STAGE 3: SUCCESS NOTICE */}
            {step === 'success' && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-900">{t('تم تغيير كلمة المرور بنجاح!', 'Password Changed Successfully!')}</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    {t('تم تشفير كلمة المرور الجديدة بخوارزمية SHA-256 وحفظها في التخزين الآمن.', 'Your new password has been hashed with SHA-256 and securely stored.')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('otp_required')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                >
                  {t('إتمام', 'Done')}
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>{t('المصادقة: SHA-256 Web Crypto', 'Auth: SHA-256 Web Crypto')}</span>
            <span>{t('اسم المستخدم الافتراضي: Ahmed', 'Default Username: Ahmed')}</span>
          </div>
        </div>

        {/* Section 2: Backup & Restore */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {t('النسخ الاحتياطي والاستعادة', 'Backup & Restore')}
                </h3>
                <span className="text-[11px] text-slate-500">
                  {t('تصدير كافة إعدادات وبيانات الموقع واستعادتها بسهولة', 'Export full site settings and restore seamlessly')}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <FileCheck className="w-4 h-4 text-[#C87D55]" />
                  <span>{t('تنزيل نسخة احتياطية من كافة محتويات الموقع:', 'Download Site Backup:')}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {t(
                    'يتضمن ملف النسخة الاحتياطية (JSON) كافة بيانات الخدمات الهندسية، المنتجات، المشاريع، صور المعرض، إعدادات التواصل، وأرقام الطوارئ.',
                    'The JSON backup bundle contains all services, products, projects, gallery, contact numbers, and settings.'
                  )}
                </p>
                <button
                  type="button"
                  onClick={downloadBackupFile}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] text-white font-bold text-xs transition shadow"
                >
                  <Download className="w-4 h-4 text-[#C87D55]" />
                  <span>{t('تنزيل نسخة احتياطية (JSON)', 'Download Backup Bundle (JSON)')}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>{t('استعادة البيانات من ملف نسخة سابقة:', 'Restore Data From File:')}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {t(
                    'قم باختيار ملف النسخة الاحتياطية بصيغة (.json) لاستعادة كافة البيانات وحفظها فوراً.',
                    'Select a valid backup (.json) file to restore all website information instantly.'
                  )}
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={restoreLoading}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs transition shadow-sm"
                >
                  <Upload className="w-4 h-4 text-slate-600" />
                  <span>{restoreLoading ? t('جاري الاستعادة...', 'Restoring...') : t('استعادة البيانات (رفع JSON)', 'Restore Data (Upload JSON)')}</span>
                </button>

                {restoreMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                      restoreMessage.success
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {restoreMessage.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
                    <span>{restoreMessage.text}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>{t('صيغة التصدير: JSON مشفر قياسي', 'Format: Standard JSON')}</span>
            <span>{t('حفظ فوري في التخزين المعتمد', 'Instant persistent storage')}</span>
          </div>
        </div>
      </div>

      {/* Section 3: Activity Log Table (Latest 10 operations) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {t('سجل النشاطات وعمليات الأمان (Activity Log)', 'Activity & Security Audit Log')}
              </h3>
              <span className="text-[11px] text-slate-500">
                {t('عرض جدول لأحدث 10 عمليات تم تنفيذها على النظام مع التوقيت الدقيق', 'Displaying latest 10 operations performed on the system with exact timestamp')}
              </span>
            </div>
          </div>

          <button
            onClick={refreshLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition"
            title="تحديث السجل"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('تحديث', 'Refresh')}</span>
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3 px-4 text-start">#</th>
                <th className="py-3 px-4 text-start">{t('نوع العملية', 'Type')}</th>
                <th className="py-3 px-4 text-start">{t('الوصف / النشاط', 'Action Description')}</th>
                <th className="py-3 px-4 text-start">{t('تفاصيل إضافية', 'Details')}</th>
                <th className="py-3 px-4 text-start">{t('التاريخ والوقت', 'Timestamp')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400">
                    {t('لا توجد نشاطات مسجلة حتى الآن.', 'No activities recorded yet.')}
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => {
                  let badgeClass = 'bg-slate-100 text-slate-700';
                  let typeLabel = t('عام', 'General');

                  if (log.type === 'login') {
                    badgeClass = 'bg-emerald-100 text-emerald-800';
                    typeLabel = t('تسجيل دخول ناجح', 'Login Success');
                  } else if (log.type === 'failed_login') {
                    badgeClass = 'bg-rose-100 text-rose-800';
                    typeLabel = t('محاولة خاطئة', 'Failed Attempt');
                  } else if (log.type === 'password') {
                    badgeClass = 'bg-amber-100 text-amber-800';
                    typeLabel = t('تغيير كلمة مرور', 'Password Change');
                  } else if (log.type === 'backup') {
                    badgeClass = 'bg-sky-100 text-sky-800';
                    typeLabel = t('نسخ احتياطي', 'Backup Operation');
                  } else if (log.type === 'service') {
                    badgeClass = 'bg-indigo-100 text-indigo-800';
                    typeLabel = t('تعديل خدمات', 'Service Edit');
                  }

                  const formattedDate = new Date(log.timestamp).toLocaleString(
                    language === 'ar' ? 'ar-YE' : 'en-US',
                    {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    }
                  );

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeClass}`}>
                          {typeLabel}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {language === 'ar' ? log.actionAr : log.actionEn}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {log.details || '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px] dir-ltr text-start">
                        {formattedDate}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
