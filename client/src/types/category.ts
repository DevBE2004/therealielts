import { z } from 'zod'
import { ImageSchema, PaginationParamsSchema } from './base'

export const CreateCategorySchema = z.object({
  name: z.string(),
  group: z.object({
    id: z.number().optional(),
    name: z.string(),
  }).optional(),
  icon: ImageSchema.optional(),
})

export type CreateCategory = z.infer<typeof CreateCategorySchema>

export const updateCategorySchema = z.object({
  name: z.string(),
  group: z.object({
    id: z.number().optional(),
    name: z.string(),
  }).optional(),
  icon: ImageSchema.optional(),
})

export type UpdateCategory = z.infer<typeof updateCategorySchema>

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  group: z.object({
    id: z.number().optional(),
    name: z.string(),
  }).optional(),
  icon: z.string().optional(),
});


export type Category = z.infer<typeof CategorySchema>

// Query param (phân trang + filter)
export const CategoryQueryParamsSchema = PaginationParamsSchema.extend({
  id: z.number().optional(),
  name: z.string().optional(),
})
export type CategoryQueryParams = z.infer<typeof CategoryQueryParamsSchema>
