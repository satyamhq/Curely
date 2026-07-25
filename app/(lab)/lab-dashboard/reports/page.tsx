'use client'

import { useState } from 'react'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { CheckCircle2, FileText, Upload } from 'lucide-react'

export default function LabReportsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [patientName, setPatientName] = useState('')
  const [testName, setTestName] = useState('Complete Blood Count (CBC)')
  const [uploaded, setUploaded] = useState(false)

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !patientName) return

    setUploaded(true)
    setTimeout(() => {
      setUploaded(false)
      setSelectedFile(null)
      setPatientName('')
    }, 2000)
  }

  return (
    <ProviderLayoutShell role="lab">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Digital Report Upload</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload PDF diagnostic reports directly to patient health records
          </p>
        </div>

        {uploaded && (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> PDF Report uploaded and delivered to patient account!
          </div>
        )}

        <form onSubmit={handleUpload} className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Patient Name</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Amit Patel"
                className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Test Title</label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Select Report PDF</label>
              <div className="rounded-2xl border border-dashed border-border p-6 text-center space-y-2">
                <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="mx-auto block text-xs text-muted-foreground file:mr-4 file:rounded-xl file:border-0 file:bg-primary file:py-2 file:px-4 file:text-xs file:font-semibold file:text-primary-foreground"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            <Upload className="h-4 w-4" /> Upload Report PDF
          </button>
        </form>
      </div>
    </ProviderLayoutShell>
  )
}
