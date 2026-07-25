'use client'

import { useEffect, useState } from 'react'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { Building2, Plus, Search, Trash2, Loader2, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

export default function PharmacyInventoryPage() {
  const [medicines, setMedicines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pharmacyId, setPharmacyId] = useState<string | null>(null)

  const [showAddForm, setShowAddForm] = useState(false)
  const [newMed, setNewMed] = useState({
    name: '',
    price: 50,
    stock: 100,
    requires_prescription: false,
    description: '',
  })

  async function loadInventory() {
    try {
      setLoading(true)
      setError(null)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data: pharmRecord, error: pharmErr } = await supabase
        .from('pharmacies')
        .select('id')
        .eq('profile_id', user.id)
        .maybeSingle()

      if (pharmErr) throw pharmErr
      if (!pharmRecord) {
        setMedicines([])
        setLoading(false)
        return
      }

      setPharmacyId((pharmRecord as any).id)

      const { data: medData, error: medErr } = await supabase
        .from('medicines')
        .select('*')
        .eq('pharmacy_id', (pharmRecord as any).id)
        .order('created_at', { ascending: false })

      if (medErr) throw medErr
      setMedicines(medData || [])
    } catch (err: any) {
      console.error('Error loading inventory:', err)
      setError(err.message || 'Failed to load medicine inventory.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInventory()
  }, [])

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMed.name || !pharmacyId) return

    try {
      setSubmitting(true)
      const supabase = createClient()
      const { error: insertErr } = await (supabase.from('medicines') as any)
        .insert({
          pharmacy_id: pharmacyId,
          name: newMed.name,
          price: newMed.price,
          stock: newMed.stock,
          requires_prescription: newMed.requires_prescription,
          description: newMed.description || null,
        })

      if (insertErr) throw insertErr

      setNewMed({ name: '', price: 50, stock: 100, requires_prescription: false, description: '' })
      setShowAddForm(false)
      loadInventory()
    } catch (err: any) {
      console.error('Error adding medicine:', err)
      alert(err.message || 'Failed to add medicine to inventory.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient()
      const { error: delErr } = await supabase
        .from('medicines')
        .delete()
        .eq('id', id)

      if (delErr) throw delErr
      setMedicines((prev) => prev.filter((m) => m.id !== id))
    } catch (err: any) {
      console.error('Error deleting medicine:', err)
      alert(err.message || 'Failed to delete medicine item.')
    }
  }

  return (
    <ProviderLayoutShell role="pharmacy">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Medicine Inventory</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage stock levels, prices, and prescription rules for your pharmacy catalog
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Add Medicine
          </button>
        </div>

        {/* Add Medicine Form Modal/Box */}
        {showAddForm && (
          <form onSubmit={handleAddMedicine} className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base">Add New Medicine to Store</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Medicine Name</label>
                <input
                  type="text"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  placeholder="e.g. Cetirizine 10mg"
                  className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={newMed.price}
                  onChange={(e) => setNewMed({ ...newMed, price: Number(e.target.value) })}
                  className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Stock Count</label>
                <input
                  type="number"
                  value={newMed.stock}
                  onChange={(e) => setNewMed({ ...newMed, stock: Number(e.target.value) })}
                  className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="rx"
                  checked={newMed.requires_prescription}
                  onChange={(e) => setNewMed({ ...newMed, requires_prescription: e.target.checked })}
                  className="rounded border-input text-primary focus:ring-primary"
                />
                <label htmlFor="rx" className="text-xs font-medium text-foreground">
                  Requires Doctor Prescription
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Save Medicine
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3 rounded-2xl border border-border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-sm font-medium text-muted-foreground">Loading pharmacy inventory...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-6 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-semibold">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : medicines.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            No medicine products listed in your store inventory yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {medicines.map((med) => (
              <div key={med.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-sm text-foreground">{med.name}</h3>
                    {med.requires_prescription && (
                      <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                        Rx Required
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{med.description || 'No description provided.'}</p>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Stock: {med.stock} units</span>
                    <span className="font-bold text-foreground">{formatCurrency(med.price)}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(med.id)}
                    className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete Medicine"
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

