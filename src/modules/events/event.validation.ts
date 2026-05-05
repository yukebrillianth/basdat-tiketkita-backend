import { z } from "zod";

const datetimeString = z
  .string()
  .min(1, { message: "Tanggal wajib diisi" })
  .refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Format tanggal tidak valid" },
  );

export const createEventSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Judul event wajib diisi" })
    .max(200, { message: "Judul event maksimal 200 karakter" }),
  description: z
    .string()
    .optional()
    .nullable(),
  category_id: z
    .string()
    .uuid({ message: "Format category_id tidak valid" }),
  venue_id: z
    .string()
    .uuid({ message: "Format venue_id tidak valid" }),
  date_start: datetimeString,
  date_end: datetimeString,
  status: z
    .enum(["draft", "published", "cancelled", "completed"])
    .optional(),
  poster_url: z
    .string()
    .url({ message: "Format poster_url tidak valid" })
    .optional()
    .nullable(),
});

export const updateEventSchema = createEventSchema.partial();
