'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { SearchBar } from '@/components/shared/SearchBar'
import { PharmacyCard } from '@/components/shared/PharmacyCard'
import { Building2, Pill, ShoppingBag, Plus, Check } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/lib/utils'

const MOCK_PHARMACIES = [
  {
    id: 'pharm-1',
    profile_id: 'prof-ph1',
    name: 'Apollo Pharmacy — Downtown',
    address: 'Plot 45, MG Road, Mumbai',
    license_no: 'DL-MH-2024-889',
    verified: true,
    rating: 4.9,
    created_at: new Date().toISOString(),
  },
  {
    id: 'pharm-2',
    profile_id: 'prof-ph2',
    name: 'Wellness Forever Chemists',
    address: 'Shop 12, Park Street, Bengaluru',
    license_no: 'DL-KA-2023-112',
    verified: true,
    rating: 4.8,
    created_at: new Date().toISOString(),
  },
]

const MOCK_MEDICINES = [
  {
    id: 'med-1',
    pharmacy_id: 'pharm-1',
    name: 'Paracetamol 650mg (Dolo)',
    price: 32,
    stock: 150,
    requires_prescription: false,
    description: 'Relieves mild to moderate pain and fever.',
  },
  {
    id: 'med-2',
    pharmacy_id: 'pharm-1',
    name: 'Amoxicillin 500mg Antibiotic',
    price: 110,
    stock: 80,
    requires_prescription: true,
    description: 'Penicillin antibiotic used for bacterial infections.',
  },
  {
    id: 'med-3',
    pharmacy_id: 'pharm-2',
    name: 'Cetirizine 10mg Allergy Relief',
    price: 45,
    stock: 200,
    requires_prescription: false,
    description: 'Antihistamine for runny nose, sneezing, and allergies.',
  },
  {
    id: 'med-4',
    pharmacy_id: 'pharm-2',
    name: 'Metformin 500mg Sugar Control',
    price: 85,
    stock: 120,
    requires_prescription: true,
    description: 'Oral diabetes medicine for controlling blood sugar.',
  },
]

export default function PharmacyPage() {
  const [search, setSearch] = useState('')
  const { addItem, items } = useCart()

  const filteredMedicines = MOCK_MEDICINES.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.description.toLowerCase().includes(search.toLowerCase())
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

        {/* Featured Pharmacies */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Partner Pharmacies</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {MOCK_PHARMACIES.map((p) => (
              <PharmacyCard key={p.id} pharmacy={p} />
            ))}
          </div>
        </div>

        {/* Medicine Catalog */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Popular Medicines</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredMedicines.map((med) => {
              const inCart = isAdded(med.id)
              return (
                <div key={med.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm text-foreground">{med.name}</h3>
                      {med.requires_prescription && (
                        <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 shrink-0">
                          Rx Needed
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{med.description}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/60 pt-3">
                    <span className="text-base font-bold text-foreground">{formatCurrency(med.price)}</span>
                    <button
                      onClick={() => addItem(med)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors ${
                        inCart
                          ? 'bg-emerald-600 text-white'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      }`}
                    >
                      {inCart ? (
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
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}
