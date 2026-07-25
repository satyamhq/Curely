'use client'

import { useState } from 'react'
import { PatientLayoutShell } from '@/components/layout/PatientLayoutShell'
import { DoctorCard } from '@/components/shared/DoctorCard'
import { PharmacyCard } from '@/components/shared/PharmacyCard'
import { LabCard } from '@/components/shared/LabCard'
import { MedicineCard } from '@/components/shared/MedicineCard'
import { AppointmentCard } from '@/components/shared/AppointmentCard'
import { RatingStars } from '@/components/shared/RatingStars'
import { SearchBar } from '@/components/shared/SearchBar'
import { FilterPanel } from '@/components/shared/FilterPanel'
import { LoadingState, EmptyState, ErrorState } from '@/components/shared/StateViews'
import { DataTable } from '@/components/shared/DataTable'
import { ModalDialog } from '@/components/shared/ModalDialog'
import { ArrowRight, Check, HeartPulse, Layers, Plus, Sparkles } from 'lucide-react'

export default function DesignSystemPage() {
  const [searchVal, setSearchVal] = useState('')
  const [selectedSpec, setSelectedSpec] = useState('')
  const [maxFee, setMaxFee] = useState(1500)
  const [minExp, setMinExp] = useState(5)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const sampleDoctor = {
    id: 'doc-ds1',
    profile_id: 'prof-ds1',
    speciality: 'Cardiologist',
    experience_years: 15,
    fee: 1000,
    bio: 'Senior cardiologist offering telehealth and in-clinic heart care.',
    qualifications: 'MBBS, DM (Cardiology)',
    verified: true,
    rating: 4.9,
    review_count: 140,
    created_at: new Date().toISOString(),
    profile: {
      full_name: 'Dr. Priya Ananth',
      avatar_url: null,
      city: 'Bengaluru',
    },
  }

  const samplePharmacy = {
    id: 'pharm-ds1',
    profile_id: 'prof-ph-ds1',
    name: 'Apollo Pharmacy — Downtown',
    address: 'Plot 45, MG Road, Mumbai',
    license_no: 'DL-MH-2024-889',
    verified: true,
    rating: 4.9,
    created_at: new Date().toISOString(),
  }

  const sampleLab = {
    id: 'lab-ds1',
    profile_id: 'prof-l-ds1',
    name: 'Metropolis Diagnostics Center',
    address: 'Andheri West, Mumbai',
    license_no: 'LAB-MH-2024-901',
    verified: true,
    rating: 4.9,
    created_at: new Date().toISOString(),
  }

  const sampleMedicine = {
    id: 'med-ds1',
    pharmacy_id: 'pharm-ds1',
    name: 'Paracetamol 650mg (Dolo)',
    price: 32,
    stock: 150,
    requires_prescription: false,
    description: 'Fast acting fever and pain reliever tablets.',
  }

  const sampleAppointment = {
    id: 'apt-ds1',
    slot_time: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'confirmed',
    mode: 'online',
    amount: 1000,
    doctor: {
      profile: {
        full_name: 'Dr. Priya Ananth',
        city: 'Bengaluru',
      },
      speciality: 'Cardiologist',
    },
  }

  const sampleTableColumns = [
    { key: 'name', header: 'Name' },
    { key: 'role', header: 'Role' },
    {
      key: 'status',
      header: 'Status',
      render: (r: any) => (
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
          {r.status}
        </span>
      ),
    },
  ]

  const sampleTableData = [
    { name: 'Dr. Rajesh Sharma', role: 'Doctor', status: 'Verified' },
    { name: 'Apollo Pharmacy', role: 'Pharmacy', status: 'Verified' },
    { name: 'Metropolis Lab', role: 'Lab', status: 'Pending' },
  ]

  return (
    <PatientLayoutShell>
      <div className="space-y-12">
        {/* Header Banner */}
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1 text-xs font-medium text-muted-foreground">
            <Layers className="h-3.5 w-3.5 text-primary" />
            Curely UI Component Library
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Modern Minimal Design System</h1>
          <p className="text-sm text-muted-foreground">
            Interactive visual reference showcase for Curely design tokens, buttons, inputs, shared cards, feedback states, and layout components.
          </p>
        </div>

        {/* 1. Color Palette Tokens */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Theme Color Tokens</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            <ColorTile name="Background" bg="bg-background" text="text-foreground border border-border" />
            <ColorTile name="Card" bg="bg-card" text="text-card-foreground border border-border" />
            <ColorTile name="Primary" bg="bg-primary" text="text-primary-foreground" />
            <ColorTile name="Secondary" bg="bg-secondary" text="text-secondary-foreground" />
            <ColorTile name="Muted" bg="bg-muted" text="text-muted-foreground" />
            <ColorTile name="Destructive" bg="bg-destructive" text="text-destructive-foreground" />
          </div>
        </section>

        {/* 2. Button Matrix */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Buttons & Variants</h2>
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <button className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Primary Button
            </button>
            <button className="rounded-xl border border-border bg-background px-5 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted">
              Outline Button
            </button>
            <button className="rounded-xl bg-secondary px-5 py-2.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80">
              Secondary Button
            </button>
            <button className="rounded-xl bg-destructive px-5 py-2.5 text-xs font-semibold text-destructive-foreground shadow hover:bg-destructive/90">
              Destructive Button
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow transition-colors"
            >
              <Sparkles className="h-4 w-4" /> Open Modal Dialog
            </button>
          </div>
        </section>

        {/* 3. Input Controls */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Input Controls & Filters</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-semibold">SearchBar Component</h3>
              <SearchBar value={searchVal} onChange={setSearchVal} placeholder="Type to test live input search..." />
            </div>
            <FilterPanel
              selectedSpeciality={selectedSpec}
              onSelectSpeciality={setSelectedSpec}
              maxFee={maxFee}
              onMaxFeeChange={setMaxFee}
              minExperience={minExp}
              onMinExperienceChange={setMinExp}
            />
          </div>
        </section>

        {/* 4. Shared Cards */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Shared Domain Cards</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <DoctorCard doctor={sampleDoctor} />
            <PharmacyCard pharmacy={samplePharmacy} />
            <LabCard lab={sampleLab} />
            <MedicineCard medicine={sampleMedicine} />
            <div className="sm:col-span-2">
              <AppointmentCard appointment={sampleAppointment} />
            </div>
          </div>
        </section>

        {/* 5. UI State Views */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">UI Feedback States (Loading, Empty, Error)</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Skeleton Loader</h3>
              <LoadingState count={1} type="card" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Empty State</h3>
              <EmptyState title="No Records" description="Items will appear here once created." />
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Error Alert</h3>
              <ErrorState title="Connection Error" message="Unable to fetch network data." />
            </div>
          </div>
        </section>

        {/* 6. Data Table */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Data Table Component</h2>
          <DataTable columns={sampleTableColumns} data={sampleTableData} searchKey="name" placeholder="Search provider table..." />
        </section>

        {/* Modal Dialog Component Preview */}
        <ModalDialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Modal Dialog Preview"
          description="Accessible modal overlay built for confirmation forms and detail views."
        >
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              This modal component traps focus, listens for Escape key dismissals, and disables background body scrolling.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </ModalDialog>
      </div>
    </PatientLayoutShell>
  )
}

function ColorTile({ name, bg, text }: { name: string; bg: string; text: string }) {
  return (
    <div className={`flex h-20 flex-col justify-end rounded-xl p-3 text-xs font-semibold ${bg} ${text} shadow-sm`}>
      {name}
    </div>
  )
}
