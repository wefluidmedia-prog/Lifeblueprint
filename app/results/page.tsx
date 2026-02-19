'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import WaitlistForm from "@/components/WaitlistForm"
import { getSupabase } from "@/lib/supabase"

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

// true = high score is good (green), false = high score is a watch-out (orange)
const TRAIT_HIGH_IS_GOOD: Record<string, boolean> = {
  creative_drive: true,
  execution_capacity: true,
  rumination_index: false,
  external_validation: false,
  autonomy_orientation: true,
  action_orientation: true,
}

// Dynamic color based on how well the user is actually doing on each trait
function getTraitColor(key: string, value: number): string {
  const highIsGood = TRAIT_HIGH_IS_GOOD[key]
  const wellness = highIsGood ? value / 100 : 1 - value / 100
  if (wellness >= 0.6)  return '#22c55e'  // green  — strong
  if (wellness >= 0.35) return '#eab308'  // yellow — middle ground
  return '#f97316'                         // orange — watch this
}

function getTraitStatusLabel(key: string, value: number): { text: string; color: string } {
  const highIsGood = TRAIT_HIGH_IS_GOOD[key]
  const wellness = highIsGood ? value / 100 : 1 - value / 100
  if (wellness >= 0.6)  return { text: '● Strong',        color: '#166534' }
  if (wellness >= 0.35) return { text: '● Room to grow',  color: '#713f12' }
  return                       { text: '● Watch this',    color: '#9a3412' }
}

async function trackEvent(event: string, properties?: Record<string, unknown>) {
  const supabase = getSupabase()
  if (!supabase) return
  await supabase
    .from('analytics_events')
    .insert([{ event, properties: properties ?? {}, created_at: new Date().toISOString() }])
}

