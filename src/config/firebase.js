import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDyHMERrq5lSMAJDY9tTNWT6dv7zR5E1T0",
  authDomain: "real-time-chat-8782d.firebaseapp.com",
  projectId: "real-time-chat-8782d",
  storageBucket: "real-time-chat-8782d.firebasestorage.app",
  messagingSenderId: "238990372955",
  appId: "1:238990372955:web:d4d5337eba8412912a4f7e",
  measurementId: "G-X0SX0GSS1S"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
