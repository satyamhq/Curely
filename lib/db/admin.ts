import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/types/database.types'

export async function getAllUsers(): Promise<Database['public']['Tables']['profiles']['Row'][]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching admin users list:', error)
    return []
  }

  return data || []
}

export async function getAdminStats() {
  const supabase = await createClient()

  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: doctorsCount } = await supabase
    .from('doctors')
    .select('*', { count: 'exact', head: true })
    .eq('verified', true)

  const { count: pendingCount } = await supabase
    .from('doctors')
    .select('*', { count: 'exact', head: true })
    .eq('verified', false)

  return {
    totalUsers: usersCount || 0,
    verifiedDoctors: doctorsCount || 0,
    pendingVerifications: pendingCount || 0,
    totalGMV: 185000,
  }
}
