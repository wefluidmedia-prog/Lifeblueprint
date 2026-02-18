'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import WaitlistForm from "@/components/WaitlistForm"

type Scores = {
  creative_drive: number
  execution_capacity: number
  rumination_index: number
  external_validation: number
  autonomy_orientation: number
  action_orientation: number
}

const TRAIT_LABELS: Record<string, string> = {
  creative_drive: "Creative Drive",
  execution_capacity: "Execution Capacity",
  rumination_index: "Rumination Index",
  external_validation: "Ext. Validation",
  autonomy_orientation: "Autonomy",
  action_orientation: "Action Orientation",
}

// Colors based on whether high score is good or concerning
const TRAIT_COLOR: Record<string, string> = {
  creative_drive: '#22c55e',
  execution_capacity: '#22c55e',
  rumination_index: '#f97316',
  external_validation: '#f97316',
  autonomy_orientation: '#22c55e',
  action_orientation: '#22c55e',
}

export default function Results() {
  const router = useRouter()
  const [report, setReport] = useState<string | null>(null)
  const [scores, setScores] = useState<Scores | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('mindmarg_answers')
    if (!stored) {
      router.push('/quiz')
      return
    }

    const answers = JSON.parse(stored)

    fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setReport(data.report)
          setScores(data.scores)
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Something went wrong. Please try again.')
        setLoading(false)
      })
  }, [router])

  // Extract teaser: just the first section of the report
  const getTeaserText = (fullReport: string) => {
    const lines = fullReport.split('\n').filter(Boolean)
    // Take content until we hit the second ## header
    const result: string[] = []
    let headerCount = 0
    for (const line of lines) {
      if (line.startsWith('## ')) {
        headerCount++
        if (headerCount === 2) break
      }
      result.push(line)
    }
    return result.join('\n')
  }

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a2e 0%, #1a0a2e 50%, #0a1020 100%)',
      padding: '40px 20px',
      fontFamily: 'system-ui, sans-serif',
      color: 'white',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
    },
    container: {
      width: '100%',
      maxWidth: '640px',
    },
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', paddingTop: '80px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              border: '3px solid rgba(249,115,22,0.2)',
              borderTopColor: '#f97316',
              margin: '0 auto 24px',
              animation: 'spin 1s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: '#64748b', fontSize: '15px' }}>Analyzing your psychological profile…</p>
            <p style={{ color: '#334155', fontSize: '13px', marginTop: '8px' }}>This takes about 15 seconds</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', paddingTop: '80px' }}>
            <p style={{ color: '#f87171', marginBottom: '16px' }}>{error}</p>
            <button
              onClick={() => router.push('/quiz')}
              style={{ background: '#f97316', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  const teaserText = report ? getTeaserText(report) : ''

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '11px', letterSpacing: '2px', color: '#f97316', textTransform: 'uppercase', fontWeight: 600 }}>
            Your Psychological Blueprint
          </span>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: '700', fontFamily: 'Georgia, serif', marginTop: '12px', lineHeight: 1.2 }}>
            Here's What Your Answers Reveal
          </h1>
        </div>

        {/* Score Cards */}
        {scores && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '40px' }}>
            {Object.entries(scores).map(([key, value]) => (
              <div key={key} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '16px',
              }}>
                <div style={{ fontSize: '11px', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {TRAIT_LABELS[key]}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${value}%`, background: TRAIT_COLOR[key], borderRadius: '999px', transition: 'width 1s ease' }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: TRAIT_COLOR[key], minWidth: '32px' }}>{value}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Report Teaser */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px',
            padding: '28px',
          }}>
            {unlocked ? (
              // Full report
              <div style={{ lineHeight: 1.75, fontSize: '15px' }}>
                {report!.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) {
                    return <h2 key={i} style={{ fontSize: '18px', fontWeight: '700', color: '#f97316', marginTop: '28px', marginBottom: '12px', fontFamily: 'Georgia, serif' }}>{line.replace('## ', '')}</h2>
                  }
                  if (line.trim() === '') return <br key={i} />
                  return <p key={i} style={{ color: '#cbd5e1', marginBottom: '8px' }}>{line}</p>
                })}
              </div>
            ) : (
              // Teaser with blur gate
              <div>
                <div style={{ lineHeight: 1.75, fontSize: '15px' }}>
                  {teaserText.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) {
                      return <h2 key={i} style={{ fontSize: '18px', fontWeight: '700', color: '#f97316', marginBottom: '12px', fontFamily: 'Georgia, serif' }}>{line.replace('## ', '')}</h2>
                    }
                    if (line.trim() === '') return <br key={i} />
                    return <p key={i} style={{ color: '#cbd5e1', marginBottom: '8px' }}>{line}</p>
                  })}
                </div>

                {/* Blur fade */}
                <div style={{
                  height: '120px',
                  background: 'linear-gradient(to bottom, transparent, #0d0d2e)',
                  marginTop: '-80px',
                  position: 'relative',
                  zIndex: 1,
                }} />

                {/* Locked section hint */}
                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                  <p style={{ color: '#475569', fontSize: '13px', marginBottom: '4px' }}>
                    3 more sections locked — including your limiting loop and precision interventions
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Email Unlock CTA */}
{!unlocked && (
  <div style={{
    background: 'rgba(249,115,22,0.06)',
    border: '1px solid rgba(249,115,22,0.2)',
    borderRadius: '16px',
    padding: '28px',
    textAlign: 'center',
  }}>
    <h3 style={{
      fontSize: '20px',
      fontWeight: '700',
      fontFamily: 'Georgia, serif',
      marginBottom: '8px'
    }}>
      Get Your Complete Blueprint — Free Beta Access
    </h3>

    <p style={{
      color: '#94a3b8',
      fontSize: '14px',
      marginBottom: '24px',
      lineHeight: 1.6
    }}>
      Join early users. Get the full psychological report before public launch.
    </p>

    <WaitlistForm />
  </div>
)}

        {/* Retake */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button
            onClick={() => {
              localStorage.removeItem('mindmarg_answers')
              router.push('/quiz')
            }}
            style={{ background: 'none', border: 'none', color: '#334155', fontSize: '13px', cursor: 'pointer' }}
          >
            Retake the assessment
          </button>
        </div>

      </div>
    </main>
  )
}