import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

if (!process.env.FIREBASE_PROJECT_ID) {
  throw new Error('Missing FIREBASE_PROJECT_ID environment variable');
}

if (!process.env.FIREBASE_CLIENT_EMAIL) {
  throw new Error('Missing FIREBASE_CLIENT_EMAIL environment variable');
}

if (!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error('Missing FIREBASE_PRIVATE_KEY environment variable');
}

try {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  throw new Error('Failed to initialize Firebase Admin');
}

export const adminAuth = getAuth();
export const adminDb = getFirestore(); 