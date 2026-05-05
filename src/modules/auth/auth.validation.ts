import { z } from "zod";

export const registerSchema = z.object({
  fullname: z
    .string()
    .min(2, { message: "Nama minimal 2 karakter" })
    .max(100, { message: "Nama maksimal 100 karakter" }),
  email: z
    .string()
    .email({ message: "Format email tidak valid" }),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]{7,20}$/, { message: "Format nomor telepon tidak valid" })
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, { message: "Password minimal 8 karakter" })
    .max(128, { message: "Password maksimal 128 karakter" })
    .regex(/[A-Z]/, { message: "Password harus mengandung huruf besar" })
    .regex(/[a-z]/, { message: "Password harus mengandung huruf kecil" })
    .regex(/[0-9]/, { message: "Password harus mengandung angka" }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Format email tidak valid" }),
  password: z
    .string()
    .min(1, { message: "Password wajib diisi" }),
});

export const verifyEmailSchema = z.object({
  email: z
    .string()
    .email({ message: "Format email tidak valid" }),
  code: z
    .string()
    .length(6, { message: "Kode verifikasi harus 6 digit" })
    .regex(/^[0-9]{6}$/, { message: "Kode verifikasi hanya boleh berisi angka" }),
});

export const resendVerificationSchema = z.object({
  email: z
    .string()
    .email({ message: "Format email tidak valid" }),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Format email tidak valid" }),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Format email tidak valid" }),
  code: z
    .string()
    .length(6, { message: "Kode reset harus 6 digit" })
    .regex(/^[0-9]{6}$/, { message: "Kode reset hanya boleh berisi angka" }),
  password: z
    .string()
    .min(8, { message: "Password minimal 8 karakter" })
    .max(128, { message: "Password maksimal 128 karakter" })
    .regex(/[A-Z]/, { message: "Password harus mengandung huruf besar" })
    .regex(/[a-z]/, { message: "Password harus mengandung huruf kecil" })
    .regex(/[0-9]/, { message: "Password harus mengandung angka" }),
});
