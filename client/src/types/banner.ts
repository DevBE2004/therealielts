// ========================================
// BANNER SCHEMA
// ========================================

import { z } from "zod";
import { ForWebEnum, ImageSchema, PaginationParamsSchema } from "./base";

// Banner entity
export const BannerSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  image: z.string().url().optional(),
  isActive: z.boolean().optional(),
  url: z.string().url(),
  category: z.string(),
  forWeb: ForWebEnum.default("THEREALIELTS"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Banner = z.infer<typeof BannerSchema>;

// Request để tạo banner
export const BannerCreateRequestSchema = z.object({
  title: z.string(),
  slug: z.string(),
  image: ImageSchema.optional(),
  isActive: z.boolean().optional(),
  url: z.string().url(),
  category: z.string().min(1, "Vui lòng chọn"),
  forWeb: ForWebEnum.catch("THEREALIELTS"), 
});

export type BannerCreateRequest = z.infer<typeof BannerCreateRequestSchema>;

// Request để update banner
export const BannerUpdateRequestSchema = z.object({
  title: z.string().optional(),
  image: z.instanceof(File).optional(),
  slug: z.string(),
  isActive: z.boolean().optional(),
  url: z.string().url().optional(),
  category: z.string().optional(),
  forWeb: ForWebEnum.optional(),
});

export type BannerUpdateRequest = z.infer<typeof BannerUpdateRequestSchema>;

// Query param (phân trang + filter)
export const BannerQueryParamsSchema = PaginationParamsSchema.extend({
  title: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
  forWeb: ForWebEnum.optional(),
});

export type BannerQueryParams = z.infer<typeof BannerQueryParamsSchema>;
