'use client'

import { useState } from 'react'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { CheckCircle2, ShieldCheck, XCircle } from 'lucide-react'

const MOCK_VERIFICATIONS = [
  {
    id: 'prov-1',
    name: 'Dr. Rajesh Sharma',
    role: 'Doctor',
    license: 'MCI-2012-998877',
    qualifications: 'MBBS, MD',
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'pending',
  },
  {
    id: 'prov-2',
    name: 'Apollo Pharmacy — Downtown',
    role: 'Pharmacy',
    license: 'DL-MH-2024-889',
    qualifications: 'Drug License Reg A',
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'pending',
  },
]

export default function AdminVerificationsPage() {
  const [items, setItems] = useState(MOCK_VERIFICATIONS)

  const handleApprove = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'approved' } : i)))
  }

  const handleReject = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'rejected' } : i)))
  }

  return (
    <ProviderLayoutShell role="admin">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Provider Verification Queue</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Approve or reject license credentials submitted by medical providers
          </p>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-base">{item.name}</h3>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary capitalize">
                      {item.role}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                        item.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : item.status === 'rejected'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">License: {item.license} • Credentials: {item.qualifications}</p>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition-colors"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve Listing
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProviderLayoutShell>
  )
}
