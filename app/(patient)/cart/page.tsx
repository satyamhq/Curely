'use client'

import Link from 'next/link'
import { PatientLayoutShell } from '@/components/layout/PatientLayoutShell'
import { useCart } from '@/hooks/useCart'
import { ArrowRight, Minus, Pill, Plus, ShoppingBag, Trash2, Upload } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart()
  const subtotal = total()
  const deliveryFee = subtotal > 0 ? 49 : 0
  const grandTotal = subtotal + deliveryFee

  return (
    <PatientLayoutShell>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1 text-xs font-medium text-muted-foreground mb-1">
              <ShoppingBag className="h-3.5 w-3.5 text-emerald-600" />
              Medicine Cart
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-12 text-center space-y-4 shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div className="max-w-sm space-y-1">
              <h3 className="text-lg font-bold">Your cart is empty</h3>
              <p className="text-xs text-muted-foreground">Browse our pharmacy marketplace to add genuine medicines and healthcare essentials.</p>
            </div>
            <Link
              href="/pharmacy"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              <Pill className="h-4 w-4" /> Shop Medicines
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(({ medicine, quantity }) => (
                <div key={medicine.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-bold shrink-0">
                      <Pill className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">{medicine.name}</h3>
                      <p className="text-xs text-muted-foreground">{formatCurrency(medicine.price)} each</p>
                      {medicine.requires_prescription && (
                        <span className="inline-block mt-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                          Prescription Needed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0">
                    <div className="flex items-center gap-2 rounded-xl border border-border bg-muted p-1">
                      <button
                        onClick={() => updateQuantity(medicine.id, quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-background text-foreground hover:bg-muted"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(medicine.id, quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-background text-foreground hover:bg-muted"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <span className="text-sm font-bold text-foreground w-20 text-right">
                      {formatCurrency(medicine.price * quantity)}
                    </span>

                    <button
                      onClick={() => removeItem(medicine.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Box */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-base border-b border-border pb-3">Order Summary</h3>

              <div className="space-y-2.5 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-foreground">{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-sm font-bold text-foreground">
                  <span>Grand Total</span>
                  <span className="text-emerald-600">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </PatientLayoutShell>
  )
}
