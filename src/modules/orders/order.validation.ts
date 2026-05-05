import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        ticket_type_id: z
          .string()
          .uuid({ message: "Format ticket_type_id tidak valid" }),
        quantity: z
          .number()
          .int({ message: "Quantity harus bilangan bulat" })
          .min(1, { message: "Quantity minimal 1" }),
      }),
    )
    .min(1, { message: "Minimal 1 item dalam order" }),
  promo_code: z.string().optional(),
  payment_method_id: z
    .string()
    .uuid({ message: "Format payment_method_id tidak valid" }),
});
