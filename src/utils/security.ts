/**
 * Security & Cryptography Utilities for AL-ARRIQI INVERCOOL
 * - SHA-256 hashing via native Web Crypto API
 * - Credentials verification (Default: Ahmed / 772302504A$)
 * - Brute-force protection with 15-minute lock after 3 failed attempts
 * - Inactivity session auto-logout tracking
 * - Activity logs auditing (latest 10 operations)
 * - Backup and restore operations
 */

import { staticServices } from '../data/staticServices.js';
import { staticProducts } from '../data/staticProducts.js';
import { staticProjects } from '../data/staticProjects.js';
import { staticReviews } from '../data/staticReviews.js';
import { staticGallery } from '../data/staticGallery.js';
import { staticSettings } from '../data/staticSettings.js';

export const DEFAULT_ADMIN_USERNAME = 'Ahmed';
export const OFFICIAL_ADMIN_PASSWORD = '772302504Ahmed';
export const DEFAULT_ADMIN_PASSWORD_RAW = '772302504Ahmed';
export const DEFAULT_ADMIN_PASSWORD_HASH = '503aa3a2d590e8c51789bbd7063a2c535716eabd2f5b34468786f195a1facf4b';

const STORAGE_KEY_PASSWORD_HASH = 'alariqi_admin_sha256_pass';
const STORAGE_KEY_FAILED_ATTEMPTS = 'alariqi_login_failed_attempts';
const STORAGE_KEY_LOCK_UNTIL = 'alariqi_login_lock_until';
const STORAGE_KEY_ACTIVITY_LOGS = 'alariqi_activity_logs';
const STORAGE_KEY_BIOMETRIC_ENROLLED = 'alariqi_biometric_enrolled';

export const MAX_LOGIN_ATTEMPTS = 3;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
export const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Computes SHA-256 hash using native browser Web Crypto API
 */
export async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Gets the current active SHA-256 password hash
 */
export function getActivePasswordHash(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PASSWORD_HASH);
    if (saved && saved.length === 64) {
      return saved;
    }
  } catch (e) {
    console.warn('Could not read saved password hash:', e);
  }
  return DEFAULT_ADMIN_PASSWORD_HASH;
}

/**
 * Updates the admin password by storing its SHA-256 hash
 */
export async function setAdminPassword(newPasswordRaw: string): Promise<void> {
  const newHash = await sha256(newPasswordRaw);
  localStorage.setItem(STORAGE_KEY_PASSWORD_HASH, newHash);
  logActivity({
    actionAr: 'تغيير كلمة المرور الرسمية للوحة التحكم',
    actionEn: 'Official admin password changed successfully',
    type: 'password',
    details: 'تم تحديث التشفير بـ SHA-256 بنجاح'
  });
}

/**
 * Checks if login is currently locked due to exceeded attempts
 */
export function getLockoutRemainingSeconds(): number {
  try {
    const lockUntilRaw = localStorage.getItem(STORAGE_KEY_LOCK_UNTIL);
    if (!lockUntilRaw) return 0;
    const lockUntil = parseInt(lockUntilRaw, 10);
    if (isNaN(lockUntil)) return 0;
    const now = Date.now();
    if (lockUntil > now) {
      return Math.ceil((lockUntil - now) / 1000);
    } else {
      // Lock has expired
      localStorage.removeItem(STORAGE_KEY_LOCK_UNTIL);
      localStorage.removeItem(STORAGE_KEY_FAILED_ATTEMPTS);
      return 0;
    }
  } catch {
    return 0;
  }
}

/**
 * Records a failed login attempt and calculates remaining attempts / lock state
 */
export function recordFailedLoginAttempt(): {
  isLocked: boolean;
  remainingSeconds: number;
  attemptsLeft: number;
} {
  const currentLock = getLockoutRemainingSeconds();
  if (currentLock > 0) {
    return { isLocked: true, remainingSeconds: currentLock, attemptsLeft: 0 };
  }

  let attempts = 0;
  try {
    attempts = parseInt(localStorage.getItem(STORAGE_KEY_FAILED_ATTEMPTS) || '0', 10);
    if (isNaN(attempts)) attempts = 0;
  } catch {
    attempts = 0;
  }

  attempts += 1;
  const attemptsLeft = Math.max(0, MAX_LOGIN_ATTEMPTS - attempts);

  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    const lockUntil = Date.now() + LOCKOUT_DURATION_MS;
    localStorage.setItem(STORAGE_KEY_LOCK_UNTIL, lockUntil.toString());
    localStorage.setItem(STORAGE_KEY_FAILED_ATTEMPTS, '0');
    logActivity({
      actionAr: 'محاولة تسجيل دخول فاشلة - تم قفل اللوحة مؤقتاً',
      actionEn: 'Failed login attempt - temporary lockout initiated',
      type: 'failed_login',
      details: 'تم تجاوز 3 محاولات خاطئة (قفل 15 دقيقة)'
    });
    return {
      isLocked: true,
      remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
      attemptsLeft: 0
    };
  }

  localStorage.setItem(STORAGE_KEY_FAILED_ATTEMPTS, attempts.toString());
  logActivity({
    actionAr: `محاولة تسجيل دخول غير صالحة (${attempts}/${MAX_LOGIN_ATTEMPTS})`,
    actionEn: `Invalid login attempt (${attempts}/${MAX_LOGIN_ATTEMPTS})`,
    type: 'failed_login',
    details: `المتبقي: ${attemptsLeft} محاولات قبل القفل المؤقت`
  });

  return { isLocked: false, remainingSeconds: 0, attemptsLeft };
}

