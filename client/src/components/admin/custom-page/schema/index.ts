import { z } from "zod";

export const CustomPageSchema = z.object({
  title: z.string().min(1, "Title is không được để trống"),
  slug: z.string().min(1, "Title is không được để trống").trim(),
  isActive: z.boolean().optional(),
});
