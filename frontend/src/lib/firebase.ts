"use client"

import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'
import { getStorage } from 'firebase/storage'

let firebase_app: FirebaseApp | null = null

export function getFirebaseApp() {
  if (!firebase_app) {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    }

    try {
      firebase_app = initializeApp(firebaseConfig)
      console.log('Firebase initialized successfully')
    } catch (error) {
      console.error('Firebase initialization error:', error)
      console.log('Firebase config:', firebaseConfig)
      throw new Error('Failed to initialize Firebase')
    }
  }
  return firebase_app
}

const app = getFirebaseApp()
if (!app) {
  throw new Error('Firebase app not initialized')
}

export const auth = getAuth(app)
export const db = getFirestore(app)
export const functions = getFunctions(app)
export const storage = getStorage(app)

export default app