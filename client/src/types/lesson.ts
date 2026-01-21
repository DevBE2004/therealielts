import { z } from 'zod'
import { PaginationParamsSchema } from './base'

export const CreateSLessonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  details: z.string(),
  order_index: z.number().int().positive('Order index must be a positive integer'),
  commonId: z.number().int().optional(),
})

export type CreateLesson = z.infer<typeof CreateSLessonSchema>

export const UpdateLessonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  details: z.string(),
  order_index: z.number().int().positive('Order index must be a positive integer'),
  commonId: z.number().int().optional(),
})

export type UpdateLesson = z.infer<typeof UpdateLessonSchema>

export const LessonSchema = z.object({
  id: z.number().int().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  details: z.string(),
  order_index: z.number().int().positive('Order index must be a positive integer'),
  commonId: z.number().int().optional(),
  course: z.object(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Lesson = z.infer<typeof LessonSchema>

// Query param (phân trang + filter)
export const LessonQueryParamsSchema = PaginationParamsSchema.extend({
  title: z.string().optional(),
  courseId: z.number().optional(),
})
export type LessonQueryParams = z.infer<typeof LessonQueryParamsSchema>
