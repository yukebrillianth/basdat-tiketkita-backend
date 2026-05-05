import { z } from "zod";

export const createTicketSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama tipe tiket wajib diisi" })
    .max(100, { message: "Nama tipe tiket maksimal 100 karakter" }),
  price: z
    .coerce.number()
    .min(0, { message: "Harga tidak boleh negatif" }),
  quota: z
    .coerce.number()
    .int({ message: "Kuota harus bilangan bulat" })
    .min(1, { message: "Kuota minimal 1" }),
  max_per_order: z
    .coerce.number()
    .int({ message: "Maksimal per order harus bilangan bulat" })
    .min(1, { message: "Maksimal per order minimal 1" })
    .max(10, { message: "Maksimal per order tidak boleh lebih dari 10" })
    .optional()
    .default(5),
});

export const updateTicketSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama tipe tiket wajib diisi" })
    .max(100, { message: "Nama tipe tiket maksimal 100 karakter" })
    .optional(),
  price: z
    .coerce.number()
    .min(0, { message: "Harga tidak boleh negatif" })
    .optional(),
  quota: z
    .coerce.number()
    .int({ message: "Kuota harus bilangan bulat" })
    .min(1, { message: "Kuota minimal 1" })
    .optional(),
  max_per_order: z
    .coerce.number()
    .int({ message: "Maksimal per order harus bilangan bulat" })
    .min(1, { message: "Maksimal per order minimal 1" })
    .max(10, { message: "Maksimal per order tidak boleh lebih dari 10" })
    .optional(),
});
