'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { SearchBar } from '@/components/shared/SearchBar'
import { PharmacyCard } from '@/components/shared/PharmacyCard'
import { Building2, Pill, ShoppingBag, Plus, Check, Loader2, AlertCircle } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

export default function PharmacyPage() {
  const [pharmacies, setPharmacies] = useState<any[]>([])
  const [medicines, setMedicines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const { addItem, items } = useCart()

  useEffect(() => {
    async function fetchPharmacyCatalog() {
      try {
        setLoading(true)
        setError(null)
        const supabase = createClient()

        // Query Pharmacies
        const { data: pharmData, error: pharmErr } = await supabase
          .from('pharmacies')
          .select('*')
          .eq('verified', true)

        if (pharmErr) throw pharmErr
        setPharmacies(pharmData || [])

        // Query Medicines
        const { data: medData, error: medErr } = await supabase
          .from('medicines')
          .select('*')

        if (medErr) throw medErr
        setMedicines(medData || [])
      } catch (err: any) {
        console.error('Error fetching pharmacy catalog:', err)
        setError(err.message || 'Failed to load pharmacy catalog.')
      } finally {
        setLoading(false)
      }
    }

    fetchPharmacyCatalog()
  }, [])

  const filteredMedicines = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.description && m.description.toLowerCase().includes(search.toLowerCase()))
  )

  const isAdded = (id: string) => items.some((i) => i.medicine.id === id)

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 space-y-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1 text-xs font-medium text-muted-foreground mb-3">
            <Pill className="h-3.5 w-3.5 text-emerald-600" />
            Verified Pharmacy Marketplace
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Order Medicines Online</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Genuine medicines from licensed pharmacies with fast doorstep delivery.
          </p>
        </div>

        <SearchBar value={search} onChange={setSearch} placeholder="Search medicines by name or condition..." />

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3 rounded-2xl border border-border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-sm font-medium text-muted-foreground">Loading pharmacy marketplace...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-6 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-semibold">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <>
            {/* Featured Pharmacies */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Partner Pharmacies</h2>
              {pharmacies.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-xs text-muted-foreground">
                  No verified partner pharmacies registered yet.
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {pharmacies.map((p) => (
                    <PharmacyCard key={p.id} pharmacy={p} />
                  ))}
                </div>
              )}
            </div>

            {/* Medicine Catalog */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Popular Medicines</h2>
              {filteredMedicines.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-xs text-muted-foreground">
                  No medicines match your search criteria.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {filteredMedicines.map((med) => {
                    const inCart = isAdded(med.id)
                    const isOutOfStock = typeof med.stock === 'number' && med.stock <= 0
                    return (
                      <div key={med.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-sm text-foreground">{med.name}</h3>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              {med.requires_prescription && (
                                <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                                  Rx Needed
                                </span>
                              )}
                              <span
                                className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                  isOutOfStock
                                    ? 'bg-destructive/10 text-destructive'
                                    : 'bg-emerald-500/10 text-emerald-600'
                                }`}
                              >
                                {isOutOfStock ? 'Out of Stock' : `In Stock (${med.stock ?? 0})`}
                              </span>
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{med.description || 'Quality health product.'}</p>
                        </div>

                        <div className="flex items-center justify-between border-t border-border/60 pt-3">
                          <span className="text-base font-bold text-foreground">{formatCurrency(med.price)}</span>
                          <button
                            onClick={() => addItem(med)}
                            disabled={isOutOfStock}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors ${
                              isOutOfStock
                                ? 'bg-muted text-muted-foreground cursor-not-allowed shadow-none'
                                : inCart
                                ? 'bg-emerald-600 text-white'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90'
                            }`}
                          >
                            {isOutOfStock ? (
                              'Unavailable'
                            ) : inCart ? (
                              <>
                                <Check className="h-3.5 w-3.5" /> Added
                              </>
                            ) : (
                              <>
                                <Plus className="h-3.5 w-3.5" /> Add
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  })}
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

