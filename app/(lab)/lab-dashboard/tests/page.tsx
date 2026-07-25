'use client'

import { useEffect, useState } from 'react'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { FlaskConical, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

export default function LabTestsPage() {
  const [tests, setTests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [labId, setLabId] = useState<string | null>(null)

  const [showAdd, setShowAdd] = useState(false)
  const [newTest, setNewTest] = useState({
    name: '',
    price: 500,
    sample_type: 'Blood',
    turnaround_hours: 24,
    description: '',
  })

  async function loadLabTestsCatalog() {
    try {
      setLoading(true)
      setError(null)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data: labRecord, error: labErr } = await supabase
        .from('labs')
        .select('id')
        .eq('profile_id', user.id)
        .maybeSingle()

      if (labErr) throw labErr
      if (!labRecord) {
        setTests([])
        setLoading(false)
        return
      }

      setLabId((labRecord as any).id)

      const { data, error: testErr } = await supabase
        .from('lab_tests')
        .select('*')
        .eq('lab_id', (labRecord as any).id)
        .order('created_at', { ascending: false })

      if (testErr) throw testErr
      setTests(data || [])
    } catch (err: any) {
      console.error('Error loading lab tests:', err)
      setError(err.message || 'Failed to load diagnostic test catalog.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLabTestsCatalog()
  }, [])

  const handleAddTest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTest.name || !labId) return

    try {
      setSubmitting(true)
      const supabase = createClient()
      const { error: insertErr } = await (supabase.from('lab_tests') as any)
        .insert({
          lab_id: labId,
          name: newTest.name,
          price: newTest.price,
          sample_type: newTest.sample_type,
          turnaround_hours: newTest.turnaround_hours,
          description: newTest.description || null,
        })

      if (insertErr) throw insertErr

      setNewTest({ name: '', price: 500, sample_type: 'Blood', turnaround_hours: 24, description: '' })
      setShowAdd(false)
      loadLabTestsCatalog()
    } catch (err: any) {
      console.error('Error adding lab test:', err)
      alert(err.message || 'Failed to add test to catalog.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient()
      const { error: delErr } = await supabase
        .from('lab_tests')
        .delete()
        .eq('id', id)

      if (delErr) throw delErr
      setTests((prev) => prev.filter((t) => t.id !== id))
    } catch (err: any) {
      console.error('Error deleting lab test:', err)
      alert(err.message || 'Failed to delete test.')
    }
  }

  return (
    <ProviderLayoutShell role="lab">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Diagnostic Test Catalog</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Configure health test packages, turnaround hours, and pricing offered by your lab
            </p>
          </div>

          <button
            onClick={() => setShowAdd(!showAdd)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Add Test Offering
          </button>
        </div>

        {showAdd && (
          <form onSubmit={handleAddTest} className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base">Add New Diagnostic Test</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Test Name</label>
                <input
                  type="text"
                  value={newTest.name}
                  onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                  placeholder="e.g. Lipid Profile Heart Check"
                  className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={newTest.price}
                  onChange={(e) => setNewTest({ ...newTest, price: Number(e.target.value) })}
                  className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Sample Type</label>
                <select
                  value={newTest.sample_type}
                  onChange={(e) => setNewTest({ ...newTest, sample_type: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Blood">Blood</option>
                  <option value="Urine">Urine</option>
                  <option value="Swab">Swab</option>
                  <option value="Stool">Stool</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Turnaround Hours</label>
                <input
                  type="number"
                  value={newTest.turnaround_hours}
                  onChange={(e) => setNewTest({ ...newTest, turnaround_hours: Number(e.target.value) })}
                  className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Save Test
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3 rounded-2xl border border-border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-muted-foreground">Loading test catalog...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-6 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-semibold">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : tests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            No diagnostic tests offered by your lab center yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {tests.map((test) => (
              <div key={test.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-sm text-foreground">{test.name}</h3>
                    <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                      {test.sample_type || 'Blood'}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{test.description || 'Comprehensive test.'}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Turnaround: {test.turnaround_hours || 24} hours</p>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
                  <span className="font-bold text-foreground">{formatCurrency(test.price)}</span>
                  <button
                    onClick={() => handleDelete(test.id)}
                    className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete Test"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProviderLayoutShell>
  )
}

