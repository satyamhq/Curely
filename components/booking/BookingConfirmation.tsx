import Link from 'next/link'
import { Calendar, CheckCircle2, Clock, MapPin, ShieldCheck, User } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface BookingConfirmationProps {
  bookingId: string
  doctorName: string
  speciality: string
  slotTime: string
  amount: number
  mode: string
}

export function BookingConfirmation({
  bookingId,
  doctorName,
  speciality,
  slotTime,
  amount,
  mode,
}: BookingConfirmationProps) {
  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-card p-8 shadow-lg max-w-lg mx-auto text-center space-y-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
        <CheckCircle2 className="h-10 w-10" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground">Appointment Confirmed!</h2>
        <p className="text-xs text-muted-foreground mt-1">Booking Reference ID: #{bookingId.slice(0, 8)}</p>
      </div>

      <div className="rounded-2xl border border-border bg-muted/40 p-5 space-y-3 text-left text-xs">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">{doctorName}</span>
          </div>
          <span className="text-muted-foreground">{speciality}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> Date & Time
          </span>
          <span className="font-bold text-foreground">{formatDate(slotTime)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> Mode
          </span>
          <span className="font-semibold capitalize text-foreground">{mode} Consultation</span>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="font-bold">Total Paid</span>
          <span className="font-bold text-emerald-600">{formatCurrency(amount)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/appointments"
          className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        >
          View My Appointments
        </Link>
        <Link
          href="/dashboard"
          className="flex-1 rounded-xl border border-border bg-background py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}
