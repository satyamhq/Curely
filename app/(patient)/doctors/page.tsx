'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { DoctorCard } from '@/components/shared/DoctorCard'
import { SearchBar } from '@/components/shared/SearchBar'
import { FilterPanel } from '@/components/shared/FilterPanel'
import { Stethoscope, UserX } from 'lucide-react'

// Mock doctors list for dev UI demonstration
const MOCK_DOCTORS = [
  {
    id: 'doc-1',
    profile_id: 'prof-1',
    speciality: 'General Physician',
    experience_years: 12,
    fee: 500,
    bio: 'Senior General Physician specializing in preventive health care, fever management, and lifestyle disorders.',
    qualifications: 'MBBS, MD (Internal Medicine)',
    verified: true,
    rating: 4.9,
    review_count: 128,
    created_at: new Date().toISOString(),
    profile: {
      full_name: 'Dr. Rajesh Sharma',
      avatar_url: null,
      city: 'Mumbai',
    },
  },
  {
    id: 'doc-2',
    profile_id: 'prof-2',
    speciality: 'Cardiologist',
    experience_years: 18,
    fee: 1200,
    bio: 'Consultant Interventional Cardiologist with extensive expertise in heart health and blood pressure control.',
    qualifications: 'MBBS, DM (Cardiology)',
    verified: true,
    rating: 5.0,
    review_count: 94,
    created_at: new Date().toISOString(),
    profile: {
      full_name: 'Dr. Priya Ananth',
      avatar_url: null,
      city: 'Bengaluru',
    },
  },
  {
    id: 'doc-3',
    profile_id: 'prof-3',
    speciality: 'Dermatologist',
    experience_years: 9,
    fee: 750,
    bio: 'Specialist in clinical dermatology, skin rejuvenation, acne treatment, and hair care therapies.',
    qualifications: 'MBBS, DVD, MD (Dermatology)',
    verified: true,
    rating: 4.8,
    review_count: 67,
    created_at: new Date().toISOString(),
    profile: {
      full_name: 'Dr. Vikram Sethi',
      avatar_url: null,
      city: 'Delhi NCR',
    },
  },
]

export default function DoctorsPage() {
  const [search, setSearch] = useState('')
  const [selectedSpeciality, setSelectedSpeciality] = useState('')
  const [maxFee, setMaxFee] = useState(2000)
  const [minExperience, setMinExperience] = useState(0)

  const filteredDoctors = MOCK_DOCTORS.filter((doc) => {
    const matchesSearch =
      doc.profile.full_name.toLowerCase().includes(search.toLowerCase()) ||
      doc.speciality.toLowerCase().includes(search.toLowerCase()) ||
      (doc.profile.city && doc.profile.city.toLowerCase().includes(search.toLowerCase()))

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
            {filteredDoctors.length === 0 ? (
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
