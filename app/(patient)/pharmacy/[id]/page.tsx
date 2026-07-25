'use client'

import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { ArrowLeft, Building2, MapPin, Pill, Plus, Check, ShieldCheck, Star } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/lib/utils'

export default function PharmacyDetailPage({ params }: { params: { id: string } }) {
  const { addItem, items } = useCart()

  const pharmacy = {
    id: params.id,
    name: 'Apollo Pharmacy — Downtown',
    address: 'Plot 45, MG Road, Mumbai',
    license_no: 'DL-MH-2024-889',
    verified: true,
    rating: 4.9,
  }

  const inventory = [
    {
      id: 'med-1',
      pharmacy_id: params.id,
      name: 'Paracetamol 650mg (Dolo)',
      price: 32,
      stock: 150,
      requires_prescription: false,
      description: 'Fast acting fever and pain reliever tablets.',
    },
    {
      id: 'med-2',
      pharmacy_id: params.id,
      name: 'Amoxicillin 500mg Antibiotic',
      price: 110,
      stock: 80,
      requires_prescription: true,
      description: 'Prescription antibiotic capsule for bacterial infections.',
    },
  ]

  const isAdded = (id: string) => items.some((i) => i.medicine.id === id)

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 space-y-8">
        <Link
          href="/pharmacy"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to pharmacy directory
        </Link>

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 font-bold">
                <Building2 className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{pharmacy.name}</h1>
                  {pharmacy.verified && (
                    <span title="Verified License">
                      <ShieldCheck className="h-5 w-5 text-emerald-500 fill-emerald-500/20" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5" /> {pharmacy.address}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">License: {pharmacy.license_no}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span>{pharmacy.rating}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Available Inventory</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {inventory.map((med) => {
              const inCart = isAdded(med.id)
              return (
                <div key={med.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-sm text-foreground">{med.name}</h3>
                      {med.requires_prescription && (
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                          Rx Required
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{med.description}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/60 pt-3">
                    <span className="text-base font-bold text-foreground">{formatCurrency(med.price)}</span>
                    <button
                      onClick={() => addItem(med)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold shadow-sm transition-colors ${
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
                          <Plus className="h-3.5 w-3.5" /> Add to Cart
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
