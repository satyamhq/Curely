'use client'

import { useState } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'

interface BookingCalendarProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

export function BookingCalendar({ selectedDate, onSelectDate }: BookingCalendarProps) {
  // Generate next 7 days for quick date selection
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d
  })

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Select Appointment Date
      </label>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {days.map((date) => {
          const isSelected = date.toDateString() === selectedDate.toDateString()
          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => onSelectDate(date)}
              className={`flex flex-col items-center justify-center rounded-xl p-3 text-xs transition-colors border ${
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'border-border bg-card text-foreground hover:bg-muted'
              }`}
            >
              <span className="text-[10px] uppercase opacity-75">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-base font-bold">{date.getDate()}</span>
              <span className="text-[9px]">
                {date.toLocaleDateString('en-US', { month: 'short' })}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
