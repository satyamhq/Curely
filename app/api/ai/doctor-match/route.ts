import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const { speciality, city, maxFee } = await req.json()

    const supabase = await createClient()

    let query = supabase
      .from('doctors')
      .select(`
        id,
        speciality,
        experience_years,
        fee,
        bio,
        qualifications,
        verified,
        profile_id,
        profiles!inner(full_name, avatar_url, city)
      `)
      .eq('verified', true)

    if (speciality) {
      query = query.ilike('speciality', `%${speciality}%`)
    }

    if (maxFee) {
      query = query.lte('fee', maxFee)
    }

    const { data: doctors, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message || 'Failed to query doctors database.' }, { status: 400 })
    }

    const candidates: any[] = (doctors as any[]) || []

    // Doctor Ranking Algorithm:
    // Score = (Experience * 2) + (Rating * 10) - (Fee / 100)
    const rankedDoctors = candidates
      .map((doc: any) => {
        const rating = doc.rating ?? 4.9
        const expScore = (doc.experience_years || 0) * 2
        const ratingScore = rating * 10
        const feePenalty = (doc.fee || 0) / 100
        const totalScore = expScore + ratingScore - feePenalty

        const whyRecommended = `Matches ${doc.speciality} requirement with ${doc.experience_years} years experience and ${rating}★ rating.`

        return {
          ...doc,
          score: totalScore,
          whyRecommended,
          profile: {
            full_name: doc.profiles?.full_name ?? 'Dr. Medical Specialist',
            avatar_url: doc.profiles?.avatar_url ?? null,
            city: doc.profiles?.city ?? 'Online',
          },
        }
      })
      .sort((a, b) => b.score - a.score)

    return NextResponse.json({ doctors: rankedDoctors })
  } catch (error: any) {
    console.error('Doctor Match Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to rank doctors.' },
      { status: 500 }
    )
  }
}

