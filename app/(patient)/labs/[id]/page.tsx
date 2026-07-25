import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { ArrowLeft, Calendar, Clock, FlaskConical, MapPin, ShieldCheck, Star } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function LabDetailPage({ params }: { params: { id: string } }) {
  const lab = {
    id: params.id,
    name: 'Metropolis Healthcare Diagnostics',
    address: 'Andheri West, Mumbai',
    license_no: 'LAB-MH-2024-901',
    verified: true,
    rating: 4.9,
  }

  const tests = [
    {
      id: 'test-1',
      name: 'Complete Blood Count (CBC)',
      price: 350,
      sample_type: 'Blood',
      turnaround_hours: 12,
      description: 'Evaluates overall health and detects infection or anemia.',
    },
    {
      id: 'test-2',
      name: 'Thyroid Profile Total (T3, T4, TSH)',
      price: 650,
      sample_type: 'Blood',
      turnaround_hours: 24,
      description: 'Assesses thyroid gland function and metabolic health.',
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 space-y-8">
        <Link
          href="/labs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to lab directory
        </Link>

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 font-bold">
                <FlaskConical className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{lab.name}</h1>
                  {lab.verified && (
                    <span title="Accredited Lab">
                      <ShieldCheck className="h-5 w-5 text-emerald-500 fill-emerald-500/20" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5" /> {lab.address}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Accreditation: {lab.license_no}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span>{lab.rating}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Diagnostic Test Offerings</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {tests.map((test) => (
              <div key={test.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-sm text-foreground">{test.name}</h3>
                    <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                      {test.sample_type}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{test.description}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Report in {test.turnaround_hours} hours</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-3">
                  <span className="text-base font-bold text-foreground">{formatCurrency(test.price)}</span>
                  <Link
                    href={`/lab-bookings?testId=${test.id}&labId=${params.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                  >
                    <Calendar className="h-3.5 w-3.5" /> Book Slot
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}
