import { z } from "zod";

export const webhookSchema = z.object({
  order_id: z.string().uuid({ message: "Format order_id tidak valid" }),
  status: z.enum(["success", "failed"], { message: "Status harus 'success' atau 'failed'" }),
});
