import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/types/database.types'

export type ProfileRow = Database['public']['Tables']['profiles']['Row']

export async function getProfileById(id: string): Promise<ProfileRow | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export async function updateProfile(
  id: string,
  updates: Database['public']['Tables']['profiles']['Update']
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await (supabase.from('profiles') as any)
    .update(updates)
    .eq('id', id)

  return !error
}
