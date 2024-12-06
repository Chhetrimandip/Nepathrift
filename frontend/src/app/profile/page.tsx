"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import Image from "next/image"
import { Camera } from "lucide-react"

interface UserProfile {
  displayName: string
  phoneNumber: string
  email: string
  photoURL: string
  bio: string
  address: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    displayName: "",
    phoneNumber: "",
    email: "",
    photoURL: "",
    bio: "",
    address: ""
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
      return
    }

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setProfile({
            ...docSnap.data() as UserProfile,
            email: user.email || ""
          })
        } else {
          setProfile({
            displayName: user.displayName || "",
            phoneNumber: user.phoneNumber || "",
            email: user.email || "",
            photoURL: user.photoURL || "/default-avatar.png",
            bio: "",
            address: ""
          })
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, router])

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    try {
      setUploading(true)
      const storage = getStorage()
      
      // Create a storage reference with a unique filename
      const fileExtension = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExtension}`
      const storageRef = ref(storage, `profile-images/${user.uid}/${fileName}`)
      
      // Set the appropriate metadata including content type
      const metadata = {
        contentType: file.type,
        cacheControl: 'public,max-age=7200'
      }

      await uploadBytes(storageRef, file, metadata)
      const downloadURL = await getDownloadURL(storageRef)
      
      setProfile(prev => ({
        ...prev,
        photoURL: downloadURL
      }))

      // Update the profile with new photo URL
      const userRef = doc(db, "users", user.uid)
      await setDoc(userRef, {
        ...profile,
        photoURL: downloadURL,
        updatedAt: new Date().toISOString()
      }, { merge: true })

    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      await setDoc(doc(db, "users", user.uid), {
        ...profile,
        updatedAt: new Date().toISOString()
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-purple-600 hover:text-purple-800"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="relative w-32 h-32 group">
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src={profile.photoURL || "/default-avatar.png"}
                alt="Profile"
                fill
                className="object-cover"
              />
              {isEditing && (
                <div 
                  onClick={handleImageClick}
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="displayName"
                value={profile.displayName}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
} 