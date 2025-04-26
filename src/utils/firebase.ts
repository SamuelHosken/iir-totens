import { db } from '@/lib/firebase';
import { collection } from 'firebase/firestore';

export const COLLECTIONS = {
  TOTENS: 'totens',
  SCHEDULES: 'schedules'
} as const;

export const scheduleCollection = collection(db, COLLECTIONS.SCHEDULES);
export const totemCollection = collection(db, COLLECTIONS.TOTENS); 