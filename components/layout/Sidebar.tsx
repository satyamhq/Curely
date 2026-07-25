'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, FileText, LayoutDashboard, Pill, User, Activity, FlaskConical } from 'lucide-react'

interface SidebarProps {
  role?: 'patient' | 'doctor' | 'pharmacy' | 'lab' | 'admin'
}

export function Sidebar({ role = 'patient' }: SidebarProps) {
  const pathname = usePathname()

  const links = getRoleLinks(role)

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/60 p-4 space-y-6 min-h-screen">
      <div className="px-3 py-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {role} Portal
        </h3>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors ${
                active
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

function getRoleLinks(role: string) {
  switch (role) {
    case 'doctor':
      return [
        { label: 'Dashboard', href: '/doctor-dashboard', icon: LayoutDashboard },
        { label: 'Appointments', href: '/doctor-dashboard/appointments', icon: Calendar },
        { label: 'Patients', href: '/doctor-dashboard/patients', icon: User },
        { label: 'Availability', href: '/doctor-dashboard/availability', icon: Activity },
        { label: 'Earnings', href: '/doctor-dashboard/earnings', icon: FileText },
        { label: 'Profile', href: '/doctor-dashboard/profile', icon: User },
      ]
    case 'pharmacy':
      return [
        { label: 'Dashboard', href: '/pharmacy-dashboard', icon: LayoutDashboard },
        { label: 'Inventory', href: '/pharmacy-dashboard/inventory', icon: Pill },
        { label: 'Orders', href: '/pharmacy-dashboard/orders', icon: FileText },
        { label: 'Profile', href: '/pharmacy-dashboard/profile', icon: User },
      ]
    case 'lab':
      return [
        { label: 'Dashboard', href: '/lab-dashboard', icon: LayoutDashboard },
        { label: 'Test Catalog', href: '/lab-dashboard/tests', icon: FlaskConical },
        { label: 'Bookings', href: '/lab-dashboard/bookings', icon: Calendar },
        { label: 'Reports Upload', href: '/lab-dashboard/reports', icon: FileText },
        { label: 'Profile', href: '/lab-dashboard/profile', icon: User },
      ]
    default:
      return [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Symptom Checker', href: '/symptom-checker', icon: Activity },
        { label: 'Appointments', href: '/appointments', icon: Calendar },
        { label: 'Orders', href: '/orders', icon: Pill },
        { label: 'Lab Bookings', href: '/lab-bookings', icon: FlaskConical },
        { label: 'Health Records', href: '/health-records', icon: FileText },
        { label: 'Profile', href: '/profile', icon: User },
      ]
  }
}
