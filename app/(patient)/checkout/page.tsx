'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PatientLayoutShell } from '@/components/layout/PatientLayoutShell'
import { useCart } from '@/hooks/useCart'
import { ArrowLeft, CheckCircle2, CreditCard, Loader2, MapPin, Pill, ShieldCheck, Upload } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart, total } = useCart()
  const subtotal = total()
  const deliveryFee = 49
  const grandTotal = subtotal + deliveryFee

  const [address, setAddress] = useState('Flat 402, Sunshine Apartments, MG Road, Mumbai')
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requiresPrescription = items.some((i) => i.medicine.requires_prescription)

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (requiresPrescription && !prescriptionFile) {
      setError('One or more items in your cart require a valid prescription upload.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 1. Order creation API call
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total: grandTotal,
          address,
          prescriptionUrl: prescriptionFile ? 'uploaded_prescription.pdf' : null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order.')
      }

      clearCart()
      router.push(`/orders/${data.id || 'ord-101'}`)
    } catch (err: any) {
      setError(err.message || 'Order processing failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PatientLayoutShell>
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to shopping cart
        </Link>

        <form onSubmit={handlePlaceOrder} className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Delivery Address
              </h2>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-input bg-background p-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            {/* Prescription Upload */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" /> Doctor Prescription
                </h2>
                {requiresPrescription ? (
                  <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                    Mandatory for Cart
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">Optional</span>
                )}
              </div>

              <div className="rounded-2xl border border-dashed border-border p-6 text-center space-y-2">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="text-xs font-medium text-foreground">Upload prescription image or PDF</p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)}
                  className="mx-auto block text-xs text-muted-foreground file:mr-4 file:rounded-xl file:border-0 file:bg-primary file:py-2 file:px-4 file:text-xs file:font-semibold file:text-primary-foreground"
                />
                {prescriptionFile && (
                  <p className="text-xs font-semibold text-emerald-600 flex items-center justify-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Selected: {prescriptionFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Checkout Payment Box */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-base border-b border-border pb-3">Payment Summary</h3>

            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Medicines Subtotal</span>
                <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Home Delivery</span>
                <span className="font-semibold text-foreground">{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-sm font-bold text-foreground">
                <span>Total Payable</span>
                <span className="text-emerald-600">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing Order...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" /> Place Order ({formatCurrency(grandTotal)})
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </PatientLayoutShell>
  )
}
