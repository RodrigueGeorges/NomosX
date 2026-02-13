/**
 * Cryptography utilities
 */

import crypto from 'crypto';

export function hash(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function verifyPassword(
  password: string,
  hash: string,
  salt: string
): boolean {
  return hashPassword(password, salt) === hash;
}
