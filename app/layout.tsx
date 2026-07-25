import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: {
    default: 'Curely — Your AI Health Companion',
    template: '%s | Curely',
  },
  description:
    'AI-powered healthcare marketplace. Describe your symptoms, find the right doctor, book appointments, order medicines, and manage your health records — all in one place.',
  keywords: [
    'healthcare',
    'doctor booking',
    'online consultation',
    'pharmacy',
    'lab tests',
    'AI symptom checker',
    'health records',
  ],
  authors: [{ name: 'Curely' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Curely',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  )
}
