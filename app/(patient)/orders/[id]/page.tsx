import Link from 'next/link'
import { PatientLayoutShell } from '@/components/layout/PatientLayoutShell'
import { ArrowLeft, CheckCircle2, Clock, MapPin, Package, Pill, Truck } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = {
    id: params.id,
    status: 'shipped',
    total: 191,
    pharmacy_name: 'Apollo Pharmacy — Downtown',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    address: 'Flat 402, Sunshine Apartments, MG Road, Mumbai',
    items: [
      { name: 'Paracetamol 650mg (Dolo)', qty: 2, price: 32 },
      { name: 'Amoxicillin 500mg Antibiotic', qty: 1, price: 110 },
    ],
  }

  const steps = [
    { title: 'Order Placed', done: true },
    { title: 'Prescription Verified', done: true },
    { title: 'Dispatched with Courier', done: true },
    { title: 'Delivered to Doorstep', done: false },
  ]

  return (
    <PatientLayoutShell>
      <div className="max-w-3xl mx-auto space-y-8">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-6">
            <div>
              <span className="text-xs text-muted-foreground">Order Reference</span>
              <h1 className="text-2xl font-bold">#{order.id}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{order.pharmacy_name}</p>
            </div>
            <span className="rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-600 capitalize">
              {order.status}
            </span>
          </div>

          {/* Fulfillment Tracking Timeline */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm">Delivery Tracking Status</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {steps.map((s, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center rounded-2xl border p-3 text-center space-y-1 ${
                    s.done
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'border-border bg-muted/30 text-muted-foreground'
                  }`}
                >
                  <CheckCircle2 className={`h-4 w-4 ${s.done ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                  <span className="text-[11px]">{s.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3 border-t border-border pt-6">
            <h3 className="font-bold text-sm">Ordered Items</h3>
            <div className="divide-y divide-border">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2.5 text-xs">
                  <div>
                    <span className="font-medium text-foreground">{item.name}</span>
                    <span className="text-muted-foreground block">Qty: {item.qty}</span>
                  </div>
                  <span className="font-bold text-foreground">{formatCurrency(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-sm font-bold">
              <span>Total Paid</span>
              <span className="text-emerald-600">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </PatientLayoutShell>
  )
}
