'use client'

import { useState } from 'react'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { CheckCircle2, Clock, FlaskConical, TestTube, Upload } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

const MOCK_LAB_BOOKINGS = [
  {
    id: 'lbook-1',
    patient_name: 'Amit Patel',
    test_name: 'Complete Blood Count (CBC)',
    sample_type: 'Blood',
    slot_time: new Date(Date.now() + 86400000).toISOString(),
    status: 'pending',
    amount: 350,
  },
  {
    id: 'lbook-2',
    patient_name: 'Sunita Rao',
    test_name: 'Thyroid Profile Total',
    sample_type: 'Blood',
    slot_time: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'completed',
    amount: 650,
  },
]

export default function LabBookingsDashboardPage() {
  const [bookings, setBookings] = useState(MOCK_LAB_BOOKINGS)

  const handleUpdateStatus = (id: string, status: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    )
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
      </div>
    </ProviderLayoutShell>
  )
}
