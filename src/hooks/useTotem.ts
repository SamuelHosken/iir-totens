import useSWR from 'swr';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Totem } from '@/types';

const fetcher = async (id: string) => {
  const docRef = doc(db, 'totens', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Totem;
};

export function useTotem(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `totens/${id}` : null,
    () => fetcher(id)
  );

  return {
    totem: data,
    loading: isLoading,
    error,
    mutate
  };
} 