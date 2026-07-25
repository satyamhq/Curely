import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database.types'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // Protected route groups
  const protectedPrefixes = [
    '/dashboard',
    '/symptom-checker',
    '/doctors',
    '/appointments',
    '/pharmacy',
    '/cart',
    '/checkout',
    '/orders',
    '/labs',
    '/lab-bookings',
    '/health-records',
    '/profile',
    '/doctor-dashboard',
    '/pharmacy-dashboard',
    '/lab-dashboard',
    '/admin',
  ]

  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix))

  // Redirect unauthenticated users
  if (isProtected && !user) {
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Role-based route authorization
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = (profile as { role?: string } | null)?.role ?? 'patient'

    // Redirect authenticated users from login/signup to their role home
    if ((pathname === '/login' || pathname === '/signup') && user) {
      url.pathname = getRoleHome(role)
      return NextResponse.redirect(url)
    }

    // Redirect provider roles accessing generic /dashboard to their dedicated dashboard
    if (pathname === '/dashboard' && role !== 'patient') {
      url.pathname = getRoleHome(role)
      return NextResponse.redirect(url)
    }

    // Prevent non-admins from entering admin routes
    if (pathname.startsWith('/admin') && role !== 'admin') {
      url.pathname = getRoleHome(role)
      return NextResponse.redirect(url)
    }

    // Role-specific dashboard protection
    if (pathname.startsWith('/doctor-dashboard') && role !== 'doctor' && role !== 'admin') {
      url.pathname = getRoleHome(role)
      return NextResponse.redirect(url)
    }

    if (pathname.startsWith('/pharmacy-dashboard') && role !== 'pharmacy' && role !== 'admin') {
      url.pathname = getRoleHome(role)
      return NextResponse.redirect(url)
    }

    if (pathname.startsWith('/lab-dashboard') && role !== 'lab' && role !== 'admin') {
      url.pathname = getRoleHome(role)
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

function getRoleHome(role: string): string {
  switch (role) {
    case 'doctor':
      return '/doctor-dashboard'
    case 'pharmacy':
      return '/pharmacy-dashboard'
    case 'lab':
      return '/lab-dashboard'
    case 'admin':
      return '/admin'
    default:
      return '/dashboard'
  }
}
