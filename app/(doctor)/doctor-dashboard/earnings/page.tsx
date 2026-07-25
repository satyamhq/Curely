'use client'

import { useState, useEffect } from 'react'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { createClient } from '@/utils/supabase/client'
import { formatCurrency } from '@/lib/utils'
import { DollarSign, TrendingUp, Calendar, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

export default function DoctorEarningsPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEarnings: 0,
    monthlyEarnings: 0,
    completedConsultations: 0,
    pendingPayout: 0,
  })
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function loadEarnings() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: doc } = await supabase
          .from('doctors')
          .select('id')
          .eq('profile_id', user.id)
          .single()

        const doctorObj = doc as { id: string } | null
        if (!doctorObj) {
          setLoading(false)
          return
        }

        const { data: apts, error } = await supabase
          .from('appointments')
          .select('id, amount, status, created_at')
          .eq('doctor_id', doctorObj.id)

        if (error) {
          setErrorMsg(error.message)
          return
        }

        if (apts) {
          const now = new Date()
          const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()

          let total = 0
          let month = 0
          let completedCount = 0
          let pending = 0

          apts.forEach((a: any) => {
            const amt = Number(a.amount) || 0
            if (a.status === 'completed') {
              total += amt
              completedCount += 1
              if (new Date(a.created_at).getTime() >= firstDayOfMonth) {
                month += amt
              }
            } else if (a.status === 'confirmed' || a.status === 'pending') {
              pending += amt
            }
          })

          setStats({
            totalEarnings: total,
            monthlyEarnings: month,
            completedConsultations: completedCount,
            pendingPayout: pending,
          })
        }
      } catch (err: any) {
        console.error('Error fetching doctor earnings:', err)
        setErrorMsg(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadEarnings()
  }, [])

  return (
    <ProviderLayoutShell role="doctor">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Earnings & Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track consultation revenue, payout history, and practice analytics derived from real completed consultations
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
            <Loader2 className="h-4 w-4 animate-spin text-primary" /> Calculating revenue metrics...
          </div>
        ) : (
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
              <span className="text-xs font-semibold text-muted-foreground">Completed Consultations</span>
              <p className="text-3xl font-bold text-foreground">{stats.completedConsultations}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-muted-foreground">Upcoming/Pending Fee</span>
              <p className="text-3xl font-bold text-amber-600">{formatCurrency(stats.pendingPayout)}</p>
            </div>
          </div>
        )}
      </div>
    </ProviderLayoutShell>
  )
}
