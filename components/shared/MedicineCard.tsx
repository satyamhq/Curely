'use client'

import { Check, Pill, Plus } from 'lucide-react'
import type { Medicine } from '@/types/pharmacy'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/lib/utils'

interface MedicineCardProps {
  medicine: Medicine
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  const { addItem, items } = useCart()
  const inCart = items.some((i) => i.medicine.id === medicine.id)

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 hover:border-primary/40 transition-colors">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
              <Pill className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm text-foreground line-clamp-1">{medicine.name}</h3>
          </div>
          {medicine.requires_prescription && (
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 shrink-0">
              Rx Required
            </span>
          )}
        </div>
        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
          {medicine.description || 'Quality pharmaceutical formulation.'}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-border/60 pt-3">
        <div>
          <span className="text-[10px] text-muted-foreground block">Price</span>
          <span className="text-base font-bold text-foreground">{formatCurrency(medicine.price)}</span>
        </div>
        <button
          onClick={() => addItem(medicine)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors ${
            inCart
              ? 'bg-emerald-600 text-white'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {inCart ? (
            <>
              <Check className="h-3.5 w-3.5" /> In Cart
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
}
