'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PatientLayoutShell } from '@/components/layout/PatientLayoutShell'
import { Calendar, Download, FileText, FlaskConical, Loader2, AlertCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

export default function PatientLabBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let channel: any = null
    const supabase = createClient()

    async function loadLabBookings() {
      try {
        setLoading(true)
        setError(null)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
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
            lab_tests (
              name
            ),
            labs (
              name
            ),
            lab_reports (
              file_url
            )
          `)
          .eq('patient_id', user.id)
          .order('slot_time', { ascending: false })

        if (fetchErr) throw fetchErr

        const formatted = (data || []).map((b: any) => ({
          id: b.id,
          test_name: b.lab_tests?.name || 'Diagnostic Screening',
          lab_name: b.labs?.name || 'Accredited Lab Center',
          slot_time: b.slot_time,
          status: b.status,
          amount: b.amount,
          report_url: b.lab_reports?.[0]?.file_url || null,
        }))
        setBookings(formatted)

        // Realtime updates
        channel = supabase
          .channel(`patient_lab_bookings_${user.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'lab_bookings',
              filter: `patient_id=eq.${user.id}`,
            },
            () => {
              loadLabBookings()
            }
          )
          .subscribe()

      } catch (err: any) {
        console.error('Error loading lab bookings:', err)
        setError(err.message || 'Failed to load diagnostic lab bookings.')
      } finally {
        setLoading(false)
      }
    }

    loadLabBookings()

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
              <FlaskConical className="h-3.5 w-3.5 text-blue-600" />
              Diagnostic Bookings
            </div>
            <h1 className="text-3xl font-bold tracking-tight">My Lab Bookings & Reports</h1>
          </div>
          <Link
            href="/labs"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            <FlaskConical className="h-3.5 w-3.5" /> Book Diagnostic Test
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3 rounded-2xl border border-border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-muted-foreground">Loading diagnostic lab bookings...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-6 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-semibold">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground space-y-3">
            <p>You have no diagnostic test bookings scheduled.</p>
            <Link
              href="/labs"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Find and book lab tests &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 font-bold shrink-0">
                    <FlaskConical className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground">{b.test_name}</h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                          b.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-blue-500/10 text-blue-600'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{b.lab_name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Sample Pickup: {formatDate(b.slot_time)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                  <span className="text-base font-bold text-foreground">{formatCurrency(b.amount)}</span>
                  {b.report_url ? (
                    <a
                      href={b.report_url}
                      download
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" /> Download Report PDF
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-xl">
                      Report Processing
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PatientLayoutShell>
  )
}