const CACHE_KEY = 'mindmarg_report_cache'

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

    // Check cache first — reuse report if answers haven't changed
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { answersHash, report: cachedReport, scores: cachedScores } = JSON.parse(cached)
        if (answersHash === stored) {
          setReport(cachedReport)
          setScores(cachedScores)
          setLoading(false)
          return
        }
      }
    } catch {
      // cache corrupted — regenerate
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
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            answersHash: stored,
            report: data.report,
            scores: data.scores,
          }))
          trackEvent('quiz_completed', { scores: data.scores })
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Something went wrong. Please try again.')
        setLoading(false)
      })
  }, [router])

  const handleUnlock = () => {
    setUnlocked(true)
    trackEvent('report_unlocked')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getTeaserText = (fullReport: string) => {
    const lines = fullReport.split('\n').filter(Boolean)
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

  const renderReportLines = (text: string) =>
    text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return (
          <h2 key={i} style={{
            fontSize: '17px', fontWeight: '700', color: '#f97316',
            marginTop: '28px', marginBottom: '10px', fontFamily: 'Georgia, serif',
            letterSpacing: '-0.3px',
          }}>
            {line.replace('## ', '')}
          </h2>
        )
      }
      if (line.trim() === '') return <br key={i} />
      const parts = line.split(/(\*\*[^*]+\*\*)/g)
      return (
        <p key={i} style={{ color: '#94a3b8', marginBottom: '8px', lineHeight: 1.75, fontSize: '15px' }}>
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**')
              ? <strong key={j} style={{ color: '#e2e8f0', fontWeight: '600' }}>{part.replace(/\*\*/g, '')}</strong>
              : part
          )}
        </p>
      )
    })

  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #07071a 0%, #130a22 55%, #070d1a 100%)',
    padding: '48px 20px 80px',
    fontFamily: 'system-ui, sans-serif',
    color: 'white',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <div style={{ width: '100%', maxWidth: '640px' }}>
          <div style={{ textAlign: 'center', paddingTop: '80px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              border: '2px solid rgba(249,115,22,0.15)',
              borderTopColor: '#f97316',
              margin: '0 auto 28px',
              animation: 'spin 0.9s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '6px' }}>
              Building your psychological blueprint…
            </p>
            <p style={{ color: '#1e293b', fontSize: '13px' }}>Takes about 15 seconds</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main style={pageStyle}>
        <div style={{ width: '100%', maxWidth: '640px' }}>
          <div style={{ textAlign: 'center', paddingTop: '80px' }}>
            <p style={{ color: '#f87171', marginBottom: '16px' }}>{error}</p>
            <button
              onClick={() => router.push('/quiz')}
              style={{
                background: '#f97316', color: 'white', border: 'none',
                padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600',
              }}
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
    <main style={pageStyle}>
      <div style={{ width: '100%', maxWidth: '640px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span style={{
            fontSize: '10px', letterSpacing: '3px', color: '#f97316',
            textTransform: 'uppercase', fontWeight: 600,
          }}>
            Your Psychological Blueprint
          </span>
          <h1 style={{
            fontSize: 'clamp(22px, 5vw, 34px)', fontWeight: '700',
            fontFamily: 'Georgia, serif', marginTop: '10px', lineHeight: 1.2,
            letterSpacing: '-0.5px',
          }}>
            Here's What Your Answers Reveal
          </h1>
        </div>

        {/* Score Cards */}
        {scores && (
          <div style={{ marginBottom: '44px' }}>
            {/* Legend */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginBottom: '12px' }}>
              {[
                { color: '#22c55e', label: 'Strong' },
                { color: '#eab308', label: 'Middle' },
                { color: '#f97316', label: 'Watch this' },
              ].map(({ color, label }) => (
                <span key={label} style={{ fontSize: '11px', color: '#334155', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, display: 'inline-block' }} />
                  {label}
                </span>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {Object.entries(scores).map(([key, value]) => {
                const color = getTraitColor(key, value)
                const status = getTraitStatusLabel(key, value)
                return (
                  <div key={key} style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: `1px solid ${color}30`,
                    borderRadius: '12px',
                    padding: '14px 16px',
                  }}>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', fontWeight: '500' }}>
                      {TRAIT_LABELS[key]}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        flex: 1, height: '5px',
                        background: 'rgba(255,255,255,0.06)',
                        borderRadius: '999px', overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%', width: `${value}%`,
                          background: color, borderRadius: '999px',
                          transition: 'width 1.2s ease',
                        }} />
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: color, minWidth: '28px', textAlign: 'right' }}>
                        {value}
                      </span>
                    </div>
                    <div style={{
                      marginTop: '6px', fontSize: '10px',
                      color: status.color,
                      letterSpacing: '0.4px',
                    }}>
                      {status.text}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Report */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            padding: '28px 32px',
          }}>
            {unlocked ? (
              <div>{renderReportLines(report!)}</div>
            ) : (
              <div>
                <div>{renderReportLines(teaserText)}</div>
                <div style={{
                  height: '120px',
                  background: 'linear-gradient(to bottom, transparent, #090914)',
                  marginTop: '-80px',
                  position: 'relative',
                  zIndex: 1,
                }} />
                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                  <p style={{ color: '#334155', fontSize: '13px' }}>
                    2 more sections locked — your patterns and your next 3 moves
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Email Unlock CTA */}
        {!unlocked && (
          <div style={{
            background: 'rgba(249,115,22,0.05)',
            border: '1px solid rgba(249,115,22,0.18)',
            borderRadius: '16px',
            padding: '28px 32px',
            textAlign: 'center',
          }}>
            <h3 style={{
              fontSize: '19px', fontWeight: '700',
              fontFamily: 'Georgia, serif', marginBottom: '8px', marginTop: 0,
            }}>
              Get Your Complete Blueprint — Free
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
              Join early users. Full report unlocks instantly.
            </p>
            <WaitlistForm onSuccess={handleUnlock} />
          </div>
        )}

        {/* Retake */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={() => {
              localStorage.removeItem('mindmarg_answers')
              localStorage.removeItem(CACHE_KEY)
              router.push('/quiz')
            }}
            style={{ background: 'none', border: 'none', color: '#1e293b', fontSize: '13px', cursor: 'pointer' }}
          >
            Retake the assessment
          </button>
        </div>

      </div>
    </main>
  )
}