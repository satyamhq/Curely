'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { SearchBar } from '@/components/shared/SearchBar'
import { LabCard } from '@/components/shared/LabCard'
import { Calendar, Clock, FlaskConical, ShieldCheck, TestTube, Loader2, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

export default function LabsPage() {
  const [labs, setLabs] = useState<any[]>([])
  const [labTests, setLabTests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchLabCatalog() {
      try {
        setLoading(true)
        setError(null)
        const supabase = createClient()

        // Fetch Verified Labs
        const { data: labData, error: labErr } = await supabase
          .from('labs')
          .select('*')
          .eq('verified', true)

        if (labErr) throw labErr
        setLabs(labData || [])

        // Fetch Lab Tests Catalog
        const { data: testData, error: testErr } = await supabase
          .from('lab_tests')
          .select('*')

        if (testErr) throw testErr
        setLabTests(testData || [])
      } catch (err: any) {
        console.error('Error fetching lab catalog:', err)
        setError(err.message || 'Failed to load diagnostic labs.')
      } finally {
        setLoading(false)
      }
    }

    fetchLabCatalog()
  }, [])

  const filteredTests = labTests.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
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

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3 rounded-2xl border border-border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-muted-foreground">Loading diagnostic centers...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-6 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-semibold">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <>
            {/* Partner Labs */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Accredited Diagnostic Centers</h2>
              {labs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-xs text-muted-foreground">
                  No verified diagnostic centers registered yet.
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {labs.map((lab) => (
                    <LabCard key={lab.id} lab={lab} />
                  ))}
                </div>
              )}
            </div>

            {/* Test Packages Catalog */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Available Health Tests</h2>
              {filteredTests.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-xs text-muted-foreground">
                  No diagnostic tests match your search criteria.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {filteredTests.map((test) => (
                    <div key={test.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm text-foreground">{test.name}</h3>
                          <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 shrink-0">
                            {test.sample_type || 'Blood'}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{test.description || 'Comprehensive diagnostic test.'}</p>
                        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Report in {test.turnaround_hours || 24} hours</span>
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
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}

