import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { SymptomChecker } from '@/components/ai/SymptomChecker'
import { AIChatWidget } from '@/components/ai/AIChatWidget'
import { Brain } from 'lucide-react'

export default function SymptomCheckerPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Brain className="h-3.5 w-3.5 text-purple-600" />
            AI-Powered Clinical Triage
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Symptom Checker & Doctor Match
          </h1>
          <p className="text-sm text-muted-foreground">
            Describe your health concerns in plain language. Our AI evaluates your symptoms, identifies potential conditions, and recommends verified doctors.
          </p>
        </div>

        <SymptomChecker />
      </main>

      <AIChatWidget />
      <Footer />
      <MobileNav />
    </div>
  )
}
