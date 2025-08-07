// src/app/verify/page.tsx

'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function VerifyPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [callbackUrl, setCallbackUrl] = useState('/')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Parse URL parameters on the client side
    const urlParams = new URLSearchParams(window.location.search)
    setEmail(urlParams.get('email') || '')
    setCallbackUrl(urlParams.get('callbackUrl') || '/')
  }, [])

  const handleVerify = async () => {
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    })

    const data = await res.json()

    if (data.success) {
      setMessage('Verification successful! Redirecting...')
      setTimeout(() => router.push(callbackUrl), 1500)
    } else {
      setMessage(data.error || 'Verification failed.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Verify Your Account</h2>
        <p className="mb-4 text-gray-600">
          Enter the 6-digit code we sent to {email}
        </p>

        <input
          type="text"
          className="w-full px-4 py-2 border rounded mb-4"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter verification code"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}
      </div>
    </div>
  )
}