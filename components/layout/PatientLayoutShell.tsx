import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { MobileNav } from './MobileNav'

interface PatientLayoutShellProps {
  children: React.ReactNode
}

export function PatientLayoutShell({ children }: PatientLayoutShellProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12">
        {children}
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
