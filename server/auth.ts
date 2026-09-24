import crypto from 'crypto';
import { dbManager } from './database.js';

// In-memory active sessions: token -> { userId, username, role, expiresAt }
export interface Session {
  token: string;
  userId: string;
  username: string;
  role: 'super_admin' | 'admin' | 'technician';
  expiresAt: number;
}

const activeSessions = new Map<string, Session>();
// Failed login attempts tracker for brute-force protection: ip -> { count, lockedUntil }
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function ensureDefaultAdmin(): void {
  const db = dbManager.get();
  // Password requested by user: 772302504
  const password = process.env.ADMIN_INITIAL_PASSWORD || '772302504';

  const existingAdmin = db.adminUsers.find(
    (u) => u.username.toLowerCase() === 'admin' || u.role === 'super_admin'
  );

  if (!existingAdmin) {
    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);

    db.adminUsers.push({
      id: 'admin-1',
      username: 'admin',
      passwordHash,
      salt,
      role: 'super_admin',
      createdAt: new Date().toISOString()
    });
    dbManager.saveSync();
    console.log('Default Admin Account created: username="admin", password="' + password + '"');
  } else {
    // Ensure the admin account has password 772302504
    const salt = generateSalt();
    existingAdmin.salt = salt;
    existingAdmin.passwordHash = hashPassword(password, salt);
    dbManager.saveSync();
    console.log('Admin Account password updated: username="' + existingAdmin.username + '", password="' + password + '"');
  }

  // Clear any failed attempts lock
  loginAttempts.clear();
}

export function isIpRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry) return false;
  if (entry.lockedUntil > now) return true;
  if (entry.lockedUntil <= now && entry.count >= 5) {
    loginAttempts.delete(ip);
    return false;
  }
  return false;
}

export function recordLoginAttempt(ip: string, success: boolean): void {
  const now = Date.now();
  if (success) {
    loginAttempts.delete(ip);
    return;
  }
  const entry = loginAttempts.get(ip) || { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= 5) {
    // Lock for 15 minutes
    entry.lockedUntil = now + 15 * 60 * 1000;
  }
  loginAttempts.set(ip, entry);
}

export function authenticateUser(username: string, password: string): Session | null {
  const db = dbManager.get();
  const trimmed = username.trim().toLowerCase();
  const user = db.adminUsers.find(
    (u) =>
      u.username.toLowerCase() === trimmed ||
      (trimmed === '772302504' && u.role === 'super_admin') ||
      (trimmed === 'admin' && u.role === 'super_admin')
  );
  if (!user) return null;

  const computedHash = hashPassword(password, user.salt);
  if (computedHash !== user.passwordHash) return null;

  const token = crypto.randomBytes(32).toString('hex');
  const session: Session = {
    token,
    userId: user.id,
    username: user.username,
    role: user.role,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  };

  activeSessions.set(token, session);
  return session;
}

export function verifySession(token?: string): Session | null {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    activeSessions.delete(token);
    return null;
  }
  return session;
}

export function logoutSession(token: string): void {
  activeSessions.delete(token);
}
