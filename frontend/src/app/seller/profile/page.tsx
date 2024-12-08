'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { sellersService, Seller } from '@/lib/services/sellers'
import EmailVerification from '@/app/components/EmailVerification'

export default function SellerProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    const loadProfile = async () => {
      try {
        const seller = await sellersService.getCurrent()
        if (seller) {
          setFormData({
            name: seller.name || '',
            email: seller.email || '',
            phone: seller.phone || '',
            address: seller.address || ''
          })
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const seller = await sellersService.getCurrent()
      if (seller) {
        await sellersService.update(formData)
      } else {
        await sellersService.create(formData)
      }
      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving profile:', error)
      setError('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user?.emailVerified) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmailVerification />
        <div className="opacity-50 pointer-events-none">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 
                  focus:ring-purple-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 
                  focus:ring-purple-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 
                  focus:ring-purple-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                name="address"
                id="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 
                  focus:ring-purple-500 sm:text-sm"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={saving}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                  shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Seller Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 
              focus:ring-purple-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 
              focus:ring-purple-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 
              focus:ring-purple-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            name="address"
            id="address"
            rows={3}
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 
              focus:ring-purple-500 sm:text-sm"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={saving}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
              shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
} 