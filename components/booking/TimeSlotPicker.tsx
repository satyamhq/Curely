'use client'

import { Clock } from 'lucide-react'

interface TimeSlotPickerProps {
  slots: string[]
  selectedSlot: string | null
  onSelectSlot: (slot: string) => void
}

export function TimeSlotPicker({ slots, selectedSlot, onSelectSlot }: TimeSlotPickerProps) {
  const defaultSlots = slots.length > 0 ? slots : [
    '09:00 AM',
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '06:30 PM',
  ]

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" /> Select Time Slot
      </label>
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
        {defaultSlots.map((slot) => {
          const isSelected = selectedSlot === slot
          return (
            <button
              key={slot}
              type="button"
              onClick={() => onSelectSlot(slot)}
              className={`rounded-xl border py-2.5 px-3 text-xs font-medium transition-colors ${
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'border-border bg-card text-foreground hover:bg-muted'
              }`}
            >
              {slot}
            </button>
          )
        })}
      </div>
    </div>
  )
}
