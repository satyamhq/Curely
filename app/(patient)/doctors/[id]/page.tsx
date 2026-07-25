'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { RatingStars } from '@/components/shared/RatingStars'
import { ReviewList } from '@/components/shared/ReviewList'
import { ArrowLeft, Award, Calendar, CheckCircle2, Clock, MapPin, ShieldCheck, Stethoscope, Video, Loader2, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

export default function DoctorDetailPage({ params }: { params: { id: string } }) {
  const [doctor, setDoctor] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDoctorDetail() {
      try {
        setLoading(true)
        setError(null)
        const supabase = createClient()

        // Fetch Doctor Profile
        const { data: docData, error: docErr } = await supabase
          .from('doctors')
          .select(`
            id,
            profile_id,
            speciality,
            experience_years,
            fee,
            bio,
            qualifications,
            verified,
            created_at,
            profiles (
              full_name,
              avatar_url,
              city
            )
          `)
          .eq('id', params.id)
          .single()

        if (docErr) throw docErr
        setDoctor(docData)

        // Fetch Reviews for Doctor
        const { data: revData, error: revErr } = await supabase
          .from('reviews')
          .select(`
            id,
            rating,
            comment,
            created_at,
            reviewer:profiles!reviews_reviewer_id_fkey(full_name)
          `)
          .eq('target_type', 'doctor')
          .eq('target_id', params.id)

        if (!revErr && revData) {
          setReviews(revData)
        }
      } catch (err: any) {
        console.error('Error fetching doctor detail:', err)
        setError(err.message || 'Failed to load doctor profile.')
      } finally {
        setLoading(false)
      }
    }

    fetchDoctorDetail()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Loading doctor details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto p-8 flex flex-col items-center justify-center text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-bold">Doctor Not Found</h2>
          <p className="text-sm text-muted-foreground">{error || 'The requested provider profile does not exist.'}</p>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Doctors
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const fullName = doctor.profiles?.full_name || 'Dr. Medical Specialist'
  const city = doctor.profiles?.city || 'Online Consultation'
  const hasReviews = reviews.length > 0
  const avgRatingNum = hasReviews
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0

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
                {fullName.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground">{fullName}</h1>
                  {doctor.verified && (
                    <span title="Verified Specialist">
                      <ShieldCheck className="h-5 w-5 text-emerald-500 fill-emerald-500/20" />
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-muted-foreground">{doctor.speciality}</p>
                <p className="text-xs text-muted-foreground">{doctor.qualifications || 'Certified Medical Practitioner'}</p>
                <div className="pt-1 flex items-center gap-2">
                  {hasReviews ? (
                    <>
                      <RatingStars rating={Number(avgRatingNum.toFixed(1))} />
                      <span className="text-xs font-semibold text-muted-foreground">({avgRatingNum.toFixed(1)})</span>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">No reviews yet</span>
                  )}
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
              <p className="font-bold text-foreground">{city}</p>
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
              <h2 className="font-bold text-lg">About {fullName}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {doctor.bio || `${doctor.experience_years} years experience in ${doctor.speciality}.`}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">Patient Reviews ({reviews.length})</h2>
                {hasReviews && <RatingStars rating={Number(avgRatingNum.toFixed(1))} />}
              </div>
              <ReviewList reviews={reviews} />
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

