'use client'

import { useEffect, useState } from 'react'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { CheckCircle2, ShieldCheck, XCircle, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function AdminVerificationsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadPendingVerifications() {
    try {
      setLoading(true)
      setError(null)
      const supabase = createClient()

      // 1. Fetch unverified doctors
      const { data: doctorsData, error: docErr } = await supabase
        .from('doctors')
        .select('id, qualifications, verified, created_at, profiles(full_name)')
        .eq('verified', false)

      if (docErr) throw docErr

      // 2. Fetch unverified pharmacies
      const { data: pharmData, error: pharmErr } = await supabase
        .from('pharmacies')
        .select('id, name, license_no, verified, created_at')
        .eq('verified', false)

      if (pharmErr) throw pharmErr

      // 3. Fetch unverified labs
      const { data: labsData, error: labErr } = await supabase
        .from('labs')
        .select('id, name, license_no, verified, created_at')
        .eq('verified', false)

      if (labErr) throw labErr

      const docItems = (doctorsData || []).map((d: any) => ({
        id: d.id,
        table: 'doctors',
        name: d.profiles?.full_name || 'Medical Specialist',
        role: 'Doctor',
        license: 'MCI Medical License',
        qualifications: d.qualifications || 'Certified Doctor',
        status: 'pending',
      }))

      const pharmItems = (pharmData || []).map((p: any) => ({
        id: p.id,
        table: 'pharmacies',
        name: p.name,
        role: 'Pharmacy',
        license: p.license_no,
        qualifications: 'Licensed Retail Pharmacy',
        status: 'pending',
      }))

      const labItems = (labsData || []).map((l: any) => ({
        id: l.id,
        table: 'labs',
        name: l.name,
        role: 'Lab',
        license: l.license_no,
        qualifications: 'NABL Accredited Laboratory',
        status: 'pending',
      }))

      setItems([...docItems, ...pharmItems, ...labItems])
    } catch (err: any) {
      console.error('Error loading verifications queue:', err)
      setError(err.message || 'Failed to load pending verifications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPendingVerifications()
  }, [])

  const handleApprove = async (id: string, table: string) => {
    try {
      const supabase = createClient()
      const { error: updateErr } = await (supabase.from(table as any) as any)
        .update({ verified: true })
        .eq('id', id)

      if (updateErr) throw updateErr
      setItems((prev) => prev.filter((i) => i.id !== id))
    } catch (err: any) {
      console.error('Error approving provider:', err)
      alert(err.message || 'Failed to approve provider.')
    }
  }

  const handleReject = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
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

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3 rounded-2xl border border-border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Loading pending verifications...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-6 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-semibold">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            No pending provider verification requests in queue.
          </div>
        ) : (
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
                      <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize bg-amber-500/10 text-amber-600">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">License: {item.license} • Credentials: {item.qualifications}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(item.id, item.table)}
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
        )}
      </div>
    </ProviderLayoutShell>
  )
}

