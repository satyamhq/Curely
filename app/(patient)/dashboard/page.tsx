import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { ArrowRight, Brain, Calendar, FileText, FlaskConical, HeartPulse, Pill, Search, ShieldCheck } from 'lucide-react'

export default function PatientDashboard() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 space-y-10">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 sm:p-10">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <HeartPulse className="h-3.5 w-3.5 text-primary" />
              Patient Health Portal
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome to your Health Hub
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Check symptoms with AI, book consultations with verified doctors, order prescriptions, and manage medical records seamlessly.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/symptom-checker"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                <Brain className="h-4 w-4" /> AI Symptom Checker
              </Link>
              <Link
                href="/doctors"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <Search className="h-4 w-4" /> Find Doctors
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ACTIONS.map((a) => (
              <Link
                key={a.title}
                href={a.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${a.bg} ${a.color}`}>
                    <a.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{a.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{a.desc}</p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-primary">
                  Explore <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Health Metrics & Status Section */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm md:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">Upcoming Appointments</h3>
              <Link href="/appointments" className="text-xs font-semibold text-primary hover:underline">View All</Link>
            </div>
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
              You have no upcoming appointments scheduled today.
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">Recent Reports</h3>
              <Link href="/health-records" className="text-xs font-semibold text-primary hover:underline">Manage</Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-border p-3 text-xs">
                <FileText className="h-4 w-4 text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">General Blood Panel</p>
                  <p className="text-[10px] text-muted-foreground">Uploaded 2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}

const ACTIONS = [
  {
    title: 'AI Symptom Checker',
    desc: 'Describe symptoms & get doctor matches',
    href: '/symptom-checker',
    icon: Brain,
    bg: 'bg-purple-500/10',
    color: 'text-purple-600',
  },
  {
    title: 'Book Consultations',
    desc: 'Top verified doctors online & in-person',
    href: '/doctors',
    icon: Calendar,
    bg: 'bg-blue-500/10',
    color: 'text-blue-600',
  },
  {
    title: 'Pharmacy Marketplace',
    desc: 'Order medicines with home delivery',
    href: '/pharmacy',
    icon: Pill,
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-600',
  },
  {
    title: 'Diagnostic Lab Tests',
    desc: 'Blood tests & home sample pickup',
    href: '/labs',
    icon: FlaskConical,
    bg: 'bg-amber-500/10',
    color: 'text-amber-600',
  },
]
