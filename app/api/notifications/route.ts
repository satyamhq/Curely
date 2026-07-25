import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ notifications: [] })
    }

    const { data: notifications } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    return NextResponse.json({ notifications: notifications || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId, title, body, type } = await req.json()

    const supabase = await createClient()

    const { data: newNotification } = await (supabase.from('notifications') as any)
      .insert({
        user_id: userId,
        title,
        body,
        read: false,
        type: type || 'info',
      })
      .select()
      .single()

    return NextResponse.json(newNotification)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
