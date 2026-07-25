'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PatientLayoutShell } from '@/components/layout/PatientLayoutShell'
import { AppointmentCard } from '@/components/shared/AppointmentCard'
import { Calendar, Stethoscope, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all')

  useEffect(() => {
    let channel: any = null
    const supabase = createClient()

    async function loadAppointments() {
      try {
        setLoading(true)
        setError(null)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
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
            doctor_id,
            doctors (
              speciality,
              profiles (
                full_name,
                city
              )
            )
          `)
          .eq('patient_id', user.id)
          .order('slot_time', { ascending: false })

        if (fetchErr) throw fetchErr

        // Transform for AppointmentCard
        const formatted = (data || []).map((apt: any) => ({
          ...apt,
          doctor: {
            speciality: apt.doctors?.speciality || 'General Medicine',
            profile: {
              full_name: apt.doctors?.profiles?.full_name || 'Dr. Medical Specialist',
              city: apt.doctors?.profiles?.city || 'Online',
            },
          },
        }))
        setAppointments(formatted)

        // Realtime Subscription for status changes
        channel = supabase
          .channel(`patient_appointments_${user.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'appointments',
              filter: `patient_id=eq.${user.id}`,
            },
            () => {
              loadAppointments()
            }
          )
          .subscribe()

      } catch (err: any) {
        console.error('Error loading patient appointments:', err)
        setError(err.message || 'Failed to load appointments.')
      } finally {
        setLoading(false)
      }
    }

    loadAppointments()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  const filtered = appointments.filter((apt) => {
    if (filter === 'upcoming') return apt.status === 'confirmed' || apt.status === 'pending'
    if (filter === 'completed') return apt.status === 'completed'
    return true
  })

  return (
    <PatientLayoutShell>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1 text-xs font-medium text-muted-foreground mb-2">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Patient Consultations
            </div>
            <h1 className="text-3xl font-bold tracking-tight">My Doctor Appointments</h1>
          </div>

          <Link
            href="/doctors"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            <Stethoscope className="h-4 w-4" /> Book New Appointment
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-4">
          {(['all', 'upcoming', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize transition-colors ${
                filter === tab
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab} Appointments
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3 rounded-2xl border border-border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Loading your appointments...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-6 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-semibold">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground space-y-3">
            <p>No appointments found in this category.</p>
            <Link
              href="/doctors"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              Consult with a doctor now &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {filtered.map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} />
            ))}
          </div>
        )}
      </div>
    </PatientLayoutShell>
  )
}