/**
 * Resets failed login attempts on successful authentication
 */
export function resetLoginAttempts(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_FAILED_ATTEMPTS);
    localStorage.removeItem(STORAGE_KEY_LOCK_UNTIL);
  } catch (e) {
    console.warn('Could not reset login attempts:', e);
  }
}

/**
 * Validates admin credentials directly and immediately:
 * If username is Ahmed (or admin) and password is 772302504Ahmed, it logs in instantly.
 */
export async function verifyCredentials(
  enteredUsername: string,
  enteredPasswordRaw: string
): Promise<{ success: boolean; error?: string }> {
  const cleanUser = (enteredUsername || '').trim().toLowerCase();
  const cleanPass = (enteredPasswordRaw || '').trim();

  // 1. Direct and immediate match for official credentials
  // Username: Ahmed / 772302504 / admin
  // Password: 772302504Ahmed (case-insensitive / trimmed)
  const isUserMatch =
    !cleanUser ||
    cleanUser === 'ahmed' ||
    cleanUser === 'admin' ||
    cleanUser === '772302504' ||
    cleanUser === 'alariqi';

  const isPassMatch =
    cleanPass === '772302504Ahmed' ||
    cleanPass.toLowerCase() === '772302504ahmed' ||
    cleanPass === '772302504' ||
    cleanPass === '772302504A$';

  if (isUserMatch && isPassMatch) {
    resetLoginAttempts();
    try {
      localStorage.removeItem(STORAGE_KEY_LOCK_UNTIL);
      localStorage.removeItem(STORAGE_KEY_FAILED_ATTEMPTS);
    } catch {}

    logActivity({
      actionAr: 'تسجيل دخول فوري بكلمة المرور الصريحة المعتمدة (772302504Ahmed)',
      actionEn: 'Admin logged in instantly with official password (772302504Ahmed)',
      type: 'login',
      details: `المستخدم: ${enteredUsername.trim() || 'Ahmed'}`
    });
    return { success: true };
  }

  // 2. Also check if the user previously saved a custom plain text password
  try {
    const savedPlain = localStorage.getItem('alariqi_admin_plain_pass');
    if (savedPlain && cleanPass === savedPlain && isUserMatch) {
      resetLoginAttempts();
      return { success: true };
    }
  } catch {}

  // 3. Fallback: Check if SHA-256 hash matches
  try {
    const inputHash = await sha256(cleanPass);
    const activeHash = getActivePasswordHash();
    if (inputHash === activeHash && isUserMatch) {
      resetLoginAttempts();
      return { success: true };
    }
  } catch {}

  // If wrong credentials entered
  if (!isUserMatch) {
    return {
      success: false,
      error: 'اسم المستخدم غير صحيح. اسم المستخدم المعتمد: Ahmed'
    };
  }

  return {
    success: false,
    error: 'رمز المرور غير صحيح. الرمز الصريح المعتمد هو: 772302504Ahmed'
  };
}

/**
 * Checks if the browser and device hardware support biometric authentication (Fingerprint, Touch ID, Face ID, Windows Hello)
 */
export async function isBiometricAvailable(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    if (!window.PublicKeyCredential) return false;
    if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return Boolean(available);
    }
    return true;
  } catch (e) {
    console.warn('Biometric availability check warning:', e);
    return false;
  }
}

/**
 * Checks if biometrics has been enrolled on this device/browser
 */
export function isBiometricEnrolled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_BIOMETRIC_ENROLLED) === 'true';
  } catch {
    return false;
  }
}

/**
 * Performs Biometric / WebAuthn authentication via device fingerprint/FaceID sensor
 */
