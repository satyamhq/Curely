'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PatientLayoutShell } from '@/components/layout/PatientLayoutShell'
import { BookingCalendar } from '@/components/booking/BookingCalendar'
import { TimeSlotPicker } from '@/components/booking/TimeSlotPicker'
import { BookingConfirmation } from '@/components/booking/BookingConfirmation'
import { ArrowLeft, Calendar, CheckCircle2, CreditCard, ShieldCheck, Sparkles, Stethoscope, Video, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

function BookAppointmentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const doctorId = searchParams.get('doctorId') ?? 'doc-1'

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [mode, setMode] = useState<'online' | 'in_person'>('online')
  const [step, setStep] = useState<'schedule' | 'payment'>('schedule')
  const [loading, setLoading] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const doctor = {
    id: doctorId,
    full_name: 'Dr. Rajesh Sharma',
    speciality: 'General Physician',
    fee: 500, // Doctor fixed rate
    city: 'Mumbai',
    verified: true,
  }

  const handlePayAndBook = async () => {
    if (!selectedSlot) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctor.id,
          slotTime: `${selectedDate.toISOString().slice(0, 10)} ${selectedSlot}`,
          mode,
          amount: doctor.fee,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'This time slot is no longer available. Please select another slot.')
      }

      setConfirmedBooking({
        id: data.id || `apt-${Date.now()}`,
        doctorName: doctor.full_name,
        speciality: doctor.speciality,
        slotTime: selectedDate.toISOString(),
        amount: doctor.fee,
        mode,
      })
    } catch (err: any) {
      setError(err.message || 'Failed to complete appointment booking.')
    } finally {
      setLoading(false)
    }
  }

  if (confirmedBooking) {
    return (
      <BookingConfirmation
        bookingId={confirmedBooking.id}
        doctorName={confirmedBooking.doctorName}
        speciality={confirmedBooking.speciality}
        slotTime={confirmedBooking.slotTime}
        amount={confirmedBooking.amount}
        mode={confirmedBooking.mode}
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link
        href={`/doctors/${doctorId}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to doctor profile
      </Link>

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header Doctor Card */}
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-lg">
              {doctor.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-bold">{doctor.full_name}</h1>
                <ShieldCheck className="h-4 w-4 text-emerald-500 fill-emerald-500/20" />
              </div>
              <p className="text-xs text-muted-foreground">{doctor.speciality}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground block font-medium">Doctor Fixed Rate</span>
            <p className="text-xl font-bold text-emerald-600">{formatCurrency(doctor.fee)}</p>
          </div>
        </div>

        {step === 'schedule' ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Select Consultation Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMode('online')}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-colors ${
                    mode === 'online'
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-border bg-card text-foreground hover:bg-muted'
                  }`}
                >
                  <Video className="h-4 w-4" /> Video Call Consultation
                </button>
                <button
                  type="button"
                  onClick={() => setMode('in_person')}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-colors ${
                    mode === 'in_person'
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-border bg-card text-foreground hover:bg-muted'
                  }`}
                >
                  <Stethoscope className="h-4 w-4" /> In-Clinic Visit
                </button>
              </div>
            </div>

            <BookingCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

            <TimeSlotPicker
              slots={['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM', '06:00 PM']}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
            />

            <button
              onClick={() => setStep('payment')}
              disabled={!selectedSlot}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <CreditCard className="h-4 w-4" /> Proceed to Instant Payment & Booking
            </button>
          </div>
        ) : (
          /* Step 2: Instant Mock Payment Step (No Card Details Needed) */
          <div className="space-y-6">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Payment Summary
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                  <Sparkles className="h-3 w-3" /> One-Click Mock Pay
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Doctor Fixed Fee ({doctor.full_name})</span>
                <span className="font-bold text-foreground">{formatCurrency(doctor.fee)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border/60 pt-2 text-base font-bold">
                <span>Total Amount Due</span>
                <span className="text-emerald-600">{formatCurrency(doctor.fee)}</span>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-xs text-destructive">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('schedule')}
                className="rounded-xl border border-border bg-background py-3 px-5 text-xs font-semibold text-foreground hover:bg-muted"
              >
                Back
              </button>
              <button
                onClick={handlePayAndBook}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing Payment & Booking...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Pay {formatCurrency(doctor.fee)} & Confirm Appointment
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BookAppointmentPage() {
  return (
    <PatientLayoutShell>
      <Suspense fallback={<div className="h-96 w-full max-w-4xl mx-auto rounded-3xl bg-muted animate-pulse" />}>
        <BookAppointmentContent />
      </Suspense>
    </PatientLayoutShell>
  )
}
