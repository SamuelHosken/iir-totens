import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Analytics, getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDK6ysfNMV4H_E5zcjdbClkoI1M-AWrr5k",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "iir-lab-totens.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "iir-lab-totens",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "iir-lab-totens.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "502917274220",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:502917274220:web:3086e183524a85eebc1649",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-QJZYLVC8T6"
};

// Initialize Firebase apenas se não existir
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Inicialize o Analytics apenas no lado do cliente
let analytics: Analytics | undefined;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export { analytics }; 