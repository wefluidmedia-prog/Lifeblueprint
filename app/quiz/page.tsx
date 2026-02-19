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
      { label: "Helping others grow", value: "c" },
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
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 9,
    theme: "Action vs Overthinking",
    question: "When you have a new idea, you…",
    options: [
      { label: "Act on it immediately", value: "a" },
      { label: "Research for weeks before starting", value: "b" },
      { label: "Talk about it but never start", value: "c" },
      { label: "Dismiss it as unrealistic", value: "d" },
    ]
  },
  {
    id: 10,
    theme: "Inner Voice",
    question: "When you imagine your future self, the dominant feeling is…",
    options: [
      { label: "Excitement — I can see it clearly", value: "a" },
      { label: "Anxiety — what if I don't make it", value: "b" },
      { label: "Numbness — I've stopped imagining", value: "c" },
      { label: "Guilt — I should be further along by now", value: "d" },
    ]
  },
  {
    id: 11,
    theme: "Body & Pressure",
    question: "Before an important task, your body usually…",
    options: [
      { label: "Feels energized and ready", value: "a" },
      { label: "Tightens up — chest, shoulders, jaw", value: "b" },
      { label: "Goes numb, you just disconnect", value: "c" },
      { label: "Sends you to your phone or food first", value: "d" },
    ]
  },
  {
    id: 12,
    theme: "Others & Identity",
    question: "How much do other people's opinions shape your choices?",
    options: [
      { label: "Barely — I move on my own signal", value: "a" },
      { label: "A lot — I need validation before I act", value: "b" },
      { label: "Depends who it is — some views matter more", value: "c" },
      { label: "I pretend they don't, but they do", value: "d" },
    ]
  },
]

export default function Quiz() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selected, setSelected] = useState<string | null>(null)

  const question = QUESTIONS[current]
  const progress = ((current + 1) / QUESTIONS.length) * 100
  const isLast = current + 1 === QUESTIONS.length
  const questionsLeft = QUESTIONS.length - current - 1

  const getProgressMessage = () => {
    if (current === 0) return "Most people never reflect this deeply."
    if (current === 2) return "Good start. Most people quit before this."
    if (current === 5) return "You're halfway. Patterns are forming."
    if (current === 8) return "Almost there. Clarity is sharpening."
    if (current === 10) return "Last one. This locks in your blueprint."
    return ""
  }

  const handleSelect = (value: string) => setSelected(value)

  const handleNext = () => {
    if (!selected) return
    const newAnswers = { ...answers, [question.id]: selected }
    setAnswers(newAnswers)
    setSelected(null)

    if (isLast) {
      localStorage.setItem('mindmarg_answers', JSON.stringify(newAnswers))
      router.push('/results')
    } else {
      setCurrent(current + 1)
    }
  }

  const handleBack = () => {
    if (current === 0) {
      router.push('/')
    } else {
      setCurrent(current - 1)
      setSelected(answers[QUESTIONS[current - 1].id] || null)
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a2e 0%, #1a0a2e 50%, #0a1020 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: 'system-ui, sans-serif',
      color: 'white',
    }}>

      <div style={{ width: '100%', maxWidth: '560px' }}>

        {/* Top Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}>
          <button onClick={handleBack} style={{
            background: 'none',
            border: 'none',
            color: '#475569',
            cursor: 'pointer',
            fontSize: '20px',
          }}>
            ←
          </button>

          <span style={{ fontSize: '12px', color: '#334155' }}>
            {current + 1} / {QUESTIONS.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{
          height: '4px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '999px',
          overflow: 'hidden',
          marginBottom: '16px',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: '#f97316',
            transition: 'width 0.4s ease',
          }} />
        </div>

        {/* Psychological Progress Text */}
        <div style={{
          minHeight: '24px',
          marginBottom: '28px',
          color: '#94a3b8',
          fontSize: '13px',
        }}>
          {getProgressMessage()}
        </div>

        {/* Question */}
        <h2 style={{
          fontSize: '28px',
          marginBottom: '28px',
          fontFamily: 'Georgia, serif',
        }}>
          {question.question}
        </h2>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {question.options.map((option) => {
            const isSelected = selected === option.value
            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                style={{
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: `1.5px solid ${isSelected ? '#f97316' : 'rgba(255,255,255,0.08)'}`,
                  background: isSelected ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.02)',
                  color: isSelected ? '#ffffff' : '#64748b',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                {option.label}
              </button>
            )
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!selected}
          style={{
            marginTop: '24px',
            width: '100%',
            padding: '15px',
            borderRadius: '10px',
            background: selected ? '#f97316' : 'rgba(255,255,255,0.05)',
            color: selected ? 'white' : '#1e293b',
            fontWeight: '700',
            border: 'none',
            cursor: selected ? 'pointer' : 'not-allowed',
          }}
        >
          {isLast ? 'See My Blueprint →' : 'Continue →'}
        </button>

        {/* Bottom Reinforcement */}
        <p style={{
          textAlign: 'center',
          marginTop: '16px',
          color: '#475569',
          fontSize: '12px',
        }}>
          {questionsLeft > 1
            ? `${questionsLeft} questions left — stay with it`
            : questionsLeft === 1
            ? `Just 1 question left`
            : `Final step`}
        </p>

      </div>
    </main>
  )
}