// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDEEhwbYYfaQNsTtZJK2h9N0OofK5LpMco",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "banglish-to-bangla-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "banglish-to-bangla-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "banglish-to-bangla-app.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "271380650195",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:271380650195:web:174bbfc9965ed1f8ef9c26",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-03ZTWH6ZQ1"
};

// Initialize Firebase with error handling
let app;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  if (typeof window !== 'undefined' && 'gtag' in window) {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.warn('Firebase initialization failed:', error);
  // Create a mock app object for development
  app = null;
}

export default app;