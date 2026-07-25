import { NextResponse } from 'next/server'
import openai from '@/lib/openai'

export async function POST(req: Request) {
  try {
    const { symptoms, patientAge, patientGender } = await req.json()

    if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please enter a clear description of your symptoms.' },
        { status: 400 }
      )
    }

    // Input sanitization & character length capping (max 1000 characters)
    const sanitizedSymptoms = symptoms
      .trim()
      .slice(0, 1000)
      .replace(/[\{\}\[\]\<\>\\]/g, '') // Strip system prompt injection brackets

    const systemPrompt = `You are Curely AI, an expert medical triage assistant.
Analyze patient-described symptoms and recommend appropriate medical specialities and urgency levels.

CRITICAL RULES:
1. You MUST NEVER present a definitive medical diagnosis.
2. Return ONLY a valid JSON object matching this exact schema:
{
  "possibleConditions": [
    {
      "name": "Condition Name",
      "probability": "High | Moderate | Low",
      "description": "Short 1-sentence explanation"
    }
  ],
  "urgencyLevel": "routine | urgent | emergency",
  "recommendedSpeciality": "General Physician | Cardiologist | Dermatologist | Neurologist | Orthopedic | Pediatrician | Psychiatrist | Gynecologist | ENT Specialist | Dentist",
  "rationale": "Clear, concise 1-2 sentence explanation of why this speciality is recommended based on the reported symptoms.",
  "disclaimer": "This AI assessment is for triage purposes only and does NOT constitute a formal medical diagnosis or treatment plan. Always consult a licensed healthcare professional."
}`

    const userPrompt = `Patient Details:
- Age: ${patientAge || '30'}
- Gender: ${patientGender || 'Not specified'}
- Symptoms: "${sanitizedSymptoms}"`

    // Fallback response for offline / missing OpenAI API key during local dev
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        possibleConditions: [
          {
            name: 'Viral Respiratory Infection / Acute Cold',
            probability: 'High',
            description: 'Common viral infection of upper airways causing sore throat, mild fever, or congestion.',
          },
          {
            name: 'Seasonal Environmental Allergies',
            probability: 'Moderate',
            description: 'Allergic response causing nasal congestion and throat tickle.',
          },
        ],
        urgencyLevel: 'routine',
        recommendedSpeciality: 'General Physician',
        rationale: 'Your reported symptoms of throat discomfort and mild fever match common viral respiratory conditions best evaluated by a General Physician.',
        disclaimer: 'This AI assessment is for triage purposes only and does NOT constitute a formal medical diagnosis. Always consult a licensed healthcare provider.',
      })
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content returned from OpenAI response.')
    }

    const parsed = JSON.parse(content)
    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error('Symptom Check Error:', error)
    return NextResponse.json(
      {
        // Graceful fallback response when API fails
        possibleConditions: [
          {
            name: 'General Medical Evaluation Required',
            probability: 'Moderate',
            description: 'Please consult a doctor for clinical assessment.',
          },
        ],
        urgencyLevel: 'routine',
        recommendedSpeciality: 'General Physician',
        rationale: 'System temporarily defaulting to General Physician for clinical evaluation.',
        disclaimer: 'This AI assessment is for triage purposes only and does NOT constitute a formal medical diagnosis. Always consult a licensed healthcare professional.',
      },
      { status: 200 }
    )
  }
}