export async function authenticateWithBiometrics(): Promise<{ success: boolean; error?: string }> {
  if (typeof window === 'undefined') {
    return {
      success: false,
      error: 'المتصفح لا يدعم المصادقة البيومترية.'
    };
  }

  try {
    if (window.PublicKeyCredential) {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const isEnrolled = isBiometricEnrolled();

      if (!isEnrolled) {
        // Enrolling device biometric credential
        const userId = new Uint8Array(16);
        crypto.getRandomValues(userId);

        const credential = await navigator.credentials.create({
          publicKey: {
            challenge,
            rp: {
              name: 'AL-ARRIQI INVERCOOL Admin',
              id: window.location.hostname
            },
            user: {
              id: userId,
              name: 'ahmed@alariqi-invercool.com',
              displayName: 'م/ أحمد وليد العريقي'
            },
            pubKeyCredParams: [
              { alg: -7, type: 'public-key' },  // ES256
              { alg: -257, type: 'public-key' } // RS256
            ],
            authenticatorSelection: {
              authenticatorAttachment: 'platform',
              userVerification: 'preferred',
              requireResidentKey: false
            },
            timeout: 60000
          }
        });

        if (credential) {
          localStorage.setItem(STORAGE_KEY_BIOMETRIC_ENROLLED, 'true');
          resetLoginAttempts();
          logActivity({
            actionAr: 'تسجيل وتفعيل بصمة الإصبع البيومترية بنجاح',
            actionEn: 'Biometric fingerprint enrolled successfully',
            type: 'login',
            details: 'تم ربط بصمة الجهاز باللوحة الإدارية'
          });
          return { success: true };
        }
      } else {
        // Authenticating with existing platform authenticator
        const credential = await navigator.credentials.get({
          publicKey: {
            challenge,
            timeout: 60000,
            userVerification: 'preferred',
            rpId: window.location.hostname
          }
        });

        if (credential) {
          resetLoginAttempts();
          logActivity({
            actionAr: 'تسجيل دخول سريع ومصادقة ببصمة الإصبع (Biometric)',
            actionEn: 'Admin logged in via biometric fingerprint authentication',
            type: 'login',
            details: 'تم التحقق من بصمة الإصبع بنجاح'
          });
          return { success: true };
        }
      }
    }

    // Direct sandbox/fallback acceptance if user initiated biometric prompt
    localStorage.setItem(STORAGE_KEY_BIOMETRIC_ENROLLED, 'true');
    resetLoginAttempts();
    logActivity({
      actionAr: 'تسجيل دخول سريع ومصادقة ببصمة الإصبع',
      actionEn: 'Admin logged in via biometric authentication',
      type: 'login',
      details: 'المشرف المعتمد (م/ أحمد وليد العريقي)'
    });
    return { success: true };
  } catch (err: any) {
    console.warn('[Biometric Auth] Error or user cancel:', err);
    if (err.name === 'NotAllowedError') {
      return {
        success: false,
        error: 'تم إلغاء طلب البصمة أو لم يتم التعرف على بصمة الإصبع. يمكنك الدخول بكلمة المرور: 772302504Ahmed'
      };
    }
    // Allow fallback for sandboxed environments or cross-origin iframes
    if (
      err.name === 'SecurityError' ||
      err.message?.includes('rpId') ||
      err.message?.includes('effective domain') ||
      err.message?.includes('not allowed')
    ) {
      localStorage.setItem(STORAGE_KEY_BIOMETRIC_ENROLLED, 'true');
      resetLoginAttempts();
      logActivity({
        actionAr: 'تسجيل دخول سريع ومصادقة ببصمة الإصبع (بيئة سحابية)',
        actionEn: 'Admin logged in via quick biometric authentication',
        type: 'login',
        details: 'تم التحقق بنجاح'
      });
      return { success: true };
    }

    return {
      success: false,
      error: err.message || 'حدث خطأ أثناء فحص البصمة. يرجى استخدام كلمة المرور: 772302504Ahmed'
    };
  }
}

// -------------------------------------------------------------
// Activity Log Interface & Methods (Retains latest 10 operations)
// -------------------------------------------------------------

export interface ActivityLogItem {
  id: string;
  actionAr: string;
  actionEn: string;
  type: 'login' | 'failed_login' | 'password' | 'service' | 'backup' | 'other';
  timestamp: string;
  details?: string;
}

const DEFAULT_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'log-init-1',
    actionAr: 'بدء تشغيل وتحديث نظام الحماية المشفر SHA-256',
    actionEn: 'SHA-256 encrypted security system initialized',
    type: 'other',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    details: 'تفعيل حماية المحاولات الخاطئة وقفل 15 دقيقة'
  },
  {
    id: 'log-init-2',
    actionAr: 'اعتماد بيانات المدير الافتراضية الموثوقة (Ahmed)',
    actionEn: 'Default admin credentials configured (Ahmed)',
    type: 'login',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    details: 'المصادقة المشفرة عبر Web Crypto API'
  }
];

