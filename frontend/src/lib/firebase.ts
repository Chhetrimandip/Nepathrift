"use client"

import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

console.log('Firebase config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey?.slice(0, 5) + '...' // Only show first 5 chars of API key
})

// Initialize Firebase
let app: FirebaseApp

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    setPersistence(auth, browserLocalPersistence)
      .catch((error) => {
        console.error('Error setting auth persistence:', error)
      })
  } else {
    app = getApps()[0]
  }
} catch (error) {
  console.error('Firebase initialization error:', error)
  throw new Error('Failed to initialize Firebase')
}

export const auth = getAuth(app)
export const db = getFirestore(app)
export const functions = getFunctions(app)
export const storage = getStorage(app)

export default app