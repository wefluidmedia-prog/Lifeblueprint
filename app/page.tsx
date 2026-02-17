'use client'
import { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO Week 2: Connect to Supabase here
    console.log('Email captured:', email)
    setSubmitted(true)
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
      fontFamily: 'Georgia, serif',
      color: 'white',
      textAlign: 'center',
    }}>

      {/* Top Label */}
      <p style={{
        fontSize: '11px',
        letterSpacing: '4px',
        color: '#f97316',
        textTransform: 'uppercase',
        marginBottom: '24px',
        fontFamily: 'system-ui, sans-serif',
      }}>
        MindMarg — AI Life Blueprint
      </p>

      {/* Main Headline */}
      <h1 style={{
        fontSize: 'clamp(32px, 6vw, 64px)',
        fontWeight: '700',
        lineHeight: '1.15',
        maxWidth: '780px',
        marginBottom: '20px',
        letterSpacing: '-1px',
      }}>
        Feel Misaligned With<br />Your Own Life?
      </h1>

      {/* Subheadline — UPDATED */}
      <p style={{
        fontSize: 'clamp(15px, 2vw, 19px)',
        color: '#94a3b8',
        maxWidth: '580px',
        lineHeight: '1.7',
        marginBottom: '16px',
        fontFamily: 'system-ui, sans-serif',
      }}>
        Answer 15 questions. Our AI analyzes your mindset and delivers a 
        personalized <strong style={{ color: '#e2e8f0' }}>Life Blueprint</strong> — 
        your patterns, your blind spots, and your next 3 moves.
        <br /><span style={{ color: '#64748b', fontSize: '14px' }}>
          For the generation that was never taught how to choose for themselves.
        </span>
      </p>

      {/* Teaser Question — NEW */}
      <div style={{
        background: 'rgba(249, 115, 22, 0.08)',
        border: '1px solid rgba(249, 115, 22, 0.25)',
        borderRadius: '12px',
        padding: '16px 28px',
        maxWidth: '520px',
        marginBottom: '36px',
        fontStyle: 'italic',
        color: '#cbd5e1',
        fontSize: '15px',
        lineHeight: '1.6',
        fontFamily: 'Georgia, serif',
      }}>
        "Ever made a decision that felt right to everyone — except you?"
      </div>

      {/* Form or Success State */}
      {submitted ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ 
            color: '#34d399', 
            fontSize: '18px', 
            marginBottom: '8px',
            fontWeight: '600' 
          }}>
            ✓ You're in.
          </p>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Quiz goes live in 3 days. Watch your inbox.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
          maxWidth: '480px',
        }}>
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                padding: '14px 18px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                fontFamily: 'system-ui, sans-serif',
              }}
            />
            <button type="submit" style={{
              padding: '14px 24px',
              borderRadius: '10px',
              background: '#f97316',
              color: 'white',
              fontWeight: '700',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'system-ui, sans-serif',
              whiteSpace: 'nowrap',
            }}>
              Get Early Access
            </button>
          </div>

          {/* Trust line */}
          <p style={{ 
            color: '#475569', 
            fontSize: '12px',
            fontFamily: 'system-ui, sans-serif',
          }}>
            ✦ 10 min quiz &nbsp;·&nbsp; ✦ AI report to your inbox &nbsp;·&nbsp; ✦ First 50 users get it free
          </p>
        </form>
      )}

      {/* Bottom social proof — placeholder */}
      <div style={{
        marginTop: '60px',
        display: 'flex',
        gap: '40px',
        color: '#334155',
        fontSize: '13px',
        fontFamily: 'system-ui, sans-serif',
      }}>
        <span>🔒 No spam. Ever.</span>
        <span>🇮🇳 Made for India</span>
        <span>🧠 Powered by AI</span>
      </div>

    </main>
  )
}