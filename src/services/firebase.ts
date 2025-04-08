import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_COLLECTIONS } from '@/constants';
import { Totem, TotemFormData } from '@/types';

export const totemService = {
  async getAll(): Promise<Totem[]> {
    const querySnapshot = await getDocs(collection(db, FIREBASE_COLLECTIONS.TOTENS));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Totem[];
  },

  async getById(id: string): Promise<Totem | null> {
    const docRef = doc(db, FIREBASE_COLLECTIONS.TOTENS, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Totem;
  },

  async create(id: string, data: TotemFormData): Promise<void> {
    await setDoc(doc(db, FIREBASE_COLLECTIONS.TOTENS, id), {
      ...data,
      cronograma: []
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, FIREBASE_COLLECTIONS.TOTENS, id));
  }
}; 