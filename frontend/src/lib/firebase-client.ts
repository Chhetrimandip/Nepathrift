'use client'

import { getFirebaseApp } from './firebase'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'
import { getStorage } from 'firebase/storage'

const app = getFirebaseApp()

if (!app) {
  throw new Error('Firebase app not initialized')
}

export const auth = getAuth(app)
export const db = getFirestore(app)
export const functions = getFunctions(app)
export const storage = getStorage(app)

export default app 
//dummy comment
