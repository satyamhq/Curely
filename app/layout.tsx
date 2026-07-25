import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Curely – Find Doctors, Book Appointments & Order Medicines',
    template: '%s | Curely',
  },
  description:
    "Describe your symptoms and let Curely's AI match you with the right doctor. Book appointments, consult online, order medicines, and schedule lab tests — all in one app.",
  keywords: [
    'online doctor appointment booking',
    'AI symptom checker',
    'online medicine delivery',
    'lab test booking online',
    'telemedicine app',
    'healthcare marketplace',
    'find doctors near me',
    'online consultation',
  ],
  authors: [{ name: 'Curely' }],
  openGraph: {
    title: 'Curely – Find Doctors, Book Appointments & Order Medicines',
    description:
      "Describe your symptoms and let Curely's AI match you with the right doctor. Book appointments, consult online, order medicines, and schedule lab tests — all in one app.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'Curely',
    images: ['/og-image.svg'],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Curely – Find Doctors, Book Appointments & Order Medicines',
    description:
      "Describe your symptoms and let Curely's AI match you with the right doctor. Book appointments, consult online, order medicines, and schedule lab tests — all in one app.",
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
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
