import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/types/database.types'

export type DoctorRow = Database['public']['Tables']['doctors']['Row'] & {
  profiles: {
    full_name: string | null
    avatar_url: string | null
    city: string | null
  } | null
}

export async function getDoctors(filters?: {
  speciality?: string
  maxFee?: number
  city?: string
}): Promise<DoctorRow[]> {
  const supabase = await createClient()

  let query = supabase
    .from('doctors')
    .select(`
      *,
      profiles!inner (
        full_name,
        avatar_url,
        city
      )
    `)
    .eq('verified', true)

  if (filters?.speciality) {
    query = query.ilike('speciality', `%${filters.speciality}%`)
  }

  if (filters?.maxFee) {
    query = query.lte('fee', filters.maxFee)
  }

  if (filters?.city) {
    query = query.ilike('profiles.city', `%${filters.city}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching doctors:', error)
    return []
  }

  return (data as unknown as DoctorRow[]) || []
}

export async function getDoctorById(id: string): Promise<DoctorRow | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('doctors')
    .select(`
      *,
      profiles (
        full_name,
        avatar_url,
        city
      )
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data as unknown as DoctorRow
}

export async function updateDoctorProfile(
  id: string,
  updates: Database['public']['Tables']['doctors']['Update']
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await (supabase.from('doctors') as any)
    .update(updates)
    .eq('id', id)

  return !error
}
