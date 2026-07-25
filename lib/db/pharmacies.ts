import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/types/database.types'

export type PharmacyRow = Database['public']['Tables']['pharmacies']['Row']

export async function getPharmacies(): Promise<PharmacyRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('pharmacies')
    .select('*')
    .eq('verified', true)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching pharmacies:', error)
    return []
  }

  return data || []
}

export async function getPharmacyById(id: string): Promise<PharmacyRow | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('pharmacies')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}
