'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const QUESTIONS = [
  {
    id: 1,
    theme: "Energy & Motivation",
    question: "When do you feel most alive?",
    options: [
      { label: "Creating something new", value: "a" },
      { label: "Solving a complex problem", value: "b" },
      { label: "Helping others", value: "c" },
      { label: "Being recognised for my work", value: "d" },
    ]
  },
  {
    id: 2,
    theme: "Decision Making",
    question: "What stops you from making big life decisions?",
    options: [
      { label: "Fear of judgment", value: "a" },
      { label: "Too many options", value: "b" },
      { label: "Lack of clarity on what I want", value: "c" },
      { label: "Financial uncertainty", value: "d" },
    ]
  },
  {
    id: 3,
    theme: "Career Alignment",
    question: "Your current job is…",
    options: [
      { label: "What I'm passionate about", value: "a" },
      { label: "Paying the bills", value: "b" },
      { label: "Building skills for future goals", value: "c" },
      { label: "A complete mismatch", value: "d" },
    ]
  },
  {
    id: 4,
    theme: "Social Dynamics",
    question: "In group settings, you're usually the one who…",
    options: [
      { label: "Leads the conversation", value: "a" },
      { label: "Observes quietly", value: "b" },
      { label: "Keeps the peace", value: "c" },
      { label: "Challenges ideas", value: "d" },
    ]
  },
  {
    id: 5,
    theme: "Stress Response",
    question: "When overwhelmed, you…",
    options: [
      { label: "Work harder to fix it", value: "a" },
      { label: "Shut down and disconnect", value: "b" },
      { label: "Talk it out with someone", value: "c" },
      { label: "Overthink until paralyzed", value: "d" },
    ]
  },
  {
    id: 6,
    theme: "Values",
    question: "What bothers you most about your current life?",
    options: [
      { label: "Wasting my potential", value: "a" },
      { label: "Not being financially stable", value: "b" },
      { label: "Feeling disconnected from loved ones", value: "c" },
      { label: "Lack of recognition", value: "d" },
    ]
  },
  {
    id: 7,
    theme: "Future Vision",
    question: "In 5 years, you see yourself…",
    options: [
      { label: "Building my own thing", value: "a" },
      { label: "Mastering a craft", value: "b" },
      { label: "Living a balanced life", value: "c" },
      { label: "Still figuring it out", value: "d" },
    ]
  },
  {
    id: 8,
    theme: "Failure Framing",
    question: "When you fail, your first thought is…",
    options: [
      { label: "I'm not good enough", value: "a" },
      { label: "I'll try a different approach", value: "b" },
      { label: "It wasn't meant to be", value: "c" },
      { label: "Something else is to blame", value: "d" },
    ]
  },
  {
    id: 9,
    theme: "Time Perception",
    question: "You spend most of your mental energy on…",
    options: [
      { label: "Regretting the past", value: "a" },
      { label: "Worrying about the future", value: "b" },
      { label: "Being present", value: "c" },
      { label: "Planning the next move", value: "d" },
    ]
  },
  {
    id: 10,
    theme: "Cultural Expectations",
    question: "Growing up, you were told success means…",
    options: [
      { label: "A stable job", value: "a" },
      { label: "Financial independence", value: "b" },
      { label: "Making your family proud", value: "c" },
      { label: "Finding your passion", value: "d" },
    ]
  },
  {
    id: 11,
    theme: "Risk Tolerance",
    question: "If you had ₹10 lakhs today, you'd…",
    options: [
      { label: "Invest in a business idea", value: "a" },
      { label: "Save for stability", value: "b" },
      { label: "Travel and explore", value: "c" },
      { label: "Upskill or educate myself", value: "d" },
    ]
  },
  {
    id: 12,
    theme: "Emotional Awareness",
    question: "How often do you pause to understand what you're truly feeling?",
    options: [
      { label: "Rarely — I just push through", value: "a" },
      { label: "Sometimes, when things get heavy", value: "b" },
      { label: "Often — I journal or reflect", value: "c" },
      { label: "Always — I'm very self-aware", value: "d" },
    ]
  },
  {
    id: 13,
    theme: "Social Validation",
    question: "How much does others' approval affect your decisions?",
    options: [
      { label: "A lot — I need validation", value: "a" },
      { label: "Somewhat — key people matter", value: "b" },
      { label: "A little — I prefer my own judgment", value: "c" },
      { label: "Not at all — I trust myself fully", value: "d" },
    ]
  },
  {
    id: 14,
    theme: "Purpose Clarity",
    question: "Where are you on your life purpose right now?",
    options: [
      { label: "Completely lost", value: "a" },
      { label: "Some ideas, no real clarity", value: "b" },
      { label: "Clear direction, lacking execution", value: "c" },
      { label: "Clear and actively acting on it", value: "d" },
    ]
  },
  {
    id: 15,
    theme: "Action vs Overthinking",
    question: "When you have a new idea, you…",
    options: [
      { label: "Act on it immediately", value: "a" },
      { label: "Research for weeks before starting", value: "b" },
      { label: "Talk about it but never start", value: "c" },
      { label: "Dismiss it as unrealistic", value: "d" },
    ]
  },
]

export default function Quiz() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selected, setSelected] = useState<string | null>(null)

  const question = QUESTIONS[current]
  const progress = ((current) / QUESTIONS.length) * 100

  const handleSelect = (value: string) => {
    setSelected(value)
  }

  const handleNext = () => {
    if (!selected) return

    const newAnswers = { ...answers, [question.id]: selected }
    setAnswers(newAnswers)
    setSelected(null)

    if (current + 1 === QUESTIONS.length) {
      // Store answers and go to results
      localStorage.setItem('mindmarg_answers', JSON.stringify(newAnswers))
      router.push('/results')
    } else {
      setCurrent(current + 1)
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a2e 0%, #1a0a2e 50%, #0a1020 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: 'system-ui, sans-serif',
      color: 'white',
    }}>

      {/* Progress Bar */}
      <div style={{ width: '100%', maxWidth: '560px', marginBottom: '40px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '12px',
          color: '#475569',
        }}>
          <span style={{ color: '#f97316', fontWeight: 600 }}>
            {question.theme}
          </span>
          <span>{current + 1} of {QUESTIONS.length}</span>
        </div>
        <div style={{
          height: '3px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '999px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: '#f97316',
            borderRadius: '999px',
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Question */}
      <div style={{ width: '100%', maxWidth: '560px' }}>
        <h2 style={{
          fontSize: 'clamp(20px, 4vw, 28px)',
          fontWeight: '700',
          marginBottom: '32px',
          lineHeight: '1.3',
          fontFamily: 'Georgia, serif',
        }}>
          {question.question}
        </h2>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              style={{
                padding: '16px 20px',
                borderRadius: '12px',
                border: `1.5px solid ${selected === option.value
                  ? '#f97316'
                  : 'rgba(255,255,255,0.1)'}`,
                background: selected === option.value
                  ? 'rgba(249,115,22,0.12)'
                  : 'rgba(255,255,255,0.03)',
                color: selected === option.value ? '#fff' : '#94a3b8',
                fontSize: '15px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!selected}
          style={{
            marginTop: '28px',
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            background: selected ? '#f97316' : 'rgba(255,255,255,0.05)',
            color: selected ? 'white' : '#334155',
            fontWeight: '700',
            fontSize: '15px',
            border: 'none',
            cursor: selected ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {current + 1 === QUESTIONS.length ? 'See My Blueprint →' : 'Next →'}
        </button>
      </div>
    </main>
  )
}