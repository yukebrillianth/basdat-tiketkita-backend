import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama kategori wajib diisi" })
    .max(100, { message: "Nama kategori maksimal 100 karakter" }),
});

export const updateCategorySchema = createCategorySchema.partial();
