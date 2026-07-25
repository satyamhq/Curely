export interface Doctor {
  id: string
  profile_id: string
  speciality: string
  experience_years: number
  fee: number
  bio: string | null
  qualifications: string | null
  verified: boolean
  rating?: number
  review_count?: number
  created_at: string
}

export interface DoctorWithProfile extends Doctor {
  profile: {
    full_name: string
    avatar_url: string | null
    city: string | null
  }
}

export interface DoctorAvailability {
  id: string
  doctor_id: string
  day_of_week: number // 0 = Sunday, 6 = Saturday
  start_time: string // HH:MM
  end_time: string   // HH:MM
}
