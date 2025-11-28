// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase untuk cimoysehat.com
// Konfigurasi Firebase untuk cimoysehat.com
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};


// Inisialisasi Firebase
export const app = initializeApp(firebaseConfig);

// Inisialisasi Firestore (database realtime)
export const db = getFirestore(app);