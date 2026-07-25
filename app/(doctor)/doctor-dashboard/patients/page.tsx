'use client'

import Link from 'next/link'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { User, FileText, ArrowRight } from 'lucide-react'

const MOCK_PATIENTS = [
  {
    id: 'pat-1',
    name: 'Amit Patel',
    age: 32,
    city: 'Mumbai',
    lastVisit: new Date(Date.now() - 86400000 * 3).toISOString(),
    totalConsultations: 2,
  },
  {
    id: 'pat-2',
    name: 'Sunita Rao',
    age: 45,
    city: 'Bengaluru',
    lastVisit: new Date(Date.now() - 86400000 * 10).toISOString(),
    totalConsultations: 4,
  },
]

export default function DoctorPatientsPage() {
  return (
    <ProviderLayoutShell role="doctor">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Patients</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Patient history and consultation records (scoped to your practice only)
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {MOCK_PATIENTS.map((p) => (
            <div key={p.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">{p.name}</h3>
                  <p className="text-xs text-muted-foreground">{p.age} yrs • {p.city}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
                <span className="text-muted-foreground">{p.totalConsultations} Consultations</span>
                <Link
                  href={`/doctor-dashboard/patients/${p.id}`}
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  View History <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProviderLayoutShell>
  )
}
