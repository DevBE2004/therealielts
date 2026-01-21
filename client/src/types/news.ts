import { optional, z } from "zod";
import { ForWebEnum, ImageSchema, metaDataSchema, PaginationParamsSchema, slugSchema } from "./base";
import { CategorySchema } from "./category";


export const CreateNewSchema = z.object({
  title: z.string().min(1, "Title is required"),
  id: z.number().optional(),
  description: z.string(),
  images: z
    .array(ImageSchema)
    .min(1, "Cần ít nhất 1 ảnh")
    .max(5, "Tối đa 5 ảnh"),
  url: z.string().optional(),
  categoryId: z.string(),
  slug: slugSchema,
  metaData: metaDataSchema,
  type: z.string().optional(),
  forWeb: ForWebEnum.catch("THEREALIELTS"),
  isActive: z.boolean().optional(),
});

export type CreateNew = z.infer<typeof CreateNewSchema>;

export const updateNewSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  images: z
    .array(ImageSchema)
    .min(1, "Cần ít nhất 1 ảnh")
    .max(5, "Tối đa 5 ảnh"),
  url: z.string().optional(),
  categoryId: z.any(),
  slug: slugSchema,
  type: z.string().optional(),
  forWeb: ForWebEnum.catch("THEREALIELTS"),
  metaData: metaDataSchema,
  isActive: z.boolean().optional(),
});

export type UpdateNew = z.infer<typeof updateNewSchema>;

export const NewSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  description: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
  url: z.string().optional(),
  // category: z
  // .object({
  //   id: z.string().optional(),
  //   name: z.string(),
  // })
  // .optional(),
  category: CategorySchema.optional(),
  slug: z.string(),
  forWeb: ForWebEnum.optional(),
  type: z.string().optional(),
  metaData: metaDataSchema,
  isActive: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type New = z.infer<typeof NewSchema>;

// Query param (phân trang + filter)
export const NewQueryParamsSchema = PaginationParamsSchema.extend({
  title: z.string().optional(),
  category: z.string().optional(),
  slug: z.string().optional(),
  forWeb: ForWebEnum.optional(),
  isActive: z.boolean().optional(),
  type: z.string().optional(),
});
export type NewQueryParams = z.infer<typeof NewQueryParamsSchema>;
