import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { SafeUser, JwtPayload, User } from "../../types";
import { AppError } from "../../utils/AppError";
import { generateVerificationCode } from "../../utils/generateVerificationCode";
import { sendVerificationEmail, sendPasswordResetEmail } from "../../utils/email";
import * as userRepo from "./auth.repository";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET!;
const CODE_EXPIRY_MINUTES = 15;

const parseJwtExpiry = (value: string): number => {
  const match = value.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60;
  const num = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "s": return num;
    case "m": return num * 60;
    case "h": return num * 60 * 60;
    case "d": return num * 24 * 60 * 60;
    default: return 7 * 24 * 60 * 60;
  }
};

const JWT_EXPIRES_IN = parseJwtExpiry(process.env.JWT_EXPIRES_IN || "7d");

const toSafeUser = (user: User): SafeUser => {
  const {
    password_hash,
    verification_code,
    verification_code_expires_at,
    reset_code,
    reset_code_expires_at,
    ...safeUser
  } = user;
  return safeUser;
};

export const register = async (data: {
  fullname: string;
  email: string;
  phone?: string;
  password: string;
}): Promise<SafeUser> => {
  const existing = await userRepo.findByEmail(data.email);
  if (existing) throw new AppError("Email sudah terdaftar", 409);

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

  const user = await userRepo.create({
    id: uuidv4(),
    fullname: data.fullname,
    email: data.email,
    phone: data.phone || null,
    password_hash: passwordHash,
    verification_code: code,
    verification_code_expires_at: expiresAt,
  });

  try {
    await sendVerificationEmail(user.email, user.fullname, code);
  } catch (err) {
    console.error("[Auth] Gagal mengirim email verifikasi:", err);
  }

  return toSafeUser(user);
};

export const login = async (email: string, password: string) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new AppError("Email atau password salah", 401);

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) throw new AppError("Email atau password salah", 401);

  if (!user.is_verified) throw new AppError("Email belum diverifikasi", 403);

  const payload: JwtPayload = { id: user.id, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return { user: toSafeUser(user), token };
};

export const verifyEmail = async (email: string, code: string): Promise<void> => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new AppError("Email tidak ditemukan", 404);

  if (user.is_verified) throw new AppError("Email sudah diverifikasi", 400);

  if (!user.verification_code || !user.verification_code_expires_at)
    throw new AppError("Tidak ada kode verifikasi. Minta kode baru.", 400);

  if (user.verification_code !== code)
    throw new AppError("Kode verifikasi salah", 400);

  if (new Date() > user.verification_code_expires_at)
    throw new AppError("Kode verifikasi sudah kadaluarsa", 400);

  await userRepo.updateVerification(user.id);
};

export const resendVerification = async (email: string): Promise<void> => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new AppError("Email tidak ditemukan", 404);

  if (user.is_verified) throw new AppError("Email sudah diverifikasi", 400);

  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

  await userRepo.updateVerificationCode(user.id, code, expiresAt);

  try {
    await sendVerificationEmail(user.email, user.fullname, code);
  } catch (err) {
    console.error("[Auth] Gagal mengirim email verifikasi:", err);
    throw new AppError("Gagal mengirim email. Silakan coba lagi.", 500);
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new AppError("Email tidak ditemukan", 404);

  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

  await userRepo.updateResetCode(user.id, code, expiresAt);

  try {
    await sendPasswordResetEmail(user.email, user.fullname, code);
  } catch (err) {
    console.error("[Auth] Gagal mengirim email reset password:", err);
    throw new AppError("Gagal mengirim email. Silakan coba lagi.", 500);
  }
};

export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string,
): Promise<void> => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new AppError("Email tidak ditemukan", 404);

  if (!user.reset_code || !user.reset_code_expires_at)
    throw new AppError("Tidak ada kode reset. Minta kode baru.", 400);

  if (user.reset_code !== code)
    throw new AppError("Kode reset salah", 400);

  if (new Date() > user.reset_code_expires_at)
    throw new AppError("Kode reset sudah kadaluarsa", 400);

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await userRepo.updatePassword(user.id, passwordHash);
};

export const me = async (userId: string): Promise<SafeUser> => {
  const user = await userRepo.findById(userId);
  if (!user) throw new AppError("User tidak ditemukan", 404);

  return toSafeUser(user);
};