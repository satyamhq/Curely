'use client'

import { Sidebar } from './Sidebar'
import { HeartPulse, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface ProviderLayoutShellProps {
  role: 'doctor' | 'pharmacy' | 'lab' | 'admin'
  children: React.ReactNode
}

export function ProviderLayoutShell({ role, children }: ProviderLayoutShellProps) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Provider Topbar */}
        <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/80 backdrop-blur-sm px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm">Curely Provider</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground capitalize">{role} Workspace</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary capitalize">
              {role}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <User className="h-4 w-4" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  )
}
