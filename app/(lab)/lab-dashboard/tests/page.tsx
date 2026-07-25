'use client'

import { useState } from 'react'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { FlaskConical, Plus, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const MOCK_TESTS = [
  {
    id: 'test-1',
    name: 'Complete Blood Count (CBC)',
    price: 350,
    sample_type: 'Blood',
    turnaround_hours: 12,
    description: 'Evaluates overall health and detects infection or anemia.',
  },
  {
    id: 'test-2',
    name: 'Thyroid Profile Total (T3, T4, TSH)',
    price: 650,
    sample_type: 'Blood',
    turnaround_hours: 24,
    description: 'Assesses thyroid gland function and metabolic health.',
  },
]

export default function LabTestsPage() {
  const [tests, setTests] = useState(MOCK_TESTS)
  const [showAdd, setShowAdd] = useState(false)
  const [newTest, setNewTest] = useState({
    name: '',
    price: 500,
    sample_type: 'Blood',
    turnaround_hours: 24,
    description: '',
  })

  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTest.name) return

    setTests([...tests, { id: `test-${Date.now()}`, ...newTest }])
    setNewTest({ name: '', price: 500, sample_type: 'Blood', turnaround_hours: 24, description: '' })
    setShowAdd(false)
  }

  const handleDelete = (id: string) => {
    setTests(tests.filter((t) => t.id !== id))
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
                className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
              >
                Save Test
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {tests.map((test) => (
            <div key={test.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-sm text-foreground">{test.name}</h3>
                  <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                    {test.sample_type}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{test.description}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Turnaround: {test.turnaround_hours} hours</p>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
                <span className="font-bold text-foreground">{formatCurrency(test.price)}</span>
                <button
                  onClick={() => handleDelete(test.id)}
                  className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProviderLayoutShell>
  )
}
