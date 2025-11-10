// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDK305ERtURz2bdM39xDbj4-XOrqv7MzQ4",
  authDomain: "pesca-azul.firebaseapp.com",
  projectId: "pesca-azul",
  storageBucket: "pesca-azul.firebasestorage.app",
  messagingSenderId: "375579846440",
  appId: "1:375579846440:web:82487203351c9ffc3f121d",
  measurementId: "G-MB4QVNG9CV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);

// Initialize Storage
export const storage = getStorage(app);

export default app;