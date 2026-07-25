'use client'

import { useState, useEffect } from 'react'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { createClient } from '@/utils/supabase/client'
import { Clock, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface AvailabilitySlot {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
}

export default function DoctorAvailabilityPage() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [doctorId, setDoctorId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [newDay, setNewDay] = useState(1)
  const [newStart, setNewStart] = useState('09:00')
  const [newEnd, setNewEnd] = useState('17:00')

  const supabase = createClient()

  useEffect(() => {
    async function loadAvailability() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: doc } = await supabase
          .from('doctors')
          .select('id')
          .eq('profile_id', user.id)
          .single()

        const doctorObj = doc as { id: string } | null
        if (doctorObj) {
          setDoctorId(doctorObj.id)
          const { data: availData } = await supabase
            .from('doctor_availability')
            .select('*')
            .eq('doctor_id', doctorObj.id)
            .order('day_of_week', { ascending: true })

          if (availData) {
            setSlots(availData as AvailabilitySlot[])
          }
        }
      } catch (err: any) {
        console.error('Error loading doctor availability:', err)
        setErrorMsg('Failed to load availability from database')
      } finally {
        setLoading(false)
      }
    }

    loadAvailability()
  }, [])

  const handleAddSlot = async () => {
    if (!doctorId) {
      setErrorMsg('Doctor profile not found. Please complete your doctor profile first.')
      return
    }

    setSaving(true)
    setErrorMsg(null)

    try {
      const { data, error } = await (supabase.from('doctor_availability') as any)
        .insert({
          doctor_id: doctorId,
          day_of_week: newDay,
          start_time: newStart,
          end_time: newEnd,
        })
        .select()
        .single()

      if (error) {
        setErrorMsg(error.message)
      } else if (data) {
        setSlots([...slots, data as AvailabilitySlot])
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error adding availability window')
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveSlot = async (id: string) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('doctor_availability')
        .delete()
        .eq('id', id)

      if (!error) {
        setSlots(slots.filter((s) => s.id !== id))
      } else {
        setErrorMsg(error.message)
      }
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <ProviderLayoutShell role="doctor">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Availability Schedule</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure weekly consultation hours and time windows available for patient bookings
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs font-medium text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Add Slot Control */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm">Add Consultation Time Window</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Day</label>
              <select
                value={newDay}
                onChange={(e) => setNewDay(Number(e.target.value))}
                className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs font-medium"
              >
                {DAYS.map((d, i) => (
                  <option key={d} value={i}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Start Time</label>
              <input
                type="time"
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
                className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">End Time</label>
              <input
                type="time"
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
                className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs font-medium"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                disabled={saving || !doctorId}
                onClick={handleAddSlot}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 px-3 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Add Window
              </button>
            </div>
          </div>
        </div>

        {/* Active Schedule */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm">Active Weekly Schedule</h3>
          {loading ? (
            <div className="py-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading availability...
            </div>
          ) : slots.length === 0 ? (
            <div className="py-8 text-center rounded-xl border border-dashed border-border bg-muted/20 p-6 space-y-1">
              <p className="text-sm font-semibold text-foreground">No availability windows configured yet</p>
              <p className="text-xs text-muted-foreground">Add your consultation days and hours above to enable patient bookings.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {slots.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground w-28">{DAYS[s.day_of_week]}</span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{s.start_time.slice(0, 5)} — {s.end_time.slice(0, 5)}</span>
                    </div>
                  </div>
                  <button
                    disabled={saving}
                    onClick={() => handleRemoveSlot(s.id)}
                    className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProviderLayoutShell>
  )
}
