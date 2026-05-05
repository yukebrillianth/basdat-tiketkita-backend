import { z } from "zod";

export const validatePromoSchema = z.object({
  code: z
    .string()
    .min(1, { message: "Kode promo wajib diisi" }),
  subtotal: z
    .number()
    .positive({ message: "Subtotal harus lebih dari 0" }),
});

export const createPromoCodeSchema = z.object({
  code: z
    .string()
    .min(1, { message: "Kode promo wajib diisi" })
    .max(50, { message: "Kode promo maksimal 50 karakter" }),
  type: z.enum(["percentage", "nominal"], {
    message: "Tipe harus percentage atau nominal",
  }),
  value: z
    .number()
    .positive({ message: "Nilai harus lebih dari 0" }),
  min_purchase: z
    .number()
    .min(0, { message: "Minimum pembelian tidak boleh negatif" })
    .optional()
    .default(0),
  max_discount: z
    .number()
    .positive({ message: "Maksimal diskon harus lebih dari 0" })
    .optional()
    .nullable()
    .default(null),
  quota: z
    .number()
    .int({ message: "Kuota harus bilangan bulat" })
    .positive({ message: "Kuota harus lebih dari 0" })
    .optional()
    .nullable()
    .default(null),
  start_date: z
    .string()
    .min(1, { message: "Tanggal mulai wajib diisi" }),
  end_date: z
    .string()
    .min(1, { message: "Tanggal akhir wajib diisi" }),
  is_active: z.boolean().optional().default(true),
});

export const updatePromoCodeSchema = createPromoCodeSchema.partial();
