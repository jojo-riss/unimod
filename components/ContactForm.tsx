'use client'

import { useState, useRef } from 'react'

const inputClass = "w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[#f0ede8] text-sm placeholder-[#888] outline-none focus:border-[rgba(232,93,47,0.5)] focus:ring-2 focus:ring-[rgba(232,93,47,0.1)] transition"

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    const form = formRef.current!
    const formData = new FormData(form)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          organization: formData.get('organization'),
          interest: formData.get('interest'),
          message: formData.get('message'),
        }),
      })

      if (!res.ok) throw new Error()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form ref={formRef} className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <input type="text" name="firstName" placeholder="First name" required className={inputClass} />
        <input type="text" name="lastName" placeholder="Last name" required className={inputClass} />
      </div>
      <input type="email" name="email" placeholder="Email address" required className={inputClass} />
      <input type="text" name="organization" placeholder="Organization (optional)" className={inputClass} />
      <select name="interest" className={`${inputClass} text-[#888]`}>
        <option value="" disabled>I&apos;m interested in…</option>
        <option>Vehicle Propulsion Systems</option>
        <option>Building Energy Solutions</option>
        <option>Investment Opportunities</option>
        <option>Research &amp; Partnership</option>
        <option>General Inquiry</option>
      </select>
      <textarea name="message" placeholder="Tell us about your project or question…" rows={5} className={`${inputClass} resize-y`} />
      <button
        type="submit"
        disabled={status === 'sending' || status === 'sent'}
        className={`w-full text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer ${
          status === 'sent' ? 'bg-[#2a7a4b]' :
          status === 'error' ? 'bg-red-600 hover:bg-red-500' :
          status === 'sending' ? 'bg-[#888] cursor-wait' :
          'bg-[#e85d2f] hover:bg-[#f0923a]'
        }`}
      >
        {status === 'sent' ? 'Message sent ✓' :
         status === 'error' ? 'Failed — try again' :
         status === 'sending' ? 'Sending...' :
         'Send Message →'}
      </button>
    </form>
  )
}
