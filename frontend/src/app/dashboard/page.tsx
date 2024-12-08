"use client"

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'
import Image from 'next/image'

interface UserProfile {
  displayName: string
  email: string
  photoURL: string
  // ... other profile fields
}

export default function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return
      try {
        const profileRef = doc(db, 'users', user.uid)
        const profileSnap = await getDoc(profileRef)
        if (profileSnap.exists()) {
          setProfile(profileSnap.data() as UserProfile)
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="relative h-32 w-32">
              <Image
                src={profile?.photoURL || '/default-avatar.png'}
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
                Welcome, {profile?.displayName || 'User'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 font-inter">
                {profile?.email}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/sell" 
              className="bg-purple-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-all">
              <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">
                Sell Items
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                List your pre-loved items for sale
              </p>
            </Link>

            <Link href="/seller/products"
              className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-all">
              <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
                My Products
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your listed items
              </p>
            </Link>

            <Link href="/profile"
              className="bg-green-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-all">
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">
                Edit Profile
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Update your profile information
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 