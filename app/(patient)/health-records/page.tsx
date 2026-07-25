'use client'

import { useState } from 'react'
import { PatientLayoutShell } from '@/components/layout/PatientLayoutShell'
import { FileText, Plus, ShieldCheck, Upload, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const MOCK_HEALTH_RECORDS = [
  {
    id: 'hr-1',
    title: 'General Blood Panel & HbA1c Report',
    type: 'Lab Report',
    uploaded_by: 'Metropolis Diagnostics',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    file_url: '#',
  },
  {
    id: 'hr-2',
    title: 'Dr. Rajesh Sharma Consultation Prescription',
    type: 'Prescription',
    uploaded_by: 'Dr. Rajesh Sharma',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    file_url: '#',
  },
]

export default function HealthRecordsPage() {
  const [records, setRecords] = useState(MOCK_HEALTH_RECORDS)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('Prescription')
  const [file, setFile] = useState<File | null>(null)

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !file) return

    setRecords([
      {
        id: `hr-${Date.now()}`,
        title,
        type,
        uploaded_by: 'Self Uploaded',
        created_at: new Date().toISOString(),
        file_url: '#',
      },
      ...records,
    ])

    setTitle('')
    setFile(null)
  }

  const handleDelete = (id: string) => {
    setRecords(records.filter((r) => r.id !== id))
  }

  return (
    <PatientLayoutShell>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1 text-xs font-medium text-muted-foreground mb-1">
              <FileText className="h-3.5 w-3.5 text-primary" />
              Secure Medical Locker
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Personal Health Records</h1>
          </div>
        </div>

        {/* Upload Record Form */}
        <form onSubmit={handleUpload} className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base">Upload New Health Record</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Record Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chest X-Ray Scan"
                className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Prescription">Prescription</option>
                <option value="Lab Report">Lab Report</option>
                <option value="Scan / X-Ray">Scan / X-Ray</option>
                <option value="Vaccination">Vaccination</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Document File</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-muted-foreground file:mr-2 file:rounded-lg file:border-0 file:bg-primary file:py-1.5 file:px-3 file:text-xs file:font-semibold file:text-primary-foreground"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            <Upload className="h-4 w-4" /> Save Record to Locker
          </button>
        </form>

        {/* Health Records List */}
        <div className="space-y-4">
          {records.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">{r.title}</h3>
                  <p className="text-xs text-muted-foreground">{r.type} • Uploaded by {r.uploaded_by}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{formatDate(r.created_at)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDelete(r.id)}
                  className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PatientLayoutShell>
  )
}
