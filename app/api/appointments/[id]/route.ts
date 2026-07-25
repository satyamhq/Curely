import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ error: 'Not implemented yet', id: params.id }, { status: 501 })
}

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ error: 'Not implemented yet', id: params.id }, { status: 501 })
}
