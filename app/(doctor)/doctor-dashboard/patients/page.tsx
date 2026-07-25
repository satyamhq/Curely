'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { User, FileText, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDoctorPatients() {
      try {
        setLoading(true)
        setError(null)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        const { data: docRecord, error: docErr } = await supabase
          .from('doctors')
          .select('id')
          .eq('profile_id', user.id)
          .maybeSingle()

        if (docErr) throw docErr
        if (!docRecord) {
          setPatients([])
          setLoading(false)
          return
        }

        const { data: apts, error: aptErr } = await supabase
          .from('appointments')
          .select(`
            patient_id,
            patient:profiles!appointments_patient_id_fkey (
              id,
              full_name,
              city
            )
          `)
          .eq('doctor_id', (docRecord as any).id)

        if (aptErr) throw aptErr

        // Deduplicate patient records
        const uniqueMap = new Map<string, any>()
        for (const apt of (apts as any[]) || []) {
          if (apt.patient && !uniqueMap.has(apt.patient_id)) {
            uniqueMap.set(apt.patient_id, {
              id: apt.patient.id,
              name: apt.patient.full_name || 'Patient User',
              city: apt.patient.city || 'Local Area',
              totalConsultations: 1,
            })
          } else if (apt.patient && uniqueMap.has(apt.patient_id)) {
            const existing = uniqueMap.get(apt.patient_id)
            existing.totalConsultations += 1
          }
        }

        setPatients(Array.from(uniqueMap.values()))
      } catch (err: any) {
        console.error('Error loading doctor patients:', err)
        setError(err.message || 'Failed to load patients list.')
      } finally {
        setLoading(false)
      }
    }

    loadDoctorPatients()
  }, [])

  return (
    <ProviderLayoutShell role="doctor">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Patients</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Patient history and consultation records (scoped to your practice only)
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3 rounded-2xl border border-border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Loading patient directory...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-6 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-semibold">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : patients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            No patient records associated with your practice yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {patients.map((p) => (
              <div key={p.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">{p.city}</p>
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
        )}
      </div>
    </ProviderLayoutShell>
  )
}

