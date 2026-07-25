'use client'

import Link from 'next/link'
import { PatientLayoutShell } from '@/components/layout/PatientLayoutShell'
import { CheckCircle2, Clock, Package, Pill, Truck } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

const MOCK_ORDERS = [
  {
    id: 'ord-101',
    status: 'shipped',
    total: 191,
    pharmacy_name: 'Apollo Pharmacy — Downtown',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    items_count: 2,
  },
  {
    id: 'ord-102',
    status: 'delivered',
    total: 350,
    pharmacy_name: 'Wellness Forever Chemists',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    items_count: 3,
  },
]

export default function OrdersPage() {
  return (
    <PatientLayoutShell>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1 text-xs font-medium text-muted-foreground mb-1">
              <Package className="h-3.5 w-3.5 text-emerald-600" />
              Prescription Orders
            </div>
            <h1 className="text-3xl font-bold tracking-tight">My Medicine Orders</h1>
          </div>
          <Link
            href="/pharmacy"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            <Pill className="h-3.5 w-3.5" /> Order Medicines
          </Link>
        </div>

        <div className="space-y-4">
          {MOCK_ORDERS.map((ord) => (
            <div key={ord.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 font-bold shrink-0">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground">Order #{ord.id}</h3>
                    <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 capitalize">
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{ord.pharmacy_name} • {ord.items_count} items</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Placed on {formatDate(ord.created_at)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                <span className="text-base font-bold text-foreground">{formatCurrency(ord.total)}</span>
                <Link
                  href={`/orders/${ord.id}`}
                  className="rounded-xl border border-input bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Track Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PatientLayoutShell>
  )
}
