"use client"

import { useAuth } from '@/contexts/AuthContext'
import { sendEmailVerification } from 'firebase/auth'
import { useState } from 'react'

export default function EmailVerification() {
  const { user } = useAuth()
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSendVerification = async () => {
    if (!user) return
    setSending(true)
    setError('')
    setSuccess('')
    
    try {
      await sendEmailVerification(user)
      setSuccess('Verification email sent! Please check your inbox.')
    } catch (error: any) {
      setError('Failed to send verification email. Please try again later.')
    } finally {
      setSending(false)
    }
  }

  if (!user || user.emailVerified) return null

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            Please verify your email address to access all features.
          </p>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          {success && <p className="mt-1 text-sm text-green-600">{success}</p>}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleSendVerification}
              disabled={sending}
              className="text-sm font-medium text-yellow-700 hover:text-yellow-600 disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Resend verification email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 