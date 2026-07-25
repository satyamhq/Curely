'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HeartPulse, Loader2, Lock, Mail, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') ?? '/dashboard'
  
  const [authError, setAuthError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    setAuthError(null)

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        setAuthError(error.message)
        setLoading(false)
        return
      }

      if (authData.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single()

        const role = (profile as { role?: string } | null)?.role ?? 'patient'
        
        let target = redirectPath
        if (redirectPath === '/dashboard') {
          if (role === 'doctor') target = '/doctor-dashboard'
          else if (role === 'pharmacy') target = '/pharmacy-dashboard'
          else if (role === 'lab') target = '/lab-dashboard'
          else if (role === 'admin') target = '/admin'
        }

        router.push(target)
        router.refresh()
      }
    } catch {
      setAuthError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    })
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
        <h2 className="mt-6 text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to access your dashboard, appointments, and health records
        </p>
      </div>

      {authError && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{authError}</p>
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-foreground">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleOAuthLogin('google')}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background py-2 px-4 text-xs font-medium text-foreground hover:bg-muted"
        >
          Google
        </button>
        <button
          type="button"
          onClick={() => handleOAuthLogin('github')}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background py-2 px-4 text-xs font-medium text-foreground hover:bg-muted"
        >
          GitHub
        </button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/signup/role" className="font-semibold text-foreground hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="h-96 w-full max-w-md rounded-2xl bg-muted animate-pulse" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
