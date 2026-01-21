import { z } from "zod";
import { ImageSchema, metaDataSchema, PaginationParamsSchema, slugSchema } from "./base";

export const CreateStudyAbroadSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().min(1, "Description is required"),
  metaData: metaDataSchema,
  type: z.string().optional(),
  slug: slugSchema,
  categoryId: z.string(),
  images: z
    .array(ImageSchema)
    .min(1, "Cần ít nhất 1 ảnh")
    .max(5, "Tối đa 5 ảnh"),



});

export type CreateStudyAbroad = z.infer<typeof CreateStudyAbroadSchema>;

export const UpdateStudyAbroadSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().min(1, "Description is required"),
  metaData: metaDataSchema,
  slug: slugSchema,
  categoryId: z.any(),
  type: z.string().optional(),
  images: z
    .array(ImageSchema)
    .min(1, "Cần ít nhất 1 ảnh")
    .max(5, "Tối đa 5 ảnh"),
});

export type UpdateStudyAbroad = z.infer<typeof UpdateStudyAbroadSchema>;

export const StudyAbroadSchema = z.object({
  id: z.number().optional(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  metaData: metaDataSchema,
  type: z.string().optional(),
  images: z.array(z.string()),
  category: z.any().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type StudyAbroad = z.infer<typeof StudyAbroadSchema>;

// Query param (phân trang + filter)
export const StudyAbroadQueryParamsSchema = PaginationParamsSchema.extend({
  title: z.string().optional(),
  isActive: z.boolean().optional(),
  type: z.string().optional(),
});
export type StudyAbroadQueryParams = z.infer<
  typeof StudyAbroadQueryParamsSchema
>;
