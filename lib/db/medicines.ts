import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/types/database.types'

export type MedicineRow = Database['public']['Tables']['medicines']['Row']

export async function getMedicines(pharmacyId?: string): Promise<MedicineRow[]> {
  const supabase = await createClient()

  let query = supabase.from('medicines').select('*')

  if (pharmacyId) {
    query = query.eq('pharmacy_id', pharmacyId)
  }

  const { data, error } = await query.order('name', { ascending: true })

  if (error) {
    console.error('Error fetching medicines:', error)
    return []
  }

  return data || []
}

export async function getMedicineById(id: string): Promise<MedicineRow | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export async function createMedicine(medicine: {
  pharmacy_id: string
  name: string
  price: number
  stock: number
  requires_prescription: boolean
  description?: string
}): Promise<MedicineRow | null> {
  const supabase = await createClient()

  const { data, error } = await (supabase.from('medicines') as any)
    .insert(medicine)
    .select()
    .single()

  if (error) {
    console.error('Error creating medicine:', error)
    return null
  }

  return data
}

export async function deleteMedicine(id: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('medicines')
    .delete()
    .eq('id', id)

  return !error
}
