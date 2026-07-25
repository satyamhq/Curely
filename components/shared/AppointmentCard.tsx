import Link from 'next/link'
import { Calendar, Clock, Video, User } from 'lucide-react'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils'

interface AppointmentCardProps {
  appointment: {
    id: string
    slot_time: string
    status: string
    mode: string
    amount: number
    doctor: {
      profile: {
        full_name: string
        city: string | null
      }
      speciality: string
    }
  }
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{appointment.doctor.profile.full_name}</h4>
            <p className="text-xs text-muted-foreground">{appointment.doctor.speciality}</p>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
            appointment.status === 'confirmed'
              ? 'bg-emerald-500/10 text-emerald-600'
              : appointment.status === 'completed'
              ? 'bg-blue-500/10 text-blue-600'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {appointment.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl border border-border/60 bg-muted/40 p-3 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{formatDate(appointment.slot_time)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{formatTime(new Date(appointment.slot_time).toTimeString().slice(0, 5))}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Video className="h-3.5 w-3.5" />
          <span className="capitalize">{appointment.mode} consultation</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold">{formatCurrency(appointment.amount)}</span>
          <Link
            href={`/appointments/${appointment.id}`}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}
