import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Fetch profile to determine dynamic role-based redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        const role = (profile as { role?: string } | null)?.role ?? 'patient'

        if (next) {
          return NextResponse.redirect(`${origin}${next}`)
        }

        if (role === 'doctor') return NextResponse.redirect(`${origin}/doctor-dashboard`)
        if (role === 'pharmacy') return NextResponse.redirect(`${origin}/pharmacy-dashboard`)
        if (role === 'lab') return NextResponse.redirect(`${origin}/lab-dashboard`)
        if (role === 'admin') return NextResponse.redirect(`${origin}/admin`)

        return NextResponse.redirect(`${origin}/dashboard`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-failed`)
}
