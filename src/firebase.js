// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJr0hP-KIDLGc4eo3sDGWQkO7zobnKBZQ",
  authDomain: "project-management-tool-63c40.firebaseapp.com",
  projectId: "project-management-tool-63c40",
  storageBucket: "project-management-tool-63c40.firebasestorage.app",
  messagingSenderId: "646477257627",
  appId: "1:646477257627:web:eb7db3a1eb30473ba05f3e",
  measurementId: "G-QQKBENYLME"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

