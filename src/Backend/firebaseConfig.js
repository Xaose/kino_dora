import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Конфигурация Firebase берётся из .env
const firebaseConfig = {
  apiKey: "AIzaSyBhfy8kJNuxV-WRgTi7wFIUrLwc4F7mKG8",
  authDomain: "kinodora-f17a8.firebaseapp.com",
  projectId: "kinodora-f17a8",
  storageBucket: "kinodora-f17a8.firebasestorage.app",
  messagingSenderId: "527999601660",
  appId: "1:527999601660:web:43e21649b08df113b18079",
  measurementId: "G-77B9L6TNVS"
};

const app = initializeApp(firebaseConfig);

// Analytics доступен только в браузере
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  getAnalytics(app);
}

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
