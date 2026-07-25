export interface PatientProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  city: string | null
  date_of_birth?: string | null
  blood_group?: string | null
  created_at: string
}
