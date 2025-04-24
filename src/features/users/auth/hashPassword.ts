import crypto from "crypto";

export function hashPassword(password: string, salt: string): string {
  const hash = crypto.scryptSync(password, salt, 64);
  return hash.toString("hex");
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}
