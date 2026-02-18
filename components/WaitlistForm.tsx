"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from("waitlist")
      .insert([{ email }])

    if (!error) {
      setSuccess(true)
      setEmail("")
    }

    setLoading(false)
  }

  if (success) {
    return <p>You’re in. Access coming soon.</p>
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        required
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Joining..." : "Claim Free Access"}
      </button>
    </form>
  )
}