'use client'

import { useState } from 'react'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { CheckCircle2, Clock, Package, Truck, XCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

const MOCK_PHARMACY_ORDERS = [
  {
    id: 'ord-101',
    patient_name: 'Amit Patel',
    status: 'pending',
    total: 191,
    prescription_url: 'prescription.pdf',
    items_summary: '2x Paracetamol 650mg, 1x Amoxicillin 500mg',
    created_at: new Date().toISOString(),
  },
  {
    id: 'ord-102',
    patient_name: 'Sunita Rao',
    status: 'delivered',
    total: 350,
    prescription_url: null,
    items_summary: '3x Cetirizine 10mg',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
]

export default function PharmacyOrdersPage() {
  const [orders, setOrders] = useState(MOCK_PHARMACY_ORDERS)

  const handleUpdateStatus = (id: string, status: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    )
  }

  return (
    <ProviderLayoutShell role="pharmacy">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prescription Order Fulfillment</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review incoming prescription orders, confirm availability, and dispatch medicine delivery
          </p>
        </div>

        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-base">Order #{ord.id}</h3>
                    <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 capitalize">
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Patient: {ord.patient_name}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-muted-foreground block">Order Total</span>
                  <span className="text-base font-bold text-foreground">{formatCurrency(ord.total)}</span>
                </div>
              </div>

              <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
                <strong className="text-foreground font-semibold">Items: </strong> {ord.items_summary}
              </div>

              {/* Order Actions */}
              <div className="flex items-center justify-end gap-2 border-t border-border/60 pt-3">
                {ord.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(ord.id, 'confirmed')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Confirm Prescription
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(ord.id, 'cancelled')}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Reject Order
                    </button>
                  </>
                )}
                {ord.status === 'confirmed' && (
                  <button
                    onClick={() => handleUpdateStatus(ord.id, 'shipped')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                  >
                    <Truck className="h-3.5 w-3.5" /> Dispatch for Home Delivery
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProviderLayoutShell>
  )
}