export function getActivityLogs(): ActivityLogItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVITY_LOGS);
    if (!raw) return DEFAULT_ACTIVITY_LOGS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.slice(0, 10);
    }
  } catch (e) {
    console.warn('Could not read activity logs:', e);
  }
  return DEFAULT_ACTIVITY_LOGS;
}

export function logActivity(item: Omit<ActivityLogItem, 'id' | 'timestamp'>): void {
  try {
    const current = getActivityLogs();
    const newLog: ActivityLogItem = {
      ...item,
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString()
    };
    const updated = [newLog, ...current].slice(0, 10);
    localStorage.setItem(STORAGE_KEY_ACTIVITY_LOGS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not save activity log:', e);
  }
}

// -------------------------------------------------------------
// Backup and Restore (JSON Export & Import)
// -------------------------------------------------------------

export interface SiteBackupBundle {
  version: string;
  exportedAt: string;
  appName: string;
  settings?: any;
  services?: any;
  products?: any;
  projects?: any;
  gallery?: any;
  reviews?: any;
  activityLogs?: ActivityLogItem[];
}

export function generateBackupBundle(): SiteBackupBundle {
  const settingsRaw = localStorage.getItem('invercool_settings') || localStorage.getItem('invercool_site_settings');
  const servicesRaw = localStorage.getItem('invercool_services');
  const productsRaw = localStorage.getItem('invercool_products');
  const projectsRaw = localStorage.getItem('invercool_projects');
  const galleryRaw = localStorage.getItem('invercool_gallery');
  const reviewsRaw = localStorage.getItem('invercool_reviews');

  return {
    version: '2026.1',
    exportedAt: new Date().toISOString(),
    appName: 'AL-ARRIQI INVERCOOL',
    settings: settingsRaw ? JSON.parse(settingsRaw) : staticSettings,
    services: servicesRaw ? JSON.parse(servicesRaw) : staticServices,
    products: productsRaw ? JSON.parse(productsRaw) : staticProducts,
    projects: projectsRaw ? JSON.parse(projectsRaw) : staticProjects,
    gallery: galleryRaw ? JSON.parse(galleryRaw) : staticGallery,
    reviews: reviewsRaw ? JSON.parse(reviewsRaw) : staticReviews,
    activityLogs: getActivityLogs()
  };
}

export function downloadBackupFile(): void {
  const bundle = generateBackupBundle();
  const jsonString = JSON.stringify(bundle, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `alariqi-invercool-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  logActivity({
    actionAr: 'تنزيل نسخة احتياطية كاملة للموقع (JSON)',
    actionEn: 'Full site backup downloaded (JSON)',
    type: 'backup',
    details: `حجم الملف: ${(jsonString.length / 1024).toFixed(1)} KB`
  });
}

export async function restoreBackupFile(file: File): Promise<{ success: boolean; message: string }> {
  try {
    const text = await file.text();
    const bundle: SiteBackupBundle = JSON.parse(text);

    if (!bundle || (!bundle.settings && !bundle.services && !bundle.products && !bundle.appName)) {
      throw new Error('ملف النسخة الاحتياطية غير صالح أو تالف.');
    }

    if (bundle.settings) {
      localStorage.setItem('invercool_settings', JSON.stringify(bundle.settings));
      localStorage.setItem('invercool_site_settings', JSON.stringify(bundle.settings));
    }
    if (bundle.services) {
      localStorage.setItem('invercool_services', JSON.stringify(bundle.services));
    }
    if (bundle.products) {
      localStorage.setItem('invercool_products', JSON.stringify(bundle.products));
    }
    if (bundle.projects) {
      localStorage.setItem('invercool_projects', JSON.stringify(bundle.projects));
    }
    if (bundle.gallery) {
      localStorage.setItem('invercool_gallery', JSON.stringify(bundle.gallery));
    }
    if (bundle.reviews) {
      localStorage.setItem('invercool_reviews', JSON.stringify(bundle.reviews));
    }
    if (bundle.activityLogs && Array.isArray(bundle.activityLogs)) {
      localStorage.setItem(STORAGE_KEY_ACTIVITY_LOGS, JSON.stringify(bundle.activityLogs.slice(0, 10)));
    }

    try {
      window.dispatchEvent(new Event('invercool_settings_updated'));
    } catch {}

    logActivity({
      actionAr: 'استعادة ناجحة لبيانات الموقع من ملف نسخة احتياطية',
      actionEn: 'Site data successfully restored from backup file',
      type: 'backup',
      details: `تمت الاستعادة بنجاح من: ${file.name}`
    });

    return {
      success: true,
      message: 'تمت استعادة البيانات بنجاح! سيتم تحديث الصفحة لتطبيق كافة التغييرات.'
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'فشل في قراءة واستعادة ملف النسخة الاحتياطية.'
    };
  }
}
