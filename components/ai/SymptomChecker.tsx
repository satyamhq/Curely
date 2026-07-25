'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, ArrowRight, Brain, CheckCircle2, Loader2, Sparkles, Stethoscope, Star } from 'lucide-react'
import { DoctorCard } from '@/components/shared/DoctorCard'

export function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('')
  const [age, setAge] = useState('30')
  const [gender, setGender] = useState('Male')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [matchedDoctors, setMatchedDoctors] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!symptoms.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)
    setMatchedDoctors([])

    try {
      // 1. Call symptom-check AI API
      const res = await fetch('/api/ai/symptom-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, patientAge: age, patientGender: gender }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to analyze symptoms.')
      }

      setResult(data)

      // 2. Fetch ranked doctors based on AI recommended speciality
      if (data.recommendedSpeciality) {
        const docRes = await fetch('/api/ai/doctor-match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ speciality: data.recommendedSpeciality }),
        })
        const docData = await docRes.json()
        if (docData.doctors) {
          setMatchedDoctors(docData.doctors)
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong during symptom analysis.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Interactive Input Form */}
      <form onSubmit={handleCheck} className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Describe your health concerns</h2>
            <p className="text-xs text-muted-foreground">Antigravity AI Triage Engine — Confidential & Secure</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            What symptoms are you experiencing?
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={4}
            placeholder="e.g., I have had a persistent dry cough, mild shortness of breath when walking up stairs, and low fever of 100°F for 2 days..."
            className="w-full rounded-2xl border border-input bg-background p-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !symptoms.trim()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Evaluating Symptoms & Matching Doctors...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Run AI Health Analysis
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-destructive text-sm flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Triage & Doctor Recommendation Results */}
      {result && (
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-bold">AI Triage & Recommendation Analysis</h3>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                result.urgencyLevel === 'emergency'
                  ? 'bg-destructive text-destructive-foreground'
                  : result.urgencyLevel === 'urgent'
                  ? 'bg-amber-500/10 text-amber-600'
                  : 'bg-emerald-500/10 text-emerald-600'
              }`}
            >
              Urgency: {result.urgencyLevel}
            </span>
          </div>

          {/* Rationale explanation */}
          {result.rationale && (
            <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 block">
                AI Recommendation Rationale
              </span>
              <p className="text-xs text-foreground font-medium leading-relaxed">{result.rationale}</p>
            </div>
          )}

          {/* Recommended Speciality */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Stethoscope className="h-6 w-6 text-primary" />
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Recommended Speciality</span>
                <span className="text-base font-bold text-foreground">{result.recommendedSpeciality}</span>
              </div>
            </div>
            <Link
              href={`/doctors?speciality=${encodeURIComponent(result.recommendedSpeciality)}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
            >
              Browse All Specialists <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Possible Conditions */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Possible Conditions Assessed</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {result.possibleConditions?.map((cond: any, idx: number) => (
                <div key={idx} className="rounded-xl border border-border p-4 space-y-1 bg-background">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-foreground">{cond.name}</span>
                    <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded bg-muted">
                      {cond.probability} Match
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{cond.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Medical Disclaimer Requirement */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{result.disclaimer}</p>
          </div>

          {/* Explainable Ranked Doctor List */}
          {matchedDoctors.length > 0 && (
            <div className="space-y-4 border-t border-border pt-6">
              <h4 className="text-sm font-bold">Top Ranked Doctor Matches for {result.recommendedSpeciality}</h4>
              <div className="grid gap-6 sm:grid-cols-2">
                {matchedDoctors.map((doc) => (
                  <div key={doc.id} className="space-y-2">
                    {doc.whyRecommended && (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-600 border border-emerald-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{doc.whyRecommended}</span>
                      </div>
                    )}
                    <DoctorCard doctor={doc} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
