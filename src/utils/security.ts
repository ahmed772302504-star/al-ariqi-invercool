/**
 * Security & Cryptography Utilities for AL-ARRIQI INVERCOOL
 * - SHA-256 hashing via native Web Crypto API
 * - Credentials verification (Default: Ahmed / 772302504A$)
 * - Brute-force protection with 15-minute lock after 3 failed attempts
 * - Inactivity session auto-logout tracking
 * - Activity logs auditing (latest 10 operations)
 * - Backup and restore operations
 */

export const DEFAULT_ADMIN_USERNAME = 'Ahmed';
export const DEFAULT_ADMIN_PASSWORD_RAW = '772302504A$';
export const DEFAULT_ADMIN_PASSWORD_HASH = '1065f2841a9acf5165c22554ce16734ee2825e20e268edd9892365d24bb49758';

const STORAGE_KEY_PASSWORD_HASH = 'alariqi_admin_sha256_pass';
const STORAGE_KEY_FAILED_ATTEMPTS = 'alariqi_login_failed_attempts';
const STORAGE_KEY_LOCK_UNTIL = 'alariqi_login_lock_until';
const STORAGE_KEY_ACTIVITY_LOGS = 'alariqi_activity_logs';

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
 * Validates admin credentials via SHA-256 Web Crypto comparison
 */
export async function verifyCredentials(
  enteredUsername: string,
  enteredPasswordRaw: string
): Promise<{ success: boolean; error?: string }> {
  // Check lockout status first
  const remainingLock = getLockoutRemainingSeconds();
  if (remainingLock > 0) {
    const minutes = Math.floor(remainingLock / 60);
    const seconds = remainingLock % 60;
    const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    return {
      success: false,
      error: `تم قفل تسجيل الدخول مؤقتاً بسبب 3 محاولات خاطئة. يرجى الانتظار (${timeFormatted}) دقيقة.`
    };
  }

  const cleanUser = enteredUsername.trim().toLowerCase();
  // Valid usernames: Ahmed (official) or admin (legacy fallback)
  const isUsernameValid = cleanUser === 'ahmed' || cleanUser === 'admin';

  if (!isUsernameValid) {
    const attempt = recordFailedLoginAttempt();
    return {
      success: false,
      error: attempt.isLocked
        ? 'تم قفل اللوحة لمدة 15 دقيقة بسبب تكرار المحاولات الخاطئة.'
        : `اسم المستخدم أو كلمة المرور غير صحيحة. المحاولات المتبقية: ${attempt.attemptsLeft}`
    };
  }

  // Hash input password
  const inputHash = await sha256(enteredPasswordRaw);
  const activeHash = getActivePasswordHash();

  if (inputHash === activeHash) {
    resetLoginAttempts();
    logActivity({
      actionAr: 'تسجيل دخول ناجح إلى لوحة التحكم',
      actionEn: 'Admin logged in successfully',
      type: 'login',
      details: `المستخدم: ${enteredUsername.trim()}`
    });
    return { success: true };
  }

  // Record failed attempt
  const attempt = recordFailedLoginAttempt();
  return {
    success: false,
    error: attempt.isLocked
      ? 'تم تجاوز 3 محاولات خاطئة. تم قفل تسجيل الدخول لمدة 15 دقيقة.'
      : `كلمة المرور غير صحيحة. المحاولات المتبقية قبل القفل: ${attempt.attemptsLeft}`
  };
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
  const settings = localStorage.getItem('invercool_settings') || localStorage.getItem('invercool_site_settings');
  const services = localStorage.getItem('invercool_services');
  const products = localStorage.getItem('invercool_products');
  const projects = localStorage.getItem('invercool_projects');
  const gallery = localStorage.getItem('invercool_gallery');
  const reviews = localStorage.getItem('invercool_reviews');

  return {
    version: '2026.1',
    exportedAt: new Date().toISOString(),
    appName: 'AL-ARRIQI INVERCOOL',
    settings: settings ? JSON.parse(settings) : undefined,
    services: services ? JSON.parse(services) : undefined,
    products: products ? JSON.parse(products) : undefined,
    projects: projects ? JSON.parse(projects) : undefined,
    gallery: gallery ? JSON.parse(gallery) : undefined,
    reviews: reviews ? JSON.parse(reviews) : undefined,
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
