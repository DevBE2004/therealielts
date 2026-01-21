import { z } from 'zod'
import { metaDataSchema, PaginationParamsSchema } from './base'
import { UserSchema } from './user'
import { CategorySchema } from './category'
import { CommonTypeEnum } from './common'

export const CreateDocumentSchema = z.object({
  title: z.string(),
  image: z.string(),
  description: z.string(),
  metaData: metaDataSchema,
  type: z.string().optional(),
  isActive: z.boolean().optional(),
})

export type CreateDocument = z.infer<typeof CreateDocumentSchema>

export const UpdateDocumentSchema = z.object({
  title: z.string(),
  images: z.string(),
  description: z.string(),
  metaData: metaDataSchema,
  type: z.string().optional(),
  isActive: z.boolean().optional(),
})

export type UpdateDocument = z.infer<typeof UpdateDocumentSchema>

export const DocumentSchema = z.object({
  id: z.number().optional(),
  author: UserSchema.optional(),
  title: z.string(),
  images: z.array(z.string()),
  slug: z.string(),
  description: z.string(),
  category: z.any().optional(),
  metaData: metaDataSchema,
  type: CommonTypeEnum,
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export type Document = z.infer<typeof DocumentSchema>

// Query param (phân trang + filter)
export const DocumentQueryParamsSchema = PaginationParamsSchema.extend({
  title: z.string().optional(),
  limit: z.number().optional(),
  isActive: z.boolean().optional(),
  type: z.string().optional(),
  categoryId: z.string().optional(),
})
export type DocumentQueryParams = z.infer<typeof DocumentQueryParamsSchema>
