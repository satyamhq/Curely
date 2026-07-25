import Link from 'next/link'
import { AlertTriangle, CheckCircle2, ShieldCheck, Stethoscope, UserCheck } from 'lucide-react'

export default function DoctorDashboard() {
  // Mock doctor verification state — linked to profiles & doctors table
  const isVerified = false

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Manage your consultations, patients, and practice schedule</p>
        </div>

        {/* Verification banner */}
        {!isVerified ? (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-6 text-amber-900 dark:text-amber-200">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Account Verification Pending</h3>
                <p className="text-sm opacity-90">
                  Your medical license and profile details are currently under review by our medical board. Complete your profile documentation to get verified and list your availability to patients.
                </p>
                <div className="pt-2">
                  <Link
                    href="/doctor-dashboard/profile"
                    className="inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-amber-700"
                  >
                    Complete Doctor Verification Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-900 dark:text-emerald-200 text-sm font-medium">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span>Your doctor profile is verified and active for patient bookings.</span>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Today's Appointments</span>
              <Stethoscope className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-4 text-3xl font-bold">0</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Patients</span>
              <UserCheck className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-4 text-3xl font-bold">0</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Verification</span>
              <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-4 text-lg font-semibold capitalize">{isVerified ? 'Verified' : 'Pending'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
