import Link from 'next/link'
import { AlertTriangle, Building2, Package, ShieldCheck } from 'lucide-react'

export default function PharmacyDashboard() {
  const isVerified = false

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pharmacy Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Manage medicine inventory, prescriptions, and order fulfillment</p>
        </div>

        {!isVerified ? (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-6 text-amber-900 dark:text-amber-200">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Drug License Verification Required</h3>
                <p className="text-sm opacity-90">
                  Please submit your valid drug license number and pharmacy registration details so our team can approve your storefront for patient medicine orders.
                </p>
                <div className="pt-2">
                  <Link
                    href="/pharmacy-dashboard/profile"
                    className="inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-amber-700"
                  >
                    Submit Pharmacy License
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-900 dark:text-emerald-200 text-sm font-medium">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span>Your pharmacy is verified and live for patient orders.</span>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Active Orders</span>
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-4 text-3xl font-bold">0</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Inventory Items</span>
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-4 text-3xl font-bold">0</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">License Status</span>
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-4 text-lg font-semibold capitalize">{isVerified ? 'Verified' : 'Pending'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
