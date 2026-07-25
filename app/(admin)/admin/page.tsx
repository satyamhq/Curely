'use client'

import Link from 'next/link'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { Building2, CheckCircle2, ShieldAlert, ShieldCheck, Stethoscope, Users } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function AdminDashboardPage() {
  const stats = {
    totalUsers: 1420,
    verifiedDoctors: 48,
    pendingVerifications: 5,
    totalGMV: 185000,
  }

  return (
    <ProviderLayoutShell role="admin">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Curely Platform Governance</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of marketplace providers, user verifications, and transaction volume
          </p>
        </div>

        {/* Platform Stat Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Total Users</span>
            <p className="text-3xl font-bold text-foreground">{stats.totalUsers}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Verified Doctors</span>
            <p className="text-3xl font-bold text-emerald-600">{stats.verifiedDoctors}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Pending Approvals</span>
            <p className="text-3xl font-bold text-amber-600">{stats.pendingVerifications}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Platform GMV</span>
            <p className="text-3xl font-bold text-foreground">{formatCurrency(stats.totalGMV)}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/admin/verifications"
            className="group rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 shadow-sm hover:border-amber-500 transition-colors space-y-3"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-6 w-6 text-amber-600" />
              <h3 className="font-bold text-lg text-foreground">Provider Verifications ({stats.pendingVerifications})</h3>
            </div>
            <p className="text-xs text-muted-foreground">Review license documentation submitted by newly registered doctors, pharmacies, and labs.</p>
          </Link>

          <Link
            href="/admin/users"
            className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary transition-colors space-y-3"
          >
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <h3 className="font-bold text-lg text-foreground">User Management</h3>
            </div>
            <p className="text-xs text-muted-foreground">Browse registered patient, doctor, pharmacy, and diagnostic lab profile accounts.</p>
          </Link>
        </div>
      </div>
    </ProviderLayoutShell>
  )
}
