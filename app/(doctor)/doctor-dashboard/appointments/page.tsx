'use client'

import { useState } from 'react'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { Calendar, CheckCircle2, Clock, User, XCircle, FileText } from 'lucide-react'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils'

const MOCK_DOCTOR_APPOINTMENTS = [
  {
    id: 'apt-d1',
    patient_name: 'Amit Patel',
    patient_age: 32,
    patient_phone: '9876543210',
    slot_time: new Date(Date.now() + 86400000).toISOString(),
    status: 'pending',
    mode: 'online',
    amount: 500,
    symptoms: 'Dry cough and mild fever for 2 days.',
  },
  {
    id: 'apt-d2',
    patient_name: 'Sunita Rao',
    patient_age: 45,
    patient_phone: '9812345678',
    slot_time: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'completed',
    mode: 'online',
    amount: 500,
    symptoms: 'Blood sugar checkup consultation.',
  },
]

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState(MOCK_DOCTOR_APPOINTMENTS)
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'completed'>('pending')

  const handleUpdateStatus = (id: string, status: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    )
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

        {/* Appointments List */}
        {filtered.length === 0 ? (
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
                        {apt.patient_age} yrs • Phone: {apt.patient_phone}
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
