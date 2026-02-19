'use client'
import WaitlistForm from "@/components/WaitlistForm"
export default function Home() {
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
        MindMarg — Life Blueprint
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
        Misaligned With<br />Your Own Life?
      </h1>

      {/* Subheadline */}
      <p style={{
        fontSize: 'clamp(15px, 2vw, 19px)',
        color: '#94a3b8',
        maxWidth: '580px',
        lineHeight: '1.7',
        marginBottom: '16px',
        fontFamily: 'system-ui, sans-serif',
      }}>
        12 fast questions. Get a personalized{' '}
        <strong style={{ color: '#f97316', fontWeight: '600' }}>Life Blueprint</strong>{' '}
        — your patterns, your blind spots, and your next 3 moves.
        <br />
        <span style={{ color: '#64748b', fontSize: '14px' }}>
          For the generation that was never taught how to choose for themselves.
        </span>
      </p>

      {/* Teaser Question */}
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

      {/* Single CTA Button */}
      <a href="/quiz" style={{
        display: 'inline-block',
        padding: '16px 40px',
        borderRadius: '12px',
        background: '#f97316',
        color: 'white',
        fontWeight: '700',
        fontSize: '16px',
        textDecoration: 'none',
        fontFamily: 'system-ui, sans-serif',
      }}>
        Decode My Mindset — Free →
      </a>

      {/* Trust line */}
      <p style={{
        marginTop: '12px',
        color: '#475569',
        fontSize: '12px',
        fontFamily: 'system-ui, sans-serif',
      }}>
        ✦ 5 min &nbsp;·&nbsp; ✦ No account needed &nbsp;·&nbsp; ✦ Free during beta
      </p>

      {/* Bottom social proof */}
      <div style={{
        marginTop: '60px',
        display: 'flex',
        gap: '40px',
        color: '#334155',
        fontSize: '13px',
        fontFamily: 'system-ui, sans-serif',
      }}>
        <span>🔒 Your data stays private. We never sell it.</span>
        <span>🇮🇳 Made for India</span>
        <span>🧠 Powered by AI</span>
      </div>

    </main>
  )
}