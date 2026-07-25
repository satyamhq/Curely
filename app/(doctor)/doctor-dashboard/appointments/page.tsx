'use client'

import { useEffect, useState } from 'react'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { Calendar, CheckCircle2, Clock, User, XCircle, FileText, Loader2, AlertCircle } from 'lucide-react'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'completed'>('pending')

  async function loadDoctorAppointments() {
    try {
      setLoading(true)
      setError(null)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      // Find Doctor ID for profile
      const { data: docRecord, error: docErr } = await supabase
        .from('doctors')
        .select('id')
        .eq('profile_id', user.id)
        .maybeSingle()

      if (docErr) throw docErr
      if (!docRecord) {
        setAppointments([])
        setLoading(false)
        return
      }

      const { data, error: fetchErr } = await supabase
        .from('appointments')
        .select(`
          id,
          slot_time,
          status,
          mode,
          amount,
          created_at,
          patient:profiles!appointments_patient_id_fkey (
            full_name,
            phone
          )
        `)
        .eq('doctor_id', (docRecord as any).id)
        .order('slot_time', { ascending: false })

      if (fetchErr) throw fetchErr

      const formatted = (data || []).map((apt: any) => ({
        id: apt.id,
        patient_name: apt.patient?.full_name || 'Patient User',
        patient_phone: apt.patient?.phone || 'N/A',
        slot_time: apt.slot_time,
        status: apt.status,
        mode: apt.mode,
        amount: apt.amount,
        symptoms: 'General consultation request.',
      }))
      setAppointments(formatted)

    } catch (err: any) {
      console.error('Error loading doctor appointments:', err)
      setError(err.message || 'Failed to load doctor appointments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDoctorAppointments()
  }, [])

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const supabase = createClient()
      const { error: updateErr } = await (supabase.from('appointments') as any)
        .update({ status: status as any })
        .eq('id', id)

      if (updateErr) throw updateErr
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      )
    } catch (err: any) {
      console.error('Error updating appointment status:', err)
      alert(err.message || 'Failed to update status.')
    }
  }

  const filtered = appointments.filter((a) => {
    if (activeTab === 'pending') return a.status === 'pending'
    if (activeTab === 'confirmed') return a.status === 'confirmed'
    return a.status === 'completed'
  })

  return (
    <ProviderLayoutShell role="doctor">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Appointments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review incoming consultation requests, accept bookings, and manage schedule
          </p>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-4">
          {(['pending', 'confirmed', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab} ({appointments.filter((a) => a.status === tab).length})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3 rounded-2xl border border-border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Loading appointment queue...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-6 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-semibold">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            No {activeTab} appointments found.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((apt) => (
              <div key={apt.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold">
                      {apt.patient_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base">{apt.patient_name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Phone: {apt.patient_phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <span className="text-muted-foreground block font-medium">Slot Time</span>
                      <span className="font-bold text-foreground">{formatDate(apt.slot_time)}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{formatCurrency(apt.amount)}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
                  <strong className="text-foreground font-semibold">Symptoms: </strong> {apt.symptoms}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 border-t border-border/60 pt-3">
                  {apt.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition-colors"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Accept Appointment
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Decline
                      </button>
                    </>
                  )}
                  {apt.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'completed')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                    >
                      <FileText className="h-3.5 w-3.5" /> Complete & Issue Prescription
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

