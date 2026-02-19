"use client"

import { useState } from "react"
import { getSupabase } from "@/lib/supabase"

interface WaitlistFormProps {
  onSuccess?: () => void
}

export default function WaitlistForm({ onSuccess }: WaitlistFormProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = getSupabase()

    if (!supabase) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
      return
    }

    const { error: dbError } = await supabase
      .from("waitlist")
      .insert([{ email, joined_at: new Date().toISOString() }])

    if (dbError && dbError.code !== "23505") {
      // 23505 = unique violation (already signed up) — treat as success
      setError("Something went wrong. Please try again.")
      setLoading(false)
      return
    }

    // Track the signup event in analytics
    await supabase
      .from("analytics_events")
      .insert([{ event: "email_signup", properties: { email } }])
      .then(() => {}) // fire-and-forget

    setSuccess(true)
    setEmail("")
    onSuccess?.()
    setLoading(false)
  }

  if (success) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        padding: "12px 0",
      }}>
        <div style={{ fontSize: "28px" }}>✦</div>
        <p style={{
          color: "#f97316",
          fontWeight: "700",
          fontSize: "16px",
          margin: 0,
        }}>
          You're in. Unlocking your full report…
        </p>
        <p style={{ color: "#475569", fontSize: "13px", margin: 0 }}>
          Check your inbox — we'll send updates before public launch.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}
    >
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            flex: "1",
            minWidth: "220px",
            padding: "13px 18px",
            borderRadius: "10px",
            border: "1px solid rgba(249, 115, 22, 0.3)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
            fontSize: "15px",
            outline: "none",
            fontFamily: "system-ui, sans-serif",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "13px 28px",
            borderRadius: "10px",
            background: loading ? "rgba(249,115,22,0.5)" : "#f97316",
            color: "white",
            fontWeight: "700",
            fontSize: "15px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "system-ui, sans-serif",
            whiteSpace: "nowrap",
            transition: "opacity 0.2s",
          }}
        >
          {loading ? "Joining…" : "Unlock Full Report →"}
        </button>
      </div>

      {error && (
        <p style={{ color: "#f87171", fontSize: "13px", textAlign: "center", margin: 0 }}>
          {error}
        </p>
      )}

      <p style={{ color: "#334155", fontSize: "12px", textAlign: "center", margin: 0 }}>
        ✦ Free during beta &nbsp;·&nbsp; ✦ No spam, ever &nbsp;·&nbsp; ✦ Unsubscribe anytime
      </p>
    </form>
  )
}