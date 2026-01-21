// ========================================
// PARTNER SCHEMAS (Zod)
// ========================================

import { z } from "zod";
import { ForWebEnum, ImageSchema, PaginationParamsSchema } from "./base";

const stringReq = z.string().min(1, "This field is required");
const stringOptional = z.string().optional();
const fileArray = z
  .array(ImageSchema)
  .min(1, "Cần ít nhất 1 ảnh")
  .max(5, "Tối đa 5 ảnh");
const imagesArray = z.array(z.string()).default([]);

export const PartnerSchema = z.object({
  id: z.number(),
  name: stringReq,
  category: stringReq,
  description: stringOptional,
  images: imagesArray,
  forWeb: ForWebEnum.default("THEREALIELTS"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const PartnerCreateRequestSchema = z.object({
  name: stringReq,
  category: stringReq,
  description: stringOptional,
  images: fileArray,
  forWeb: ForWebEnum.catch("THEREALIELTS"),
});

export const PartnerUpdateRequestSchema = z.object({
  name: stringReq.optional(),
  category: stringReq.optional(),
  description: stringOptional,
  images: fileArray.optional(),
  forWeb: ForWebEnum.optional(),
});

export const PartnerQueryParamsSchema = PaginationParamsSchema.extend({
  name: z.string().optional(),
  category: z.string().optional(),
  forWeb: ForWebEnum.optional(),
});

export type Partner = z.infer<typeof PartnerSchema>;
export type PartnerCreateRequest = z.infer<typeof PartnerCreateRequestSchema>;
export type PartnerUpdateRequest = z.infer<typeof PartnerUpdateRequestSchema>;
export type PartnerQueryParams = z.infer<typeof PartnerQueryParamsSchema>;
