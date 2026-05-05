import { z } from "zod";

export const createPaymentMethodSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama metode pembayaran wajib diisi" })
    .max(100, { message: "Nama metode pembayaran maksimal 100 karakter" }),
  type: z.enum(["bank", "ewallet", "cc", "va", "qris"], {
    message: "Tipe harus salah satu dari: bank, ewallet, cc, va, qris",
  }),
  code: z
    .string()
    .min(1, { message: "Kode wajib diisi" })
    .max(50, { message: "Kode maksimal 50 karakter" }),
  admin_fee: z
    .number()
    .min(0, { message: "Admin fee tidak boleh negatif" })
    .optional()
    .default(0),
  admin_fee_percent: z
    .number()
    .min(0, { message: "Admin fee persen tidak boleh negatif" })
    .max(100, { message: "Admin fee persen maksimal 100" })
    .optional()
    .default(0),
  is_active: z.boolean().optional().default(true),
});

export const updatePaymentMethodSchema = createPaymentMethodSchema.partial();
