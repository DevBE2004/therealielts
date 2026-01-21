import { z } from 'zod'
import { PaginationParamsSchema } from './base'

export const CreateRoadmapSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  slug: z.string().min(1, 'Slug is required'),
  goal: z.array(z.string()).optional().default([]),
})

export type CreateRoadmap = z.infer<typeof CreateRoadmapSchema>

export const UpdateRoadmapSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  slug: z.string().min(1, 'Slug is required'),
  goal: z.array(z.string()).optional().default([]),
})

export type UpdateRoadmap = z.infer<typeof UpdateRoadmapSchema>

export const RoadmapSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  goal: z.array(z.string()).optional().default([]),
  slug: z.string().min(1, 'Slug is required'),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Roadmap = z.infer<typeof RoadmapSchema>

// Query param (phân trang + filter)
export const RoadmapQueryParamsSchema = PaginationParamsSchema.extend({
  title: z.string().optional(),
  slug: z.string().optional(),
  limit: z.number().optional(),
})
export type RoadmapQueryParams = z.infer<typeof RoadmapQueryParamsSchema>
