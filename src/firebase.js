// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const firestoreInstance = getFirestore(app);  // Renaming firestore to firestoreInstance to avoid conflicts
const storage = getStorage(app);

// Export services
export { auth, firestoreInstance as firestore, storage };
