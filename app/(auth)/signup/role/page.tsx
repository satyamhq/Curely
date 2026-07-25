import Link from 'next/link'
import { ArrowRight, Building2, FlaskConical, HeartPulse, Stethoscope, User } from 'lucide-react'

export default function RoleSelectionPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <HeartPulse className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Curely</span>
          </Link>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">Join Curely today</h1>
          <p className="mt-2 text-muted-foreground">Select how you will be using Curely to get started</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {ROLES.map((r) => (
            <Link
              key={r.id}
              href={`/signup?role=${r.id}`}
              className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
            >
              <div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <r.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-primary">
                Continue as {r.title} <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-foreground hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

const ROLES = [
  {
    id: 'patient',
    title: 'Patient',
    icon: User,
    description: 'Book doctor appointments, check symptoms with AI, order medicines, and view lab reports.',
  },
  {
    id: 'doctor',
    title: 'Doctor',
    icon: Stethoscope,
    description: 'Offer online consultations, manage appointment slots, write prescriptions, and build your practice.',
  },
  {
    id: 'pharmacy',
    title: 'Pharmacy',
    icon: Building2,
    description: 'List medicine inventory, process prescription orders, and manage doorstep medicine delivery.',
  },
  {
    id: 'lab',
    title: 'Diagnostic Lab',
    icon: FlaskConical,
    description: 'Offer lab tests, schedule sample collections, and upload digital patient test reports.',
  },
]
