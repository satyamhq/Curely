import Link from 'next/link'
import { HeartPulse } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold">Curely</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            AI-powered healthcare marketplace connecting patients with top doctors, pharmacies, and certified labs across India.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">For Patients</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><Link href="/symptom-checker" className="hover:text-foreground">AI Symptom Checker</Link></li>
            <li><Link href="/doctors" className="hover:text-foreground">Find Doctors</Link></li>
            <li><Link href="/pharmacy" className="hover:text-foreground">Order Medicines</Link></li>
            <li><Link href="/labs" className="hover:text-foreground">Book Lab Tests</Link></li>
            <li><Link href="/health-records" className="hover:text-foreground">Health Records</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">For Providers</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><Link href="/signup?role=doctor" className="hover:text-foreground">Join as a Doctor</Link></li>
            <li><Link href="/signup?role=pharmacy" className="hover:text-foreground">Partner Pharmacy</Link></li>
            <li><Link href="/signup?role=lab" className="hover:text-foreground">Partner Diagnostic Lab</Link></li>
            <li><Link href="/login" className="hover:text-foreground">Provider Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Legal & Safety</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><span className="hover:text-foreground">Privacy Policy</span></li>
            <li><span className="hover:text-foreground">Terms of Service</span></li>
            <li><span className="hover:text-foreground">Medical Disclaimer</span></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Curely Health Technologies. Disclaimer: AI recommendations do not constitute a formal medical diagnosis.
      </div>
    </footer>
  )
}
