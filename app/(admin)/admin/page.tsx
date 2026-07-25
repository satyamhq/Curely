'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { Building2, CheckCircle2, ShieldAlert, ShieldCheck, Stethoscope, Users, Database, FileText, Loader2, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedDoctors: 0,
    pendingVerifications: 0,
    totalGMV: 0,
  })

  const supabase = createClient()

  useEffect(() => {
    async function loadAdminStats() {
      try {
        setLoading(true)
        setErrorMsg(null)

        // 1. Total users
        const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })

        // 2. Verified doctors
        const { count: verifiedDocCount } = await supabase
          .from('doctors')
          .select('*', { count: 'exact', head: true })
          .eq('verified', true)

        // 3. Pending verifications
        const { count: pendingDocCount } = await supabase
          .from('doctors')
          .select('*', { count: 'exact', head: true })
          .eq('verified', false)

        const { count: pendingPharmCount } = await supabase
          .from('pharmacies')
          .select('*', { count: 'exact', head: true })
          .eq('verified', false)

        const { count: pendingLabCount } = await supabase
          .from('labs')
          .select('*', { count: 'exact', head: true })
          .eq('verified', false)

        const totalPending = (pendingDocCount || 0) + (pendingPharmCount || 0) + (pendingLabCount || 0)

        // 4. Platform GMV (completed appointments + completed orders + completed lab bookings)
        const { data: apts } = await supabase.from('appointments').select('amount').eq('status', 'completed')
        const { data: orders } = await supabase.from('orders').select('total').eq('status', 'delivered')
        const { data: labs } = await supabase.from('lab_bookings').select('amount').eq('status', 'completed')

        let gmv = 0
        ;(apts || []).forEach((a: any) => (gmv += Number(a.amount) || 0))
        ;(orders || []).forEach((o: any) => (gmv += Number(o.total) || 0))
        ;(labs || []).forEach((l: any) => (gmv += Number(l.amount) || 0))

        setStats({
          totalUsers: usersCount || 0,
          verifiedDoctors: verifiedDocCount || 0,
          pendingVerifications: totalPending,
          totalGMV: gmv,
        })
      } catch (err: any) {
        console.error('Error loading admin stats:', err)
        setErrorMsg(err.message || 'Failed to load governance metrics.')
      } finally {
        setLoading(false)
      }
    }

    loadAdminStats()
  }, [])

  return (
    <ProviderLayoutShell role="admin">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Curely Platform Governance</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of marketplace providers, user verifications, data CRUD management, and audit logs
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs font-medium text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading governance stats...
          </div>
        ) : (
          <>
            {/* Platform Stat Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-2">
                <span className="text-xs font-semibold text-muted-foreground">Total Registered Users</span>
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
                <span className="text-xs font-semibold text-muted-foreground">Platform Real GMV</span>
                <p className="text-3xl font-bold text-foreground">{formatCurrency(stats.totalGMV)}</p>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/admin/verifications"
                className="group rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 shadow-sm hover:border-amber-500 transition-colors space-y-3"
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="h-6 w-6 text-amber-600" />
                  <h3 className="font-bold text-lg text-foreground">Provider Approvals ({stats.pendingVerifications})</h3>
                </div>
                <p className="text-xs text-muted-foreground">Approve or reject pending license applications submitted by newly registered doctors, pharmacies, and labs.</p>
              </Link>

              <Link
                href="/admin/users"
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary transition-colors space-y-3"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  <h3 className="font-bold text-lg text-foreground">User Directory ({stats.totalUsers})</h3>
                </div>
                <p className="text-xs text-muted-foreground">Browse, search, edit, and manage registered patient and provider profile accounts.</p>
              </Link>

              <Link
                href="/admin/data"
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-emerald-500 transition-colors space-y-3"
              >
                <div className="flex items-center gap-3">
                  <Database className="h-6 w-6 text-emerald-600" />
                  <h3 className="font-bold text-lg text-foreground">Full Entity CRUD</h3>
                </div>
                <p className="text-xs text-muted-foreground">Full CRUD management across Doctors, Pharmacies, Medicines, Labs, Tests, Appointments, Orders, and Reviews.</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </ProviderLayoutShell>
  )
}
