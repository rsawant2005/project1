import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "authsurbhi.firebaseapp.com",
  projectId: "authsurbhi",
  storageBucket: "authsurbhi.firebasestorage.app",
  messagingSenderId: "863946107257",
  appId: "1:863946107257:web:61d9eb02159b9d645967a8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
