import Link from 'next/link'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { ArrowLeft, Calendar, FileText, User } from 'lucide-react'

export default function DoctorPatientDetailPage({ params }: { params: { id: string } }) {
  const patient = {
    id: params.id,
    name: 'Amit Patel',
    age: 32,
    bloodGroup: 'O+',
    city: 'Mumbai',
    consultations: [
      {
        id: 'c1',
        date: new Date(Date.now() - 86400000 * 3).toISOString(),
        notes: 'Patient presented with mild fever (100°F) and dry cough. Prescribed Paracetamol 650mg & rest.',
        prescription: '1. Paracetamol 650mg — 1 tablet after meals (TID) x 3 days\n2. Warm saline gargles',
      },
    ],
  }

  return (
    <ProviderLayoutShell role="doctor">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/doctor-dashboard/patients"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to patient list
        </Link>

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-4 border-b border-border pb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-2xl">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{patient.name}</h1>
              <p className="text-xs text-muted-foreground">
                {patient.age} yrs • Blood Group: {patient.bloodGroup} • {patient.city}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-bold text-base">Consultation & Prescription History</h2>
            {patient.consultations.map((c) => (
              <div key={c.id} className="rounded-2xl border border-border bg-muted/40 p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="font-bold text-foreground">Consultation Notes</span>
                  <span className="text-muted-foreground">{new Date(c.date).toLocaleDateString()}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{c.notes}</p>
                <div className="rounded-xl border border-border bg-background p-3 space-y-1">
                  <span className="font-bold text-primary block">Prescription Issued</span>
                  <pre className="font-sans text-xs text-foreground whitespace-pre-wrap">{c.prescription}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProviderLayoutShell>
  )
}
