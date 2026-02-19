import { NextRequest, NextResponse } from 'next/server'
import { calculateScores, TRAIT_LABELS, ANSWER_LABELS, Traits } from '@/lib/scoring'
import { REPORT_SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompts'

export async function POST(req: NextRequest) {
  try {
    const { answers } = await req.json()

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Invalid answers' }, { status: 400 })
    }

    const scores = calculateScores(answers)

    const userPrompt = buildUserPrompt(answers, scores)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',       // mini skips rules under pressure — 4o follows them
        max_tokens: 1200,      // bumped slightly to avoid cut-off reports
        temperature: 0.8,      // higher = more human, less robotic
        messages: [
          { role: 'system', content: REPORT_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('OpenAI error:', err)
      return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
    }

    const data = await response.json()
    const report = data.choices?.[0]?.message?.content

    if (!report) {
      return NextResponse.json({ error: 'Empty report returned' }, { status: 500 })
    }

    return NextResponse.json({ report, scores })

  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}