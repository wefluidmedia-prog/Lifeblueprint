"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email captured:", email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-bold mb-6">
        Feel Misaligned With Your Own Life?
      </h1>

      <p className="text-xl text-gray-300 max-w-xl mb-8">
        Discover your Core Identity Pattern and understand why
        your life feels out of sync.
      </p>

      {submitted ? (
        <p className="text-green-400 text-lg">
          You’re in. Early access launching soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="px-4 py-3 rounded-lg w-64 bg-zinc-900 text-white border border-zinc-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Get Early Access
          </button>
        </form>
      )}
    </div>
  );
}