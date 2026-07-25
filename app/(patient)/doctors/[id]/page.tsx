import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { RatingStars } from '@/components/shared/RatingStars'
import { ReviewList } from '@/components/shared/ReviewList'
import { ArrowLeft, Award, Calendar, CheckCircle2, Clock, MapPin, ShieldCheck, Stethoscope, Video } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function DoctorDetailPage({ params }: { params: { id: string } }) {
  const doctor = {
    id: params.id,
    full_name: 'Dr. Rajesh Sharma',
    speciality: 'General Physician',
    experience_years: 12,
    fee: 500,
    city: 'Mumbai',
    qualifications: 'MBBS, MD (Internal Medicine), Fellowship in Diabetology',
    bio: 'Dr. Rajesh Sharma has over 12 years of experience managing acute illnesses, chronic lifestyle conditions like diabetes and hypertension, and general family medicine.',
    verified: true,
    rating: 4.9,
    review_count: 128,
  }

  const mockReviews = [
    {
      id: 'rev-1',
      rating: 5,
      comment: 'Very patient and thorough during the online consultation.',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      reviewer: { full_name: 'Amit Patel' },
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 space-y-8">
        <Link
          href="/doctors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to doctors list
        </Link>

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-2xl shrink-0">
                {doctor.full_name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground">{doctor.full_name}</h1>
                  {doctor.verified && (
                    <span title="Verified Specialist">
                      <ShieldCheck className="h-5 w-5 text-emerald-500 fill-emerald-500/20" />
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-muted-foreground">{doctor.speciality}</p>
                <p className="text-xs text-muted-foreground">{doctor.qualifications}</p>
                <div className="pt-1">
                  <RatingStars rating={doctor.rating} />
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto rounded-2xl border border-border bg-muted/40 p-4 text-center sm:text-right space-y-2">
              <span className="text-xs text-muted-foreground">Consultation Fee</span>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(doctor.fee)}</p>
              <Link
                href={`/appointments/book?doctorId=${doctor.id}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                <Calendar className="h-4 w-4" /> Select Slot
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-border pt-6 text-center text-xs">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <Award className="h-4 w-4" /> Experience
              </div>
              <p className="font-bold text-foreground">{doctor.experience_years} Years</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" /> Location
              </div>
              <p className="font-bold text-foreground">{doctor.city}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <Video className="h-4 w-4" /> Mode
              </div>
              <p className="font-bold text-foreground">Online & In-Person</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-sm">
              <h2 className="font-bold text-lg">About Dr. Sharma</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{doctor.bio}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">Patient Reviews ({doctor.review_count})</h2>
                <RatingStars rating={doctor.rating} />
              </div>
              <ReviewList reviews={mockReviews} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
              <h3 className="font-bold text-base flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Guaranteed Security
              </h3>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  Instant slot confirmation with SMS notification.
                </li>
                <li className="flex items-start gap-2">
                  <Stethoscope className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  Digital prescription issued directly after consultation.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}
