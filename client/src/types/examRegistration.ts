// ========================================
// EXAM REGISTRATION SCHEMAS (Zod)
// ========================================

import { z } from 'zod'
import { PaginationParamsSchema } from './base'

// =============================
// ENUMS
// =============================
export const ExamStatusSchema = z.enum(['PENDING', 'CONFIRMED', 'CANCELLED'])
export const PaymentStatusSchema = z.enum(['PENDING', 'PAID', 'REFUNDED'])

// =============================
// BASE FIELDS
// =============================
const stringReq = z.string().min(1, 'Không được để trống')
const dateReq = z.date("Không được để trống")
const fileReq = z.instanceof(File)
const string = z.string()

// =============================
// MAIN SCHEMA (reflect backend Joi)
// =============================
export const ExamRegistrationSchema = z.object({
  id: z.number().optional(),
  name: string.optional(),
  mobile: string.optional(),
  email: z.string().email('Invalid email').optional(),
  organization: string.optional(),
  module: string.optional(),
  form: string.optional(),
  examDate: dateReq.optional(),
  mailingAddress: string.optional(),
  promotionalProduct: z.string().optional(),
  passport: string.optional(),
  registrationObject: string.optional(),
  bill: z.any().optional(),
  isConfirmed: z.boolean().default(false).optional(),

    createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

// =============================
// UPDATE
// =============================
export const ExamRegistrationUpdateRequestSchema = z.object({
  name: stringReq,
  examDate: dateReq,
  mobile: string.regex(/^\d{10}$/, "Số điện thoại phải đủ 10 số"),
  email: z.string().email('Invalid email').optional(),
  mailingAddress: z.string().optional(),
  promotionalProduct: z.string().optional(),
  passport: stringReq,
  registrationObject: z.string().optional(),
  bill: fileReq,
  organization: z.string().optional(),
  module: z.string().optional(),
  form: z.string().optional(),
  isConfirmed: z.boolean().default(false).optional(),
})

export const ExamRegistrationCreateRequestSchema = ExamRegistrationUpdateRequestSchema
// =============================
// QUERY PARAMS
// =============================
export const ExamRegistrationQueryParamsSchema = PaginationParamsSchema.extend({
  status: z.string().optional(),
  paymentStatus: z.string().optional(),
  examDate: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  mobile: z.string().optional(),
  organization: z.string().optional(),
})

// =============================
// INFERRED TYPES
// =============================
export type ExamRegistration = z.infer<typeof ExamRegistrationSchema>
export type ExamRegistrationCreateRequest = z.infer<typeof ExamRegistrationCreateRequestSchema>
export type ExamRegistrationUpdateRequest = z.infer<typeof ExamRegistrationUpdateRequestSchema>
export type ExamRegistrationQueryParams = z.infer<typeof ExamRegistrationQueryParamsSchema>