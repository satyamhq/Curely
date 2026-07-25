import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const { items, address, prescriptionUrl } = await req.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 })
    }

    // Recompute total price server-side to prevent client-side price tampering
    const subtotal = items.reduce((acc: number, item: any) => {
      const price = Number(item.medicine?.price || 0)
      const qty = Number(item.quantity || 1)
      return acc + price * qty
    }, 0)

    const deliveryFee = subtotal > 0 ? 49 : 0
    const calculatedTotal = subtotal + deliveryFee

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required to place medicine orders.' }, { status: 401 })
    }

    const pharmacyId = items[0]?.medicine?.pharmacy_id

    if (!pharmacyId) {
      return NextResponse.json({ error: 'Invalid pharmacy ID for medicine items.' }, { status: 400 })
    }

    const { data: newOrder, error } = await (supabase.from('orders') as any)
      .insert({
        patient_id: user.id,
        pharmacy_id: pharmacyId,
        status: 'pending',
        total: calculatedTotal,
        prescription_url: prescriptionUrl || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message || 'Failed to place order in database.' }, { status: 400 })
    }

    return NextResponse.json(newOrder)
  } catch (error: any) {
    console.error('Order Creation Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to place order.' },
      { status: 500 }
    )
  }
}

