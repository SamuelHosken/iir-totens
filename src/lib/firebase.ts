import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Analytics, getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDK6ysfNMV4H_E5zcjdbClkoI1M-AWrr5k",
  authDomain: "iir-lab-totens.firebaseapp.com",
  projectId: "iir-lab-totens",
  storageBucket: "iir-lab-totens.firebasestorage.app",
  messagingSenderId: "502917274220",
  appId: "1:502917274220:web:3086e183524a85eebc1649",
  measurementId: "G-QJZYLVC8T6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicialize o Analytics apenas no lado do cliente
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export { analytics }; 