export interface Pharmacy {
  id: string
  profile_id: string
  name: string
  address: string
  license_no: string
  verified: boolean
  rating?: number
  created_at: string
}

export interface Medicine {
  id: string
  pharmacy_id: string
  name: string
  price: number
  stock: number
  requires_prescription: boolean
  description?: string | null
  image_url?: string | null
}
