// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAvVw1DJLHNqcb0xK2E6-_CueMwAtJINSQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "aura-ai-e7bfd.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "aura-ai-e7bfd",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "aura-ai-e7bfd.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "701518246816",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:701518246816:web:6f0535f38727d7a9b46ac5",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-QQX5WJ8FQX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup };