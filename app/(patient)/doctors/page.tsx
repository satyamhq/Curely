'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { DoctorCard } from '@/components/shared/DoctorCard'
import { SearchBar } from '@/components/shared/SearchBar'
import { FilterPanel } from '@/components/shared/FilterPanel'
import { Stethoscope, UserX, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [selectedSpeciality, setSelectedSpeciality] = useState('')
  const [maxFee, setMaxFee] = useState(2000)
  const [minExperience, setMinExperience] = useState(0)

  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true)
        setError(null)
        const supabase = createClient()
        // 1. Fetch Doctors with profiles and availability
        const { data: docsData, error: fetchErr } = await supabase
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
            ),
            doctor_availability (
              day_of_week,
              start_time,
              end_time
            )
          `)
          .eq('verified', true)

        if (fetchErr) throw fetchErr

        // 2. Fetch all reviews for doctors to compute real rating & count
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('target_id, rating')
          .eq('target_type', 'doctor')

        const reviewsMap = new Map<string, { sum: number; count: number }>()
        for (const rev of (reviewsData as any[]) || []) {
          const curr = reviewsMap.get(rev.target_id) || { sum: 0, count: 0 }
          reviewsMap.set(rev.target_id, {
            sum: curr.sum + rev.rating,
            count: curr.count + 1,
          })
        }

        const daysMap: Record<number, string> = {
          0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'
        }
        const todayDay = new Date().getDay()

        const enriched = (docsData || []).map((doc: any) => {
          const revStats = reviewsMap.get(doc.id)
          const avgRating = revStats ? revStats.sum / revStats.count : null
          const reviewCount = revStats ? revStats.count : 0

          const availList = doc.doctor_availability || []
          const isAvailableToday = availList.some((a: any) => a.day_of_week === todayDay)
          const availDays = availList.map((a: any) => daysMap[a.day_of_week]).filter(Boolean).join(', ')

          const availability_text = isAvailableToday
            ? 'Available Today'
            : availDays
            ? `Available ${availDays}`
            : 'By Appointment'

          return {
            ...doc,
            rating: avgRating,
            review_count: reviewCount,
            availability_text,
          }
        })

        setDoctors(enriched)
      } catch (err: any) {
        console.error('Error fetching doctors:', err)
        setError(err.message || 'Failed to load doctors list.')
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const filteredDoctors = doctors.filter((doc) => {
    const fullName = doc.profiles?.full_name || ''
    const city = doc.profiles?.city || ''
    const matchesSearch =
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      doc.speciality.toLowerCase().includes(search.toLowerCase()) ||
      city.toLowerCase().includes(search.toLowerCase())

    const matchesSpeciality = selectedSpeciality ? doc.speciality === selectedSpeciality : true
    const matchesFee = doc.fee <= maxFee
    const matchesExp = doc.experience_years >= minExperience

    return matchesSearch && matchesSpeciality && matchesFee && matchesExp
  })

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1 text-xs font-medium text-muted-foreground mb-3">
            <Stethoscope className="h-3.5 w-3.5 text-primary" />
            Verified Medical Specialists
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Find & Book Top Doctors</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Consult with trusted doctors online or visit in person at their clinic.
          </p>
        </div>

        <SearchBar value={search} onChange={setSearch} placeholder="Search doctor by name, speciality, or city..." />

        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <FilterPanel
              selectedSpeciality={selectedSpeciality}
              onSelectSpeciality={setSelectedSpeciality}
              maxFee={maxFee}
              onMaxFeeChange={setMaxFee}
              minExperience={minExperience}
              onMinExperienceChange={setMinExperience}
            />
          </aside>

          <section className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3 rounded-2xl border border-border bg-card">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground font-medium">Loading verified doctors...</p>
              </div>
            ) : error ? (
              <div className="flex items-center gap-3 p-6 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-semibold">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <UserX className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">No doctors found</h3>
                  <p className="text-sm text-muted-foreground">Try relaxing your search terms or filters to view more providers.</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {filteredDoctors.map((doc) => (
                  <DoctorCard key={doc.id} doctor={doc} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}

