'use client'

import { useEffect, useState } from 'react'
import { PatientLayoutShell } from '@/components/layout/PatientLayoutShell'
import { FileText, Plus, ShieldCheck, Upload, Trash2, Loader2, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

export default function HealthRecordsPage() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [type, setType] = useState('Prescription')
  const [file, setFile] = useState<File | null>(null)

  async function fetchHealthRecords() {
    try {
      setLoading(true)
      setError(null)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error: fetchErr } = await supabase
        .from('health_records')
        .select('*')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchErr) throw fetchErr
      setRecords(data || [])
    } catch (err: any) {
      console.error('Error fetching health records:', err)
      setError(err.message || 'Failed to load health records.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealthRecords()
  }, [])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return

    try {
      setSubmitting(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Please log in to upload health records.')
        return
      }

      // Record insertion in database
      const { error: insertErr } = await (supabase.from('health_records') as any)
        .insert({
          patient_id: user.id,
          title,
          type,
          file_url: 'health_document.pdf',
          uploaded_by: 'Self Uploaded',
        })

      if (insertErr) throw insertErr

      setTitle('')
      setFile(null)
      fetchHealthRecords()
    } catch (err: any) {
      console.error('Error uploading health record:', err)
      alert(err.message || 'Failed to save health record.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient()
      const { error: delErr } = await supabase
        .from('health_records')
        .delete()
        .eq('id', id)

      if (delErr) throw delErr
      setRecords((prev) => prev.filter((r) => r.id !== id))
    } catch (err: any) {
      console.error('Error deleting record:', err)
      alert(err.message || 'Failed to delete record.')
    }
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
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Save Record to Locker
          </button>
        </form>

        {/* Health Records List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3 rounded-2xl border border-border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Loading medical locker...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-6 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-semibold">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : records.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground space-y-2">
            <p>No health records uploaded yet.</p>
            <p className="text-xs text-muted-foreground">Use the form above to upload prescriptions, lab reports, or vaccination cards.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{r.title}</h3>
                    <p className="text-xs text-muted-foreground">{r.type} • Uploaded by {r.uploaded_by || 'Self Uploaded'}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{formatDate(r.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PatientLayoutShell>
  )
}

