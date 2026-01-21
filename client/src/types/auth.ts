import { z } from 'zod'

export const SignInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type SignIn = z.infer<typeof SignInSchema>

export const SignUpSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email format'),
  mobile: z
    .string()
    .min(10, 'Mobile must be at least 10 digits')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid mobile number format')
    .optional()
    .nullable()
    .or(z.literal(''))
    .transform(val => (val === '' ? null : val)),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type SignUp = z.infer<typeof SignUpSchema>

export const AuthResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  mes: z.string().optional(),
})
