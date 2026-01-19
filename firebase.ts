// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAMXM0xWW71SmSTMdd1u-qbFB6emb-Lmfs",
  authDomain: "code-axis-web.firebaseapp.com",
  projectId: "code-axis-web",
  storageBucket: "code-axis-web.firebasestorage.app",
  messagingSenderId: "949198147772",
  appId: "1:949198147772:web:3b7cc71d377282791080b9"
};

const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
