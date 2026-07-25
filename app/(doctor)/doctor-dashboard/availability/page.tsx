'use client'

import { useState } from 'react'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { Activity, Clock, Plus, Trash2 } from 'lucide-react'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function DoctorAvailabilityPage() {
  const [slots, setSlots] = useState([
    { day: 1, start: '09:00', end: '13:00' },
    { day: 1, start: '16:00', end: '20:00' },
    { day: 2, start: '09:00', end: '13:00' },
    { day: 3, start: '09:00', end: '13:00' },
    { day: 4, start: '09:00', end: '13:00' },
    { day: 5, start: '09:00', end: '13:00' },
  ])

  const [newDay, setNewDay] = useState(1)
  const [newStart, setNewStart] = useState('09:00')
  const [newEnd, setNewEnd] = useState('13:00')

  const handleAddSlot = () => {
    setSlots([...slots, { day: newDay, start: newStart, end: newEnd }])
  }

  const handleRemoveSlot = (idx: number) => {
    setSlots(slots.filter((_, i) => i !== idx))
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

        {/* Add Slot Control */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm">Add Consultation Time Window</h3>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Day</label>
              <select
                value={newDay}
                onChange={(e) => setNewDay(Number(e.target.value))}
                className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs"
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
                className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">End Time</label>
              <input
                type="time"
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
                className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddSlot}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2 px-3 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" /> Add Window
              </button>
            </div>
          </div>
        </div>

        {/* Existing Schedule */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm">Active Weekly Schedule</h3>
          <div className="divide-y divide-border">
            {slots.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-foreground w-24">{DAYS[s.day]}</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{s.start} — {s.end}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveSlot(idx)}
                  className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProviderLayoutShell>
  )
}
