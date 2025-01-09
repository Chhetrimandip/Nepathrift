import { auth } from './firebase';
import { User } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export async function getAuthUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const user = await getAuthUser();
  if (!user) return null;
  return user;
}

export async function getCurrentUserInfo() {
  const user = await getAuthUser();
  if (!user) return null;
  
  return {
    user: {
      id: user.uid,
      email: user.email,
    }
  };
}

export { auth };

const loginUser = async (email: string, password: string) => {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Check if the user is an admin based on their email
    const isAdmin = email.includes("4nepathrift");

    if (isAdmin) {
        // Redirect to admin homepage
        window.location.href = '/admin'; // Adjust the path to your admin homepage
    } else {
        // Redirect to regular user homepage
        window.location.href = '/dashboard'; // Adjust the path to your user homepage
    }
};

export const registerUser = async (email: string, password: string) => {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Store user data in Firestore without the isAdmin field
    await setDoc(doc(db, 'users', userId), {
        email,
        // Remove isAdmin field
    });
};