'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, HeartPulse, LogOut, ShieldAlert, User, ShoppingBag } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'

export function Navbar() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const items = useCart((state) => state.items)
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HeartPulse className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Curely</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/doctors" className="transition-colors hover:text-foreground">Doctors</Link>
          <Link href="/pharmacy" className="transition-colors hover:text-foreground">Pharmacy</Link>
          <Link href="/labs" className="transition-colors hover:text-foreground">Labs</Link>
          <Link href="/symptom-checker" className="transition-colors hover:text-foreground">Symptom&nbsp;Checker</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2 text-muted-foreground hover:text-foreground">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground hover:bg-accent"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup/role"
                    className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Get started <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
