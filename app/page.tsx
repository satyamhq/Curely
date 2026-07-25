import Link from 'next/link'
import { ArrowRight, Brain, Calendar, FlaskConical, HeartPulse, Pill, Shield, Star, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Curely</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <Link href="/doctors" className="transition-colors hover:text-foreground">Doctors</Link>
            <Link href="/pharmacy" className="transition-colors hover:text-foreground">Pharmacy</Link>
            <Link href="/labs" className="transition-colors hover:text-foreground">Labs</Link>
            <Link href="/symptom-checker" className="transition-colors hover:text-foreground">Symptom&nbsp;Checker</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 sm:pb-32 sm:pt-28">
        {/* subtle grid bg */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:40px_40px]"
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Brain className="h-3.5 w-3.5" />
            AI-powered healthcare for India
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Your health, <span className="text-muted-foreground">simplified</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
            Describe your symptoms and let AI recommend the right specialist.
            Book appointments, consult online, order medicines, and manage your
            health records — all in one place.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/symptom-checker"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 sm:w-auto"
            >
              <Brain className="h-4 w-4" />
              Check my symptoms
            </Link>
            <Link
              href="/doctors"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:w-auto"
            >
              Browse doctors
            </Link>
          </div>
          {/* social proof */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            {[
              { icon: Users, label: '50,000+ patients' },
              { icon: Star, label: '4.9 avg rating' },
              { icon: Shield, label: 'Verified doctors' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon className="h-4 w-4" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section className="border-t border-border px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Everything you need, in one app</h2>
            <p className="mt-3 text-muted-foreground">From AI diagnosis to doorstep delivery.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:shadow-sm"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
                <Link
                  href={f.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline"
                >
                  {f.cta} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/40 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to take control of your health?</h2>
          <p className="mt-4 text-muted-foreground">
            Join thousands of patients and healthcare providers on Curely.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Create a free account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-border px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
              <HeartPulse className="h-3 w-3" />
            </div>
            <span className="font-medium text-foreground">Curely</span>
          </div>
          <p>© {new Date().getFullYear()} Curely. Built for India&apos;s healthcare.</p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-foreground">Login</Link>
            <Link href="/signup" className="hover:text-foreground">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Symptom Checker',
    description:
      'Describe how you feel in plain language. Our AI identifies likely conditions and recommends the right specialist.',
    href: '/symptom-checker',
    cta: 'Try it free',
  },
  {
    icon: Calendar,
    title: 'Doctor Booking',
    description:
      'Browse verified doctors by speciality, rating, and availability. Book online or in-person consultations instantly.',
    href: '/doctors',
    cta: 'Find a doctor',
  },
  {
    icon: Pill,
    title: 'Online Pharmacy',
    description:
      'Order medicines from licensed pharmacies near you. Upload your prescription and get doorstep delivery.',
    href: '/pharmacy',
    cta: 'Shop medicines',
  },
  {
    icon: FlaskConical,
    title: 'Diagnostic Labs',
    description:
      'Book blood tests, scans, and health packages from certified labs. Download reports directly in the app.',
    href: '/labs',
    cta: 'Book a test',
  },
  {
    icon: HeartPulse,
    title: 'Health Records',
    description:
      'Keep all your prescriptions, reports, and medical history in one secure, shareable place.',
    href: '/health-records',
    cta: 'Store records',
  },
  {
    icon: Shield,
    title: 'Verified Providers',
    description:
      'Every doctor, pharmacy, and lab on Curely is vetted and verified. Your health is in trusted hands.',
    href: '/doctors',
    cta: 'Learn more',
  },
]
