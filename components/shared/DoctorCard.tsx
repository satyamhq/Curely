import Link from 'next/link'
import { Calendar, MapPin, ShieldCheck, Star } from 'lucide-react'
import type { DoctorWithProfile } from '@/types/doctor'
import { formatCurrency } from '@/lib/utils'

interface DoctorCardProps {
  doctor: DoctorWithProfile
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
              {doctor.profile.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {doctor.profile.full_name}
                </h3>
                {doctor.verified && (
                  <span title="Verified Provider">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 fill-emerald-500/20" />
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-muted-foreground">{doctor.speciality}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>{doctor.rating ?? 4.9}</span>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground line-clamp-2">
          {doctor.bio || `${doctor.experience_years} years experience in ${doctor.speciality}.`}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{doctor.profile.city || 'Online Consultation'}</span>
          </div>
          <div>{doctor.experience_years} yrs exp</div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
        <div>
          <span className="text-xs text-muted-foreground">Fee</span>
          <p className="text-base font-bold text-foreground">{formatCurrency(doctor.fee)}</p>
        </div>
        <Link
          href={`/doctors/${doctor.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Calendar className="h-3.5 w-3.5" />
          Book Visit
        </Link>
      </div>
    </div>
  )
}
