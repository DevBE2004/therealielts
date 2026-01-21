// ========================================
// COURSE TYPES (Zod)
// ========================================

import { z } from "zod";
import { metaDataSchema, PaginationParamsSchema } from "./base";
import { LessonSchema } from "./lesson";

// =============================
// COURSE SCHEMA + TYPE
// =============================
export const CourseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  images: z.array(z.string()), 
  duration: z.string(),
  totalHours: z.number(),
  routeId: z.number().optional(),
  route: z.any().optional(),
  level: z.tuple([z.number(), z.number()]),
  target: z.number().optional(),
  slug: z.string().optional(),
  type: z.string().optional(),
  lessons: z.array(LessonSchema).optional(),
  metaData: metaDataSchema,
  category: z.any().optional(),
  benefit: z.array(z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
  urlYoutube: z.string().optional(),
  descriptionSidebar: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type Course = z.infer<typeof CourseSchema>;

// =============================
// CREATE REQUEST
// =============================
export const CourseCreateRequestSchema = z.object({
  title: z.string().optional(),
  description: z.string(),
  duration: z.string(),
  totalHours: z.number(),
  level: z.tuple([z.number(), z.number()]),
  target: z.number(),
  slug: z.string(),
  type: z.string().optional(),
  metaData: metaDataSchema,
  images: z.array(z.instanceof(File)).min(1, "Phải upload ít nhất 1 ảnh"),
  benefit: z.array(
    z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
  ).optional(),
  urlYoutube: z.string(),
  descriptionSidebar: z.string(),
});

export type CourseCreateRequest = z.infer<typeof CourseCreateRequestSchema>;

// =============================
// UPDATE REQUEST
// =============================
export const CourseUpdateRequestSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  duration: z.string().optional(),
  totalHours: z.number().optional(),
  level: z.tuple([z.number(), z.number()]).optional(),
  target: z.number().optional(),
  slug: z.string().optional(),
  metaData: metaDataSchema,
  type: z.string().optional(),
  images: z.array(z.instanceof(File)).min(1, "Phải upload ít nhất 1 ảnh").optional(),
  benefit: z.array(
    z.object({
      title: z.string(),
      description: z.string().optional(),
    })
  ).optional(),
  urlYoutube: z.string(),
  descriptionSidebar: z.string(),
});
export type CourseUpdateRequest = z.infer<typeof CourseUpdateRequestSchema>;

// =============================
// QUERY PARAMS
// =============================
export const CourseQueryParamsSchema = PaginationParamsSchema.extend({
  title: z.string().optional(),
  description: z.string().optional(),
  target: z.number().optional(),
  slug: z.string().optional(),
  type: z.string().optional(),
  limit: z.number().optional(),
});
export type CourseQueryParams = z.infer<typeof CourseQueryParamsSchema>;
