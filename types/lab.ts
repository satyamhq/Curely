export interface Lab {
  id: string
  profile_id: string
  name: string
  address: string
  license_no: string
  verified: boolean
  rating?: number
  created_at: string
}

export interface LabTest {
  id: string
  lab_id: string
  name: string
  price: number
  description: string | null
  sample_type: string
  turnaround_hours?: number
}
