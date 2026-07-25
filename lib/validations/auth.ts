import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['patient', 'doctor', 'pharmacy', 'lab'], {
    required_error: 'Please select a role',
  }),
  phone: z.string().min(10, 'Please enter a valid 10-digit phone number').optional().or(z.literal('')),
  city: z.string().min(2, 'Please enter your city').optional().or(z.literal('')),
})

export type SignupInput = z.infer<typeof signupSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
