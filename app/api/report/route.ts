import { NextRequest, NextResponse } from 'next/server'
import { calculateScores, TRAIT_LABELS, ANSWER_LABELS, Traits } from '@/lib/scoring'
import { REPORT_SYSTEM_PROMPT } from '@/lib/prompts'

export async function POST(req: NextRequest) {
  try {
    const { answers } = await req.json()

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Invalid answers' }, { status: 400 })
    }

    const scores = calculateScores(answers)

    const answerContext = Object.entries(answers)
      .map(([qId, val]) => {
        const label = ANSWER_LABELS[Number(qId)]?.[val as string]
        return label ? `Q${qId}: "${label}"` : null
      })
      .filter(Boolean)
      .join('\n')

    const scoreSummary = Object.entries(scores)
      .map(([key, val]) => `${TRAIT_LABELS[key as keyof Traits]}: ${val}/100`)
      .join('\n')

    const userPrompt = `Here is the person's psychometric data:

TRAIT SCORES:
${scoreSummary}

THEIR ACTUAL ANSWERS:
${answerContext}

Generate their personalized behavioral report now.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 1500,
        temperature: 0.5,
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