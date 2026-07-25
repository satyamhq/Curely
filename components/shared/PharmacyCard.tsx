import Link from 'next/link'
import { Building2, MapPin, Pill, ShieldCheck, Star } from 'lucide-react'
import type { Pharmacy } from '@/types/pharmacy'

interface PharmacyCardProps {
  pharmacy: Pharmacy
}

export function PharmacyCard({ pharmacy }: PharmacyCardProps) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 font-bold">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {pharmacy.name}
                </h3>
                {pharmacy.verified && (
                  <span title="Verified Pharmacy">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 fill-emerald-500/20" />
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" /> {pharmacy.address}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>{pharmacy.rating ?? 4.8}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
        <span className="text-xs font-medium text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
          Doorstep Delivery
        </span>
        <Link
          href={`/pharmacy/${pharmacy.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Pill className="h-3.5 w-3.5" />
          View Medicines
        </Link>
      </div>
    </div>
  )
}
