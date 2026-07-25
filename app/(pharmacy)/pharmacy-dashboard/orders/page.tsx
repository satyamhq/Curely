'use client'

import { useEffect, useState } from 'react'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { CheckCircle2, Clock, Package, Truck, XCircle, Loader2, AlertCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

export default function PharmacyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadPharmacyOrders() {
    try {
      setLoading(true)
      setError(null)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data: pharmRecord, error: pharmErr } = await supabase
        .from('pharmacies')
        .select('id')
        .eq('profile_id', user.id)
        .maybeSingle()

      if (pharmErr) throw pharmErr
      if (!pharmRecord) {
        setOrders([])
        setLoading(false)
        return
      }

      const { data, error: fetchErr } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          total,
          prescription_url,
          created_at,
          patient:profiles!orders_patient_id_fkey (
            full_name
          ),
          order_items (
            qty,
            medicines (
              name
            )
          )
        `)
        .eq('pharmacy_id', (pharmRecord as any).id)
        .order('created_at', { ascending: false })

      if (fetchErr) throw fetchErr

      const formatted = (data || []).map((ord: any) => {
        const itemNames = (ord.order_items || [])
          .map((i: any) => `${i.qty}x ${i.medicines?.name || 'Medicine'}`)
          .join(', ')
        return {
          id: ord.id,
          patient_name: ord.patient?.full_name || 'Patient User',
          status: ord.status,
          total: ord.total,
          prescription_url: ord.prescription_url,
          items_summary: itemNames || 'Prescription Medicine Items',
          created_at: ord.created_at,
        }
      })
      setOrders(formatted)

    } catch (err: any) {
      console.error('Error loading pharmacy orders:', err)
      setError(err.message || 'Failed to load pharmacy orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPharmacyOrders()
  }, [])

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const supabase = createClient()
      const { error: updateErr } = await (supabase.from('orders') as any)
        .update({ status: status as any })
        .eq('id', id)

      if (updateErr) throw updateErr
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      )
    } catch (err: any) {
      console.error('Error updating order status:', err)
      alert(err.message || 'Failed to update order status.')
    }
  }

  return (
    <ProviderLayoutShell role="pharmacy">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prescription Order Fulfillment</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review incoming prescription orders, confirm availability, and dispatch medicine delivery
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3 rounded-2xl border border-border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-sm font-medium text-muted-foreground">Loading pharmacy order queue...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-6 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-semibold">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            No active prescription orders for your pharmacy store yet.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground text-base">Order #{ord.id}</h3>
                      <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 capitalize">
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">Patient: {ord.patient_name}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-muted-foreground block">Order Total</span>
                    <span className="text-base font-bold text-foreground">{formatCurrency(ord.total)}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
                  <strong className="text-foreground font-semibold">Items: </strong> {ord.items_summary}
                </div>

                {/* Order Actions */}
                <div className="flex items-center justify-end gap-2 border-t border-border/60 pt-3">
                  {ord.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(ord.id, 'confirmed')}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition-colors"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Confirm Prescription
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(ord.id, 'cancelled')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Reject Order
                      </button>
                    </>
                  )}
                  {ord.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, 'shipped')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                    >
                      <Truck className="h-3.5 w-3.5" /> Dispatch for Home Delivery
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProviderLayoutShell>
  )
}

