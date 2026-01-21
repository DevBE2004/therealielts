// ========================================
// USER TYPES
// ========================================

import { email, z } from 'zod'
import { ImageSchema, PaginationParamsSchema } from './base'

export const UserSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  email: z.string().email(),
  mobile: z.string(),
  avatar: z.string().optional(),
  role: z.enum(['USER', 'EDITOR', 'ADMIN']),
  occupation: z.string().optional(),
  code: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export type User = z.infer<typeof UserSchema>

export const UserCreateByAdminSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  mobile: z.string(),
  avatar: ImageSchema.optional(),
  role: z.enum(['USER', 'EDITOR', 'ADMIN']),
  code: z.string().optional(),
  occupation: z.string().optional(),
  password: z.string(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export type UserCreate = z.infer<typeof UserCreateByAdminSchema>

export const UserUpdateByAdminSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  mobile: z.string().regex(/^\d{10}$/, 'Số điện thoại là 10 chữ số'),
  avatar: z.instanceof(File).optional(),
  role: z.enum(['USER', 'EDITOR', 'ADMIN']),
  code: z.string().optional(),
  occupation: z.string().optional(),
  password: z.string().nonempty("Vui lòng nhập mật khẩu hiện tại hoặc mật khẩu mới (nếu thay đổi)"),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export type UserUpdate = z.infer<typeof UserUpdateByAdminSchema>

export const UserQueryParamsSchema = PaginationParamsSchema.extend({
  name: z.string(),
  email: z.string().email(),
  mobile: z.string(),
  role: z.enum(['USER', 'EDITOR', 'ADMIN']),
})

export type UserQueryParams = z.infer<typeof UserQueryParamsSchema>

export const UserUpdateProfileSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  mobile: z.string(),
  occupation: z.string().optional(),
  avatar: ImageSchema.optional(),
})

export type UserUpdateProfile = z.infer<typeof UserUpdateProfileSchema>

export const UserChangePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
})
export type UserChangePassword = z.infer<typeof UserChangePasswordSchema>

export const UserForgotPasswordSchema = z.object({
  email: z.string().email(),
})
export type UserForgotPassword = z.infer<typeof UserForgotPasswordSchema>

export const UserResetPasswordSchema = z
  .object({
    email: z.string(),
    newPassword: z.string().min(6, 'Mật khẩu mới ít nhất 6 ký tự'),
    confirmPassword: z.string().min(6, 'Xác nhận mật khẩu ít nhất 6 ký tự'),
    code: z.string().min(1, 'Mã xác nhận không được để trống'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Xác nhận mật khẩu không khớp',
    path: ['confirmPassword'], 
  })
export type UserResetPassword = z.infer<typeof UserResetPasswordSchema>
