// ========================================
// TEACHER TYPES (Zod)
// ========================================

import { z } from "zod"
import { ForWebEnum, ImageSchema, PaginationParamsSchema } from "./base"

export const TeacherSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  mobile: z.string(),
  avatar: z.string().url().optional(),
  bio: z.string().optional(),
  education: z.string().optional(),
  specialization: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  teachingStyle: z.string().optional(),
  ieltsScore: z.number().optional(),
  forWeb: ForWebEnum.optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})
export type Teacher = z.infer<typeof TeacherSchema>

export const TeacherCreateRequestSchema = z.object({
  name: z.string(),
  email: z.string().email(),
    mobile: z
    .string()
    .regex(/^\d{10}$/, 'Số điện thoại phải đúng 10 số')
    .optional(),
  bio: z.string().optional(),
  education: z.string().optional(),
  teachingStyle: z.string().optional(),
  specialization: z.string().optional(),
  ieltsScore: z.number().optional(),
  yearsOfExperience: z.number().optional(),
  forWeb: ForWebEnum.catch("THEREALIELTS"),
  avatar: ImageSchema // file upload
})
export type TeacherCreateRequest = z.infer<typeof TeacherCreateRequestSchema>

export const TeacherUpdateRequestSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
    mobile: z
    .string()
    .regex(/^\d{10}$/, 'Số điện thoại phải đúng 10 số')
    .optional(),
  bio: z.string().optional(),
  education: z.string().optional(),
  teachingStyle: z.string().optional(),
  ieltsScore: z.number().optional(),
  specialization: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  forWeb: ForWebEnum.optional(),
  avatar: ImageSchema.optional(),
})
export type TeacherUpdateRequest = z.infer<typeof TeacherUpdateRequestSchema>

export const TeacherQueryParamsSchema = PaginationParamsSchema.extend({
  name: z.string().optional(),
  specialization: z.string().optional(),
  forWeb: ForWebEnum.optional(),
})
export type TeacherQueryParams = z.infer<typeof TeacherQueryParamsSchema>
