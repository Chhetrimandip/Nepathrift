"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db, storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { sendEmailVerification } from 'firebase/auth'
import Image from 'next/image'

interface UserProfile {
  displayName: string
  email: string
  photoURL: string
  phoneNumber: string
  address: string
  bio: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<UserProfile>({
    displayName: '',
    email: '',
    photoURL: '',
    phoneNumber: '',
    address: '',
    bio: ''
  })

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return
      setLoading(true)
      try {
        console.log('Loading profile for:', user.uid)
        
        const profileRef = doc(db, 'users', user.uid)
        const profileSnap = await getDoc(profileRef)
        
        if (profileSnap.exists()) {
          const data = profileSnap.data()
          console.log('Profile data:', data)
          setProfile(data as UserProfile)
        } else {
          console.log('Creating new profile')
          const initialProfile = {
            displayName: user.displayName || '',
            email: user.email || '',
            photoURL: user.photoURL || '',
            phoneNumber: '',
            address: '',
            bio: '',
            uid: user.uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          await setDoc(profileRef, initialProfile)
          setProfile(initialProfile)
        }
      } catch (error: any) {
        console.error('Profile loading error:', error)
        setError('Failed to load profile. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  
    if (user) {
      loadProfile()
    }
  }, [user])

  // ... rest of your component code


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)

    try {
      const profileRef = doc(db, 'users', user.uid)
      await updateDoc(profileRef, {
        ...profile,
        updatedAt: new Date().toISOString()
      })
      setError('')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving profile:', error)
      setError('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return
      router.push('/dashboard')
    try {
      const file = e.target.files[0]
      const storageRef = ref(storage, `users/${user.uid}/profile-image`)
      await uploadBytes(storageRef, file)
      const photoURL = await getDownloadURL(storageRef)
      
      setProfile(prev => ({ ...prev, photoURL }))
      
      const profileRef = doc(db, 'users', user.uid)
      await updateDoc(profileRef, { 
        photoURL,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      setError('Failed to upload image')
    }
    }


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Profile Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="flex items-center space-x-6">
          <div className="relative h-24 w-24">
            <Image
              src={profile.photoURL || '/default-avatar.png'}
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-purple-50 file:text-purple-700
                hover:file:bg-purple-100
                dark:file:bg-gray-700 dark:file:text-purple-300"
            />
          </div>
        </div>

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={profile.displayName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
              shadow-sm focus:border-purple-500 focus:ring-purple-500 
              dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
              shadow-sm focus:border-purple-500 focus:ring-purple-500 
              dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
              shadow-sm focus:border-purple-500 focus:ring-purple-500 
              dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            value={profile.address}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
              shadow-sm focus:border-purple-500 focus:ring-purple-500 
              dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={profile.bio}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
              shadow-sm focus:border-purple-500 focus:ring-purple-500 
              dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={saving}
            className="w-full flex justify-center py-2 px-4 border border-transparent 
              rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 
              hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
} 
