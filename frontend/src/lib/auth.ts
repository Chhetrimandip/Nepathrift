import { auth } from './firebase-client';
import { User } from 'firebase/auth';

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