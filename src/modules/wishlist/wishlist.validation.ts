import { z } from "zod";

export const toggleWishlistSchema = z.object({
  event_id: z
    .string()
    .uuid({ message: "Format event_id tidak valid" }),
});
