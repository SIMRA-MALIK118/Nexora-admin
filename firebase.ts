// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCcG-AhoJ9Q_enaVmOgQU2ph8QJl-JiUhM",
  authDomain: "nexora-website-51e26.firebaseapp.com",
  projectId: "nexora-website-51e26",
  storageBucket: "nexora-website-51e26.firebasestorage.app",
  messagingSenderId: "490615831993",
  appId: "1:490615831993:web:f76d72dc0c9945a4294a68",
  measurementId: "G-S9GTGGF16L"
};

const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;