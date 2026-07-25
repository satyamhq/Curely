'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Home, Pill, User, Activity } from 'lucide-react'

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'AI Check', href: '/symptom-checker', icon: Activity },
    { label: 'Doctors', href: '/doctors', icon: Calendar },
    { label: 'Pharmacy', href: '/pharmacy', icon: Pill },
    { label: 'Account', href: '/dashboard', icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-background/95 backdrop-blur-md md:hidden">
      {navItems.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
              active ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
