'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HeartPulse, Loader2, Lock, Mail, MapPin, Phone, User, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { signupSchema, type SignupInput } from '@/lib/validations/auth'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = searchParams.get('role') as 'patient' | 'doctor' | 'pharmacy' | 'lab' | null

  const [authError, setAuthError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: initialRole ?? 'patient',
    },
  })

  const currentRole = watch('role')

  const onSubmit = async (data: SignupInput) => {
    setLoading(true)
    setAuthError(null)

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: data.role,
            phone: data.phone,
            city: data.city,
          },
        },
      })

      if (error) {
        setAuthError(error.message)
        setLoading(false)
        return
      }

      if (authData.user) {
        if (data.role === 'doctor') router.push('/doctor-dashboard')
        else if (data.role === 'pharmacy') router.push('/pharmacy-dashboard')
        else if (data.role === 'lab') router.push('/lab-dashboard')
        else router.push('/dashboard')

        router.refresh()
      }
    } catch {
      setAuthError('An unexpected error occurred during signup.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <HeartPulse className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Curely</span>
        </Link>
        <h2 className="mt-6 text-2xl font-bold tracking-tight">Create your account</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign up as a <span className="font-semibold capitalize text-foreground">{currentRole}</span>
        </p>
      </div>

      {authError && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{authError}</p>
        </div>
      )}

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Select Role
          </label>
          <div className="grid grid-cols-4 gap-1.5 rounded-lg border border-border bg-muted p-1 text-center text-xs font-medium">
            {(['patient', 'doctor', 'pharmacy', 'lab'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setValue('role', r)}
                className={`rounded-md py-1.5 capitalize transition-colors ${
                  currentRole === r
                    ? 'bg-background text-foreground shadow-sm font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Full name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              {...register('fullName')}
              type="text"
              placeholder="Dr. Rajesh Sharma or John Doe"
              className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-xs text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              {...register('email')}
              type="email"
              placeholder="name@example.com"
              className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              {...register('password')}
              type="password"
              placeholder="At least 6 characters"
              className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Phone (optional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                {...register('phone')}
                type="tel"
                placeholder="9876543210"
                className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              City (optional)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                {...register('city')}
                type="text"
                placeholder="Mumbai"
                className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-foreground hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="h-96 w-full max-w-md rounded-2xl bg-muted animate-pulse" />}>
        <SignupForm />
      </Suspense>
    </div>
  )
}
