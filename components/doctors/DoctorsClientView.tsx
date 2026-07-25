'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { DoctorCard } from '@/components/shared/DoctorCard'
import { SearchBar } from '@/components/shared/SearchBar'
import { FilterPanel } from '@/components/shared/FilterPanel'
import { Stethoscope, UserX, Loader2 } from 'lucide-react'
import { getDoctors, type DoctorRow } from '@/lib/db/doctors'

export function DoctorsClientView() {
  const [search, setSearch] = useState('')
  const [selectedSpeciality, setSelectedSpeciality] = useState('')
  const [maxFee, setMaxFee] = useState(2000)
  const [minExperience, setMinExperience] = useState(0)
  const [doctors, setDoctors] = useState<DoctorRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLiveDoctors() {
      setLoading(true)
      const data = await getDoctors({
        speciality: selectedSpeciality,
        maxFee: maxFee,
      })
      setDoctors(data)
      setLoading(false)
    }
    fetchLiveDoctors()
  }, [selectedSpeciality, maxFee])

  const filteredDoctors = doctors.filter((doc) => {
    const fullName = doc.profiles?.full_name ?? ''
    const city = doc.profiles?.city ?? ''

    const matchesSearch =
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      doc.speciality.toLowerCase().includes(search.toLowerCase()) ||
      city.toLowerCase().includes(search.toLowerCase())

    const matchesExp = doc.experience_years >= minExperience

    return matchesSearch && matchesExp
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
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading verified doctors from database...</p>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <UserX className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">No doctors found</h3>
                  <p className="text-sm text-muted-foreground">No verified doctors match your search filters in the database.</p>
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
