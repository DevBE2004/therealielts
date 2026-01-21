// ========================================
// HONOR SCHEMAS (Zod)
// ========================================

import { z } from "zod";
import { PaginationParamsSchema } from "./base";

// Honor trong DB
export const HonorSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  mobile: z.string(),
  description: z.string(),
  awardDate: z.date().optional(),
  photo: z.string().url().optional(),
  category: z.string(),
  achievement: z.string(),
  isPublic: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Create request
export const HonorCreateRequestSchema = z.object({
  title: z.string(),
  description: z.string(),
  photo: z.instanceof(File).optional(), 
  year: z.number(),
  category: z.string(),
  achievement: z.string(),
});

// Update request
export const HonorUpdateRequestSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  photo: z.instanceof(File).optional(),
  year: z.number().optional(),
  category: z.string().optional(),
  achievement: z.string().optional(),
});

// Query
export const HonorQueryParamsSchema = PaginationParamsSchema.extend({
  title: z.string().optional(),
  year: z.number().optional(),
  category: z.string().optional(),
});

// Types từ schema
export type Honor = z.infer<typeof HonorSchema>;
export type HonorCreateRequest = z.infer<typeof HonorCreateRequestSchema>;
export type HonorUpdateRequest = z.infer<typeof HonorUpdateRequestSchema>;
export type HonorQueryParams = z.infer<typeof HonorQueryParamsSchema>;
