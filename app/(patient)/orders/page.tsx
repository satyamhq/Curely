'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PatientLayoutShell } from '@/components/layout/PatientLayoutShell'
import { CheckCircle2, Clock, Package, Pill, Truck, Loader2, AlertCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let channel: any = null
    const supabase = createClient()

    async function loadOrders() {
      try {
        setLoading(true)
        setError(null)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        const { data, error: fetchErr } = await supabase
          .from('orders')
          .select(`
            id,
            status,
            total,
            created_at,
            pharmacies (
              name
            ),
            order_items (
              id
            )
          `)
          .eq('patient_id', user.id)
          .order('created_at', { ascending: false })

        if (fetchErr) throw fetchErr

        const formatted = (data || []).map((ord: any) => ({
          id: ord.id,
          status: ord.status,
          total: ord.total,
          pharmacy_name: ord.pharmacies?.name || 'Local Partner Pharmacy',
          created_at: ord.created_at,
          items_count: ord.order_items?.length || 1,
        }))
        setOrders(formatted)

        // Realtime updates
        channel = supabase
          .channel(`patient_orders_${user.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'orders',
              filter: `patient_id=eq.${user.id}`,
            },
            () => {
              loadOrders()
            }
          )
          .subscribe()

      } catch (err: any) {
        console.error('Error loading patient orders:', err)
        setError(err.message || 'Failed to load medicine orders.')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  return (
    <PatientLayoutShell>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1 text-xs font-medium text-muted-foreground mb-1">
              <Package className="h-3.5 w-3.5 text-emerald-600" />
              Prescription Orders
            </div>
            <h1 className="text-3xl font-bold tracking-tight">My Medicine Orders</h1>
          </div>
          <Link
            href="/pharmacy"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            <Pill className="h-3.5 w-3.5" /> Order Medicines
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3 rounded-2xl border border-border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-sm font-medium text-muted-foreground">Loading medicine orders...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-6 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-semibold">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground space-y-3">
            <p>You have not placed any medicine orders yet.</p>
            <Link
              href="/pharmacy"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Browse Pharmacy Store &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 font-bold shrink-0">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground">Order #{ord.id}</h3>
                      <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 capitalize">
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{ord.pharmacy_name} • {ord.items_count} items</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Placed on {formatDate(ord.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                  <span className="text-base font-bold text-foreground">{formatCurrency(ord.total)}</span>
                  <Link
                    href={`/orders/${ord.id}`}
                    className="rounded-xl border border-input bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    Track Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PatientLayoutShell>
  )
}

