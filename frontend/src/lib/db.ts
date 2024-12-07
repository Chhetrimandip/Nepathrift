import { db } from './firebase-client';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

// Export the db instance
export { db };

export const order = {
  async create(data: any) {
    return await addDoc(collection(db, 'orders'), {
      ...data,
      createdAt: new Date(),
    });
  },

  async update(id: string, data: any) {
    const docRef = doc(db, 'orders', id);
    return await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  },

  async delete(id: string) {
    const docRef = doc(db, 'orders', id);
    return await deleteDoc(docRef);
  }
}; 