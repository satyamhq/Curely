'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PatientLayoutShell } from '@/components/layout/PatientLayoutShell'
import { AppointmentCard } from '@/components/shared/AppointmentCard'
import { Calendar, Stethoscope, Video } from 'lucide-react'

const MOCK_APPOINTMENTS = [
  {
    id: 'apt-1',
    slot_time: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'confirmed',
    mode: 'online',
    amount: 500,
    doctor: {
      profile: {
        full_name: 'Dr. Rajesh Sharma',
        city: 'Mumbai',
      },
      speciality: 'General Physician',
    },
  },
  {
    id: 'apt-2',
    slot_time: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'completed',
    mode: 'online',
    amount: 1200,
    doctor: {
      profile: {
        full_name: 'Dr. Priya Ananth',
        city: 'Bengaluru',
      },
      speciality: 'Cardiologist',
    },
  },
]

export default function PatientAppointmentsPage() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all')

  const filtered = MOCK_APPOINTMENTS.filter((apt) => {
    if (filter === 'upcoming') return apt.status === 'confirmed'
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
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            No appointments found in this category.
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
