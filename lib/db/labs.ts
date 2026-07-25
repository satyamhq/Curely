import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/types/database.types'

export type LabRow = Database['public']['Tables']['labs']['Row']

export async function getLabs(): Promise<LabRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('labs')
    .select('*')
    .eq('verified', true)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching labs:', error)
    return []
  }

  return data || []
}

export async function getLabById(id: string): Promise<LabRow | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('labs')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}
