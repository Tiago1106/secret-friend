import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || !process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || !process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || !process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || !process.env.NEXT_PUBLIC_FIREBASE_APP_ID || !process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
  throw new Error('Firebase config is not set');
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

auth.languageCode = 'pt-BR';

export { auth };