'use client'

import { useEffect, useState } from 'react'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { CheckCircle2, Clock, FlaskConical, TestTube, Upload, Loader2, AlertCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

export default function LabBookingsDashboardPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadLabBookings() {
    try {
      setLoading(true)
      setError(null)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data: labRecord, error: labErr } = await supabase
        .from('labs')
        .select('id')
        .eq('profile_id', user.id)
        .maybeSingle()

      if (labErr) throw labErr
      if (!labRecord) {
        setBookings([])
        setLoading(false)
        return
      }

      const { data, error: fetchErr } = await supabase
        .from('lab_bookings')
        .select(`
          id,
          slot_time,
          status,
          amount,
          patient:profiles!lab_bookings_patient_id_fkey (
            full_name
          ),
          lab_tests (
            name,
            sample_type
          )
        `)
        .eq('lab_id', (labRecord as any).id)
        .order('slot_time', { ascending: false })

      if (fetchErr) throw fetchErr

      const formatted = (data || []).map((b: any) => ({
        id: b.id,
        patient_name: b.patient?.full_name || 'Patient User',
        test_name: b.lab_tests?.name || 'Diagnostic Screening',
        sample_type: b.lab_tests?.sample_type || 'Blood',
        slot_time: b.slot_time,
        status: b.status,
        amount: b.amount,
      }))
      setBookings(formatted)

    } catch (err: any) {
      console.error('Error loading lab bookings:', err)
      setError(err.message || 'Failed to load lab test bookings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLabBookings()
  }, [])

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const supabase = createClient()
      const { error: updateErr } = await (supabase.from('lab_bookings') as any)
        .update({ status: status as any })
        .eq('id', id)

      if (updateErr) throw updateErr
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      )
    } catch (err: any) {
      console.error('Error updating lab booking status:', err)
      alert(err.message || 'Failed to update booking status.')
    }
  }

  return (
    <ProviderLayoutShell role="lab">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lab Test Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage scheduled sample pickups, processing queues, and result delivery
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3 rounded-2xl border border-border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-muted-foreground">Loading lab booking queue...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-6 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-semibold">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            No scheduled diagnostic test bookings for your lab center yet.
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 font-bold shrink-0">
                      <FlaskConical className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base">{b.patient_name}</h3>
                      <p className="text-xs text-muted-foreground">{b.test_name} ({b.sample_type})</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <span className="text-muted-foreground block">Pickup Slot</span>
                      <span className="font-bold text-foreground">{formatDate(b.slot_time)}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{formatCurrency(b.amount)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-border/60 pt-3">
                  {b.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(b.id, 'sample_collected')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-blue-700 transition-colors"
                    >
                      <TestTube className="h-3.5 w-3.5" /> Mark Sample Collected
                    </button>
                  )}
                  {b.status === 'sample_collected' && (
                    <button
                      onClick={() => handleUpdateStatus(b.id, 'completed')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition-colors"
                    >
                      <Upload className="h-3.5 w-3.5" /> Complete & Upload PDF Report
                    </button>
                  )}
                  {b.status === 'completed' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Report Delivered
                    </span>
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

