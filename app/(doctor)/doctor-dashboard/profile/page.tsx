'use client'

import { useState } from 'react'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { CheckCircle2, Loader2, Save, ShieldCheck, User } from 'lucide-react'
import { SPECIALITIES } from '@/lib/constants'

export default function DoctorProfilePage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    fullName: 'Dr. Rajesh Sharma',
    speciality: 'General Physician',
    experienceYears: 12,
    fee: 500,
    qualifications: 'MBBS, MD (Internal Medicine)',
    bio: 'Senior General Physician specializing in preventive health care, fever management, and lifestyle disorders.',
    city: 'Mumbai',
    licenseNo: 'MCI-2012-998877',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 600)
  }

  return (
    <ProviderLayoutShell role="doctor">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctor Profile & Verification</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your medical qualifications, consultation fee, bio, and license credentials
          </p>
        </div>

        {success && (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Profile updated successfully! Changes are live on Curely.
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Full Name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Speciality</label>
                <select
                  value={form.speciality}
                  onChange={(e) => setForm({ ...form, speciality: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {SPECIALITIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Consultation Fee (₹)</label>
                <input
                  type="number"
                  value={form.fee}
                  onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })}
                  className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Experience (Years)</label>
                <input
                  type="number"
                  value={form.experienceYears}
                  onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
                  className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Qualifications</label>
              <input
                type="text"
                value={form.qualifications}
                onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Medical Council License Number</label>
              <input
                type="text"
                value={form.licenseNo}
                onChange={(e) => setForm({ ...form, licenseNo: e.target.value })}
                className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Doctor Bio</label>
              <textarea
                rows={4}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full rounded-2xl border border-input bg-background p-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Profile
          </button>
        </form>
      </div>
    </ProviderLayoutShell>
  )
}
