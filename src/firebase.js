// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACY2-LqX5GdMZqgopYLkyde4f08Ol_osk",
  authDomain: "target-lock-96ada.firebaseapp.com",
  projectId: "target-lock-96ada",
  storageBucket: "target-lock-96ada.firebasestorage.app",
  messagingSenderId: "777978587727",
  appId: "1:777978587727:web:26c310045b84fdad56583a",
  measurementId: "G-9CGGHZ9W7V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);

// Initialize Cloud Firestore and export it
export const db = getFirestore(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
