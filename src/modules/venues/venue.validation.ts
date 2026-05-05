import { z } from "zod";

export const createVenueSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama venue wajib diisi" })
    .max(100, { message: "Nama venue maksimal 100 karakter" }),
  city: z
    .string()
    .min(1, { message: "Kota wajib diisi" })
    .max(100, { message: "Kota maksimal 100 karakter" }),
  address: z
    .string()
    .min(1, { message: "Alamat wajib diisi" }),
  capacity: z
    .number()
    .int({ message: "Kapasitas harus bilangan bulat" })
    .positive({ message: "Kapasitas harus lebih dari 0" }),
});

export const updateVenueSchema = createVenueSchema.partial();
