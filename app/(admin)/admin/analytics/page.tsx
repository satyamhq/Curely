import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function AdminAnalyticsPage() {
  return (
    <ProviderLayoutShell role="admin">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Analytics & Growth</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Marketplace gross merchandise volume, consultation volume, and medicine orders
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Gross Merchandise Volume (GMV)</span>
            <p className="text-3xl font-bold text-foreground">{formatCurrency(185000)}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Completed Consultations</span>
            <p className="text-3xl font-bold text-emerald-600">324</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Prescription Orders</span>
            <p className="text-3xl font-bold text-blue-600">188</p>
          </div>
        </div>
      </div>
    </ProviderLayoutShell>
  )
}
