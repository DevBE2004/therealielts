import { z } from 'zod'
import { ImageSchema, PaginationParamsSchema } from './base'

export const CreateCommentSchema = z.object({
  content: z.string(),
  name: z.string(),
  job: z.string(),
  avatar: ImageSchema,
})

export type CreateComment = z.infer<typeof CreateCommentSchema>

export const updateCommentSchema = z.object({
  content: z.string(),
  name: z.string(),
  job: z.string(),
  avatar: ImageSchema.optional(),
})

export type UpdateComment = z.infer<typeof updateCommentSchema>

export const CommentSchema = z.object({
  id: z.number(),
  name: z.string(),
  content: z.string(),
  job: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  avatar: z.string(),
})

export type Comment = z.infer<typeof CommentSchema>

// Query param (phân trang + filter)
export const CommentQueryParamsSchema = PaginationParamsSchema.extend({
  authorId: z.number(),
})
export type CommentQueryParams = z.infer<typeof CommentQueryParamsSchema>
