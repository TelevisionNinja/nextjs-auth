import { z } from 'zod'
 
export const SignupFormSchemaClientSide = z.object({
  // name: z
  //   .string()
  //   .min(2, { message: 'Name must be at least 2 characters long.' })
  //   .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-z]/, { message: 'Contain at least one lowercase letter.' })
    .regex(/[A-Z]/, { message: 'Contain at least one uppercase letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Contain at least one special character.' })
    .trim(),
  confirmPassword: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-z]/, { message: 'Contain at least one lowercase letter.' })
    .regex(/[A-Z]/, { message: 'Contain at least one uppercase letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Contain at least one special character.' })
    .trim(),
})

export const SigninFormSchemaClientSide = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Not a valid password' })
    .regex(/[a-z]/, { message: 'Not a valid password' })
    .regex(/[A-Z]/, { message: 'Not a valid password' })
    .regex(/[0-9]/, { message: 'Not a valid password' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Not a valid password' })
    .trim(),
})

export const SignupFormSchemaServerSide = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  hash: z
    .string()
    .trim(),
})

export const SigninFormSchemaServerSide = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  hash: z
    .string()
    .trim(),
})

export const userInfoSchema = z.object({
  email: z
    .string()
    .email()
    .trim(),
  role: z
    .string()
    .trim(),
})
