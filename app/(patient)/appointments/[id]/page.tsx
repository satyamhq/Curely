import Link from 'next/link'
import { PatientLayoutShell } from '@/components/layout/PatientLayoutShell'
import { ArrowLeft, Calendar, Clock, MapPin, ShieldCheck, User, Video } from 'lucide-react'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils'

export default function AppointmentDetailPage({ params }: { params: { id: string } }) {
  const appointment = {
    id: params.id,
    slot_time: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'confirmed',
    mode: 'online',
    amount: 500,
    doctor: {
      id: 'doc-1',
      profile: {
        full_name: 'Dr. Rajesh Sharma',
        city: 'Mumbai',
      },
      speciality: 'General Physician',
      qualifications: 'MBBS, MD (Internal Medicine)',
    },
  }

  return (
    <PatientLayoutShell>
      <div className="max-w-3xl mx-auto space-y-8">
        <Link
          href="/appointments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to appointments
        </Link>

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-6">
            <div>
              <span className="text-xs text-muted-foreground">Booking Reference</span>
              <h1 className="text-2xl font-bold text-foreground">#{appointment.id.slice(0, 8)}</h1>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-600 capitalize">
              {appointment.status}
            </span>
          </div>

          {/* Doctor Info */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-xl">
              {appointment.doctor.profile.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">{appointment.doctor.profile.full_name}</h2>
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-xs text-muted-foreground">{appointment.doctor.speciality} — {appointment.doctor.qualifications}</p>
            </div>
          </div>

          {/* Appointment Schedule Details */}
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-muted/40 p-4 text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Consultation Date
              </span>
              <p className="font-bold text-foreground">{formatDate(appointment.slot_time)}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Time Slot
              </span>
              <p className="font-bold text-foreground">{formatTime('10:00')}</p>
            </div>
          </div>

          {/* Telehealth Call Join Button */}
          <div className="pt-2">
            <Link
              href={`/consultations/${appointment.id}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              <Video className="h-4 w-4" /> Enter Live Video Consultation Session
            </Link>
          </div>
        </div>
      </div>
    </PatientLayoutShell>
  )
}
