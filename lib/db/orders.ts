import { createClient } from '@/utils/supabase/server'
import type { Database, OrderStatus } from '@/types/database.types'

export type OrderRow = Database['public']['Tables']['orders']['Row'] & {
  pharmacy?: {
    name: string
  } | null
  patient?: {
    full_name: string | null
    phone: string | null
  } | null
  order_items?: Array<
    Database['public']['Tables']['order_items']['Row'] & {
      medicine?: Database['public']['Tables']['medicines']['Row'] | null
    }
  >
}

export async function getPatientOrders(patientId: string): Promise<OrderRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      pharmacy:pharmacies (
        name
      )
    `)
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching patient orders:', error)
    return []
  }

  return (data as unknown as OrderRow[]) || []
}

export async function getPharmacyOrders(pharmacyId: string): Promise<OrderRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      patient:profiles!orders_patient_id_fkey (
        full_name,
        phone
      ),
      order_items (
        id,
        qty,
        price,
        medicine:medicines (
          name
        )
      )
    `)
    .eq('pharmacy_id', pharmacyId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pharmacy orders:', error)
    return []
  }

  return (data as unknown as OrderRow[]) || []
}

export async function getOrderById(id: string): Promise<OrderRow | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      pharmacy:pharmacies (
        name
      ),
      order_items (
        id,
        qty,
        price,
        medicine:medicines (
          name
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data as unknown as OrderRow
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await (supabase.from('orders') as any)
    .update({ status })
    .eq('id', id)

  return !error
}
