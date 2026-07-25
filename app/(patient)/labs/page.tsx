'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { SearchBar } from '@/components/shared/SearchBar'
import { LabCard } from '@/components/shared/LabCard'
import { Calendar, Clock, FlaskConical, ShieldCheck, TestTube } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const MOCK_LABS = [
  {
    id: 'lab-1',
    profile_id: 'prof-l1',
    name: 'Metropolis Healthcare Diagnostics',
    address: 'Andheri West, Mumbai',
    license_no: 'LAB-MH-2024-901',
    verified: true,
    rating: 4.9,
    created_at: new Date().toISOString(),
  },
  {
    id: 'lab-2',
    profile_id: 'prof-l2',
    name: 'Dr. Lal PathLabs Center',
    address: 'Koramangala, Bengaluru',
    license_no: 'LAB-KA-2023-455',
    verified: true,
    rating: 4.8,
    created_at: new Date().toISOString(),
  },
]

const MOCK_LAB_TESTS = [
  {
    id: 'test-1',
    lab_id: 'lab-1',
    name: 'Complete Blood Count (CBC)',
    price: 350,
    sample_type: 'Blood',
    turnaround_hours: 12,
    description: 'Evaluates overall health and detects a wide range of disorders including anemia and infection.',
  },
  {
    id: 'test-2',
    lab_id: 'lab-1',
    name: 'Thyroid Profile Total (T3, T4, TSH)',
    price: 650,
    sample_type: 'Blood',
    turnaround_hours: 24,
    description: 'Assesses thyroid gland function and metabolic health.',
  },
  {
    id: 'test-3',
    lab_id: 'lab-2',
    name: 'HbA1c Diabetes Screening',
    price: 490,
    sample_type: 'Blood',
    turnaround_hours: 12,
    description: 'Measures average blood sugar levels over the past 2-3 months.',
  },
  {
    id: 'test-4',
    lab_id: 'lab-2',
    name: 'Lipid Profile Heart Checkup',
    price: 790,
    sample_type: 'Blood',
    turnaround_hours: 24,
    description: 'Checks cholesterol levels to evaluate cardiovascular risk.',
  },
]

export default function LabsPage() {
  const [search, setSearch] = useState('')

  const filteredTests = MOCK_LAB_TESTS.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 space-y-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1 text-xs font-medium text-muted-foreground mb-3">
            <FlaskConical className="h-3.5 w-3.5 text-blue-600" />
            Accredited Diagnostic Labs
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Book Diagnostic Tests & Packages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Home sample collection with certified digital lab reports.
          </p>
        </div>

        <SearchBar value={search} onChange={setSearch} placeholder="Search test name (CBC, Thyroid, Lipid, HbA1c)..." />

        {/* Partner Labs */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Accredited Diagnostic Centers</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {MOCK_LABS.map((lab) => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        </div>

        {/* Test Packages Catalog */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Available Health Tests</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredTests.map((test) => (
              <div key={test.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm text-foreground">{test.name}</h3>
                    <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 shrink-0">
                      {test.sample_type}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{test.description}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Report in {test.turnaround_hours} hours</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-3">
                  <span className="text-base font-bold text-foreground">{formatCurrency(test.price)}</span>
                  <Link
                    href={`/lab-bookings?testId=${test.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                  >
                    <Calendar className="h-3.5 w-3.5" /> Book
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
