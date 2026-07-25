'use client'

import Link from 'next/link'
import { PatientLayoutShell } from '@/components/layout/PatientLayoutShell'
import { Calendar, Download, FileText, FlaskConical } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

const MOCK_PATIENT_LAB_BOOKINGS = [
  {
    id: 'lb-1',
    test_name: 'Complete Blood Count (CBC)',
    lab_name: 'Metropolis Healthcare Diagnostics',
    slot_time: new Date(Date.now() + 86400000).toISOString(),
    status: 'confirmed',
    amount: 350,
    report_url: null,
  },
  {
    id: 'lb-2',
    test_name: 'Thyroid Profile Total (T3, T4, TSH)',
    lab_name: 'Dr. Lal PathLabs Center',
    slot_time: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'completed',
    amount: 650,
    report_url: '/sample_lab_report.pdf',
  },
]

export default function PatientLabBookingsPage() {
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

        <div className="space-y-4">
          {MOCK_PATIENT_LAB_BOOKINGS.map((b) => (
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
      </div>
    </PatientLayoutShell>
  )
}
