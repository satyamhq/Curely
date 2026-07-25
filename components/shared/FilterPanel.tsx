'use client'

import { SPECIALITIES } from '@/lib/constants'

interface FilterPanelProps {
  selectedSpeciality: string
  onSelectSpeciality: (speciality: string) => void
  maxFee: number
  onMaxFeeChange: (fee: number) => void
  minExperience: number
  onMinExperienceChange: (exp: number) => void
}

export function FilterPanel({
  selectedSpeciality,
  onSelectSpeciality,
  maxFee,
  onMaxFeeChange,
  minExperience,
  onMinExperienceChange,
}: FilterPanelProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm">
      <h3 className="font-semibold text-sm tracking-tight text-foreground">Filter Providers</h3>

      {/* Speciality filter */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-muted-foreground">Speciality</label>
        <select
          value={selectedSpeciality}
          onChange={(e) => onSelectSpeciality(e.target.value)}
          className="w-full rounded-lg border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Specialities</option>
          {SPECIALITIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Max Fee Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Max Fee</span>
          <span className="font-semibold text-foreground">₹{maxFee}</span>
        </div>
        <input
          type="range"
          min={200}
          max={5000}
          step={100}
          value={maxFee}
          onChange={(e) => onMaxFeeChange(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      {/* Minimum Experience */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Min Experience</span>
          <span className="font-semibold text-foreground">{minExperience} yrs</span>
        </div>
        <input
          type="range"
          min={0}
          max={30}
          step={1}
          value={minExperience}
          onChange={(e) => onMinExperienceChange(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>
    </div>
  )
}
