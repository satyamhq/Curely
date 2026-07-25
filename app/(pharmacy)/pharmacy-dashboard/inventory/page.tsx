'use client'

import { useState } from 'react'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { Building2, Plus, Search, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const MOCK_INVENTORY = [
  {
    id: 'med-1',
    name: 'Paracetamol 650mg (Dolo)',
    price: 32,
    stock: 150,
    requires_prescription: false,
    description: 'Fast acting fever and pain reliever tablets.',
  },
  {
    id: 'med-2',
    name: 'Amoxicillin 500mg Antibiotic',
    price: 110,
    stock: 80,
    requires_prescription: true,
    description: 'Prescription antibiotic capsule for bacterial infections.',
  },
]

export default function PharmacyInventoryPage() {
  const [medicines, setMedicines] = useState(MOCK_INVENTORY)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMed, setNewMed] = useState({
    name: '',
    price: 50,
    stock: 100,
    requires_prescription: false,
    description: '',
  })

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMed.name) return

    setMedicines([
      ...medicines,
      {
        id: `med-${Date.now()}`,
        ...newMed,
      },
    ])

    setNewMed({ name: '', price: 50, stock: 100, requires_prescription: false, description: '' })
    setShowAddForm(false)
  }

  const handleDelete = (id: string) => {
    setMedicines(medicines.filter((m) => m.id !== id))
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
                className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
              >
                Save Medicine
              </button>
            </div>
          </form>
        )}

        {/* Medicine Inventory Grid */}
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
