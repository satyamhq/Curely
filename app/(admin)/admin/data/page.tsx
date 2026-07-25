'use client'

import { useEffect, useState } from 'react'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { createClient } from '@/utils/supabase/client'
import {
  Database,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  ShieldCheck,
  FileText,
  Stethoscope,
  Pill,
  TestTube,
  Calendar,
  ShoppingBag,
  Star,
  Activity,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function AdminDataCrudPage() {
  const [activeTab, setActiveTab] = useState<
    'doctors' | 'medicines' | 'lab_tests' | 'appointments' | 'orders' | 'reviews' | 'audit_logs'
  >('doctors')

  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [items, setItems] = useState<any[]>([])

  // Modal State for Edits / Creation
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  async function loadTabData() {
    try {
      setLoading(true)
      setErrorMsg(null)

      if (activeTab === 'doctors') {
        const { data, error } = await supabase
          .from('doctors')
          .select('*, profiles(full_name, city)')
          .order('created_at', { ascending: false })
        if (error) throw error
        setItems(data || [])
      } else if (activeTab === 'medicines') {
        const { data, error } = await supabase
          .from('medicines')
          .select('*, pharmacies(name)')
          .order('created_at', { ascending: false })
        if (error) throw error
        setItems(data || [])
      } else if (activeTab === 'lab_tests') {
        const { data, error } = await supabase
          .from('lab_tests')
          .select('*, labs(name)')
          .order('created_at', { ascending: false })
        if (error) throw error
        setItems(data || [])
      } else if (activeTab === 'appointments') {
        const { data, error } = await supabase
          .from('appointments')
          .select('*, doctors(speciality, profiles(full_name)), profiles!patient_id(full_name)')
          .order('created_at', { ascending: false })
        if (error) throw error
        setItems(data || [])
      } else if (activeTab === 'orders') {
        const { data, error } = await supabase
          .from('orders')
          .select('*, pharmacies(name), profiles!patient_id(full_name)')
          .order('created_at', { ascending: false })
        if (error) throw error
        setItems(data || [])
      } else if (activeTab === 'reviews') {
        const { data, error } = await supabase
          .from('reviews')
          .select('*, profiles!reviewer_id(full_name)')
          .order('created_at', { ascending: false })
        if (error) throw error
        setItems(data || [])
      } else if (activeTab === 'audit_logs') {
        const { data, error } = await supabase
          .from('admin_actions')
          .select('*, profiles!admin_id(full_name)')
          .order('created_at', { ascending: false })
        if (error) throw error
        setItems(data || [])
      }
    } catch (err: any) {
      console.error('Error loading admin CRUD tab:', err)
      setErrorMsg(err.message || 'Failed to load entity records.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTabData()
  }, [activeTab])

  // Log admin action
  const logAudit = async (action: string, target_entity: string, target_id: string, details: any) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        await (supabase.from('admin_actions') as any).insert({
          admin_id: user.id,
          action,
          target_entity,
          target_id,
          details,
        })
      }
    } catch (err) {
      console.error('Audit log record error:', err)
    }
  }

  // Delete Action
  const handleDelete = async (id: string, entityTable: string, titleName: string) => {
    if (!confirm(`Are you sure you want to delete "${titleName}"? This action persists in Postgres.`)) return

    try {
      setSaving(true)
      const { error } = await supabase.from(entityTable as any).delete().eq('id', id)
      if (error) throw error

      await logAudit('delete', entityTable, id, { titleName, deletedAt: new Date().toISOString() })
      setItems((prev) => prev.filter((i) => i.id !== id))
    } catch (err: any) {
      alert(err.message || 'Failed to delete record.')
    } finally {
      setSaving(false)
    }
  }

  // Toggle Doctor Verification
  const toggleDoctorVerify = async (doc: any) => {
    try {
      const newStatus = !doc.verified
      const { error } = await (supabase.from('doctors') as any)
        .update({ verified: newStatus })
        .eq('id', doc.id)

      if (error) throw error

      await logAudit('update_verification', 'doctors', doc.id, {
        verified: newStatus,
        name: doc.profiles?.full_name,
      })

      setItems((prev) => prev.map((d) => (d.id === doc.id ? { ...d, verified: newStatus } : d)))
    } catch (err: any) {
      alert(err.message || 'Failed to update verification status.')
    }
  }

  // Save Modal Edit
  const handleSaveEdit = async () => {
    if (!editingItem) return
    try {
      setSaving(true)

      if (activeTab === 'doctors') {
        const { error } = await (supabase.from('doctors') as any)
          .update({
            speciality: editingItem.speciality,
            fee: Number(editingItem.fee),
            experience_years: Number(editingItem.experience_years),
            bio: editingItem.bio,
          })
          .eq('id', editingItem.id)
        if (error) throw error
        await logAudit('update', 'doctors', editingItem.id, editingItem)
      } else if (activeTab === 'medicines') {
        const { error } = await (supabase.from('medicines') as any)
          .update({
            name: editingItem.name,
            price: Number(editingItem.price),
            stock: Number(editingItem.stock),
            requires_prescription: Boolean(editingItem.requires_prescription),
          })
          .eq('id', editingItem.id)
        if (error) throw error
        await logAudit('update', 'medicines', editingItem.id, editingItem)
      } else if (activeTab === 'lab_tests') {
        const { error } = await (supabase.from('lab_tests') as any)
          .update({
            name: editingItem.name,
            price: Number(editingItem.price),
            sample_type: editingItem.sample_type,
            turnaround_hours: Number(editingItem.turnaround_hours),
          })
          .eq('id', editingItem.id)
        if (error) throw error
        await logAudit('update', 'lab_tests', editingItem.id, editingItem)
      } else if (activeTab === 'appointments') {
        const { error } = await (supabase.from('appointments') as any)
          .update({ status: editingItem.status })
          .eq('id', editingItem.id)
        if (error) throw error
        await logAudit('update_status', 'appointments', editingItem.id, { status: editingItem.status })
      } else if (activeTab === 'orders') {
        const { error } = await (supabase.from('orders') as any)
          .update({ status: editingItem.status })
          .eq('id', editingItem.id)
        if (error) throw error
        await logAudit('update_status', 'orders', editingItem.id, { status: editingItem.status })
      }

      setEditingItem(null)
      loadTabData()
    } catch (err: any) {
      alert(err.message || 'Failed to save edits.')
    } finally {
      setSaving(false)
    }
  }

  const filteredItems = items.filter((item) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    const jsonStr = JSON.stringify(item).toLowerCase()
    return jsonStr.includes(q)
  })

  return (
    <ProviderLayoutShell role="admin">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Full Entity CRUD Governance</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, Read, Update, and Delete entity records with full audit trail logging
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === 'doctors'
                ? 'bg-primary text-primary-foreground shadow'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            <Stethoscope className="h-4 w-4" /> Doctors
          </button>
          <button
            onClick={() => setActiveTab('medicines')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === 'medicines'
                ? 'bg-primary text-primary-foreground shadow'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            <Pill className="h-4 w-4" /> Medicines
          </button>
          <button
            onClick={() => setActiveTab('lab_tests')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === 'lab_tests'
                ? 'bg-primary text-primary-foreground shadow'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            <TestTube className="h-4 w-4" /> Lab Tests
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === 'appointments'
                ? 'bg-primary text-primary-foreground shadow'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            <Calendar className="h-4 w-4" /> Appointments
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === 'orders'
                ? 'bg-primary text-primary-foreground shadow'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            <ShoppingBag className="h-4 w-4" /> Orders
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === 'reviews'
                ? 'bg-primary text-primary-foreground shadow'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            <Star className="h-4 w-4" /> Reviews
          </button>
          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === 'audit_logs'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
            }`}
          >
            <Activity className="h-4 w-4" /> Audit Logs
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search ${activeTab.replace('_', ' ')} by keyword...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-input bg-card py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs font-medium text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Content Table / Cards */}
        {loading ? (
          <div className="py-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading records from database...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-12 text-center rounded-2xl border border-dashed border-border bg-card p-8 text-xs text-muted-foreground">
            No records found for active category.
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden divide-y divide-border">
            {activeTab === 'doctors' &&
              filteredItems.map((doc) => (
                <div key={doc.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">{doc.profiles?.full_name || 'Doctor'}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          doc.verified ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                        }`}
                      >
                        {doc.verified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Speciality: <span className="font-medium text-foreground">{doc.speciality}</span> • Fee:{' '}
                      <span className="font-medium text-foreground">{formatCurrency(doc.fee)}</span> • Exp:{' '}
                      <span className="font-medium text-foreground">{doc.experience_years} yrs</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleDoctorVerify(doc)}
                      className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold ${
                        doc.verified
                          ? 'border border-border bg-background text-muted-foreground hover:bg-muted'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      <ShieldCheck className="h-3.5 w-3.5" /> {doc.verified ? 'Unverify' : 'Verify'}
                    </button>
                    <button
                      onClick={() => setEditingItem(doc)}
                      className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      disabled={saving}
                      onClick={() => handleDelete(doc.id, 'doctors', doc.profiles?.full_name || 'Doctor')}
                      className="inline-flex items-center gap-1 rounded-xl bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}

            {activeTab === 'medicines' &&
              filteredItems.map((med) => (
                <div key={med.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">{med.name}</span>
                      {med.requires_prescription && (
                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                          Rx Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Pharmacy: <span className="font-medium text-foreground">{med.pharmacies?.name}</span> • Price:{' '}
                      <span className="font-medium text-foreground">{formatCurrency(med.price)}</span> • Stock:{' '}
                      <span className="font-medium text-foreground">{med.stock}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingItem(med)}
                      className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      disabled={saving}
                      onClick={() => handleDelete(med.id, 'medicines', med.name)}
                      className="inline-flex items-center gap-1 rounded-xl bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}

            {activeTab === 'lab_tests' &&
              filteredItems.map((t) => (
                <div key={t.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-foreground text-sm">{t.name}</span>
                    <p className="text-xs text-muted-foreground">
                      Lab: <span className="font-medium text-foreground">{t.labs?.name}</span> • Price:{' '}
                      <span className="font-medium text-foreground">{formatCurrency(t.price)}</span> • Sample:{' '}
                      <span className="font-medium text-foreground">{t.sample_type}</span> • Turnaround:{' '}
                      <span className="font-medium text-foreground">{t.turnaround_hours}h</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingItem(t)}
                      className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      disabled={saving}
                      onClick={() => handleDelete(t.id, 'lab_tests', t.name)}
                      className="inline-flex items-center gap-1 rounded-xl bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}

            {activeTab === 'appointments' &&
              filteredItems.map((apt) => (
                <div key={apt.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">
                        Patient: {apt.profiles?.full_name || 'Patient'} ➔ Doctor: {apt.doctors?.profiles?.full_name || 'Doctor'}
                      </span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary capitalize">
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Amount: <span className="font-medium text-foreground">{formatCurrency(apt.amount)}</span> • Mode:{' '}
                      <span className="font-medium text-foreground capitalize">{apt.mode}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingItem(apt)}
                      className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Update Status
                    </button>
                    <button
                      disabled={saving}
                      onClick={() => handleDelete(apt.id, 'appointments', `Appointment #${apt.id.slice(0, 6)}`)}
                      className="inline-flex items-center gap-1 rounded-xl bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}

            {activeTab === 'orders' &&
              filteredItems.map((ord) => (
                <div key={ord.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">
                        Order #{ord.id.slice(0, 8)} • Patient: {ord.profiles?.full_name || 'Patient'}
                      </span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary capitalize">
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Pharmacy: <span className="font-medium text-foreground">{ord.pharmacies?.name}</span> • Total:{' '}
                      <span className="font-medium text-foreground">{formatCurrency(ord.total)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingItem(ord)}
                      className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Update Status
                    </button>
                    <button
                      disabled={saving}
                      onClick={() => handleDelete(ord.id, 'orders', `Order #${ord.id.slice(0, 8)}`)}
                      className="inline-flex items-center gap-1 rounded-xl bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}

            {activeTab === 'reviews' &&
              filteredItems.map((rev) => (
                <div key={rev.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">{rev.profiles?.full_name || 'Reviewer'}</span>
                      <span className="text-xs font-bold text-amber-500">★ {rev.rating}/5</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold capitalize">
                        {rev.target_type}
                      </span>
                    </div>
                    <p className="text-xs text-foreground italic">"{rev.comment}"</p>
                  </div>
                  <button
                    disabled={saving}
                    onClick={() => handleDelete(rev.id, 'reviews', `Review by ${rev.profiles?.full_name}`)}
                    className="inline-flex items-center gap-1 rounded-xl bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete Review
                  </button>
                </div>
              ))}

            {activeTab === 'audit_logs' &&
              filteredItems.map((log) => (
                <div key={log.id} className="p-4 sm:p-6 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-xs uppercase tracking-wider">{log.action}</span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 capitalize">
                        {log.target_entity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Admin: <span className="font-medium text-foreground">{log.profiles?.full_name || log.admin_id}</span> •
                      Details: {JSON.stringify(log.details)}
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{new Date(log.created_at).toLocaleString()}</span>
                </div>
              ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <h3 className="font-bold text-base text-foreground capitalize">Edit {activeTab.replace('_', ' ')} Record</h3>

              {activeTab === 'doctors' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-muted-foreground mb-1">Speciality</label>
                    <input
                      type="text"
                      value={editingItem.speciality || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, speciality: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1">Fee (₹)</label>
                    <input
                      type="number"
                      value={editingItem.fee || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, fee: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1">Experience Years</label>
                    <input
                      type="number"
                      value={editingItem.experience_years || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, experience_years: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background p-2.5"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'medicines' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-muted-foreground mb-1">Medicine Name</label>
                    <input
                      type="text"
                      value={editingItem.name || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={editingItem.price || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1">Stock</label>
                    <input
                      type="number"
                      value={editingItem.stock || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, stock: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background p-2.5"
                    />
                  </div>
                </div>
              )}

              {(activeTab === 'appointments' || activeTab === 'orders') && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-muted-foreground mb-1">Status</label>
                    <select
                      value={editingItem.status || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background p-2.5"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveEdit}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProviderLayoutShell>
  )
}
