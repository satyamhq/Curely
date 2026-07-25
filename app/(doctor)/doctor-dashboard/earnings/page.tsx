import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { DollarSign, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function DoctorEarningsPage() {
  const stats = {
    totalEarnings: 24500,
    monthlyEarnings: 8500,
    completedConsultations: 49,
    pendingPayout: 3500,
  }

  return (
    <ProviderLayoutShell role="doctor">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Earnings & Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track consultation revenue, payout history, and practice analytics
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Total Revenue</span>
            <p className="text-3xl font-bold text-foreground">{formatCurrency(stats.totalEarnings)}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">This Month</span>
            <p className="text-3xl font-bold text-emerald-600">{formatCurrency(stats.monthlyEarnings)}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Consultations</span>
            <p className="text-3xl font-bold text-foreground">{stats.completedConsultations}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Pending Payout</span>
            <p className="text-3xl font-bold text-amber-600">{formatCurrency(stats.pendingPayout)}</p>
          </div>
        </div>
      </div>
    </ProviderLayoutShell>
  )
}
