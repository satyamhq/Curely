import { z } from 'zod'

export const doctorOnboardingSchema = z.object({
  speciality: z.string().min(2, 'Please select or enter your speciality'),
  experienceYears: z.coerce.number().min(0, 'Experience must be 0 or more years'),
  fee: z.coerce.number().min(0, 'Consultation fee must be 0 or more'),
  bio: z.string().min(10, 'Please write a short bio (at least 10 characters)').optional().or(z.literal('')),
  qualifications: z.string().min(2, 'Please state your qualifications (e.g. MBBS, MD)').optional().or(z.literal('')),
})

export type DoctorOnboardingInput = z.infer<typeof doctorOnboardingSchema>

export const pharmacyOnboardingSchema = z.object({
  name: z.string().min(2, 'Pharmacy name must be at least 2 characters'),
  address: z.string().min(5, 'Full address is required'),
  licenseNo: z.string().min(4, 'Valid drug license number is required'),
})

export type PharmacyOnboardingInput = z.infer<typeof pharmacyOnboardingSchema>

export const labOnboardingSchema = z.object({
  name: z.string().min(2, 'Lab name must be at least 2 characters'),
  address: z.string().min(5, 'Full address is required'),
  licenseNo: z.string().min(4, 'Valid lab license/registration number is required'),
})

export type LabOnboardingInput = z.infer<typeof labOnboardingSchema>
