export const APP_NAME = 'Curely'
export const APP_DESCRIPTION =
  'AI-powered healthcare marketplace — find doctors, book appointments, order medicines, and manage your health.'

export const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  PHARMACY: 'pharmacy',
  LAB: 'lab',
  ADMIN: 'admin',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const

export const SPECIALITIES = [
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'Neurologist',
  'Orthopedic',
  'Pediatrician',
  'Psychiatrist',
  'Gynecologist',
  'Ophthalmologist',
  'ENT Specialist',
  'Urologist',
  'Oncologist',
  'Endocrinologist',
  'Gastroenterologist',
  'Pulmonologist',
  'Rheumatologist',
  'Nephrologist',
  'Dentist',
] as const

export const CONSULTATION_MODES = {
  ONLINE: 'online',
  IN_PERSON: 'in_person',
} as const
