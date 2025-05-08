import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';  // Updated import
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const signup = async (username, email, password) => {
    try {
      // 🔍 Check if username already exists
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('username', '==', username.trim()));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        throw new Error('Username already taken. Please choose another.');
      }
  
      // ✅ Proceed to create user
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;
  
      const userData = {
        id: uid,
        username,
        email,
        avatar: `https://i.pravatar.cc/150?u=${uid}`,
        status: 'Online',
        createdAt: serverTimestamp(),
        groups: []
      };
  
      // Save user data to Firestore
      await setDoc(doc(firestore, 'users', uid), userData);
  
      // Update Firebase Auth profile
      await updateProfile(userCred.user, {
        displayName: username,
      });
  
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      console.error("Error during signup:", error);
      throw new Error(error.message || 'Signup failed');
    }
  };
  


  // Login: Auth + Fetch Firestore profile
  const login = async (email, password) => {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;

    // Log login timestamp
    await addDoc(collection(firestore, 'users', uid, 'logins'), {
      timestamp: serverTimestamp()
    });

    // Fetch user data from Firestore
    const docSnap = await getDoc(doc(firestore, 'users', uid));
    let userData;

    if (docSnap.exists()) {
      userData = docSnap.data();
    } else {
      // Fallback if user document doesn't exist
      userData = {
        id: uid,
        email: userCred.user.email,
        username: userCred.user.displayName || 'User',
        avatar: userCred.user.photoURL || '', // This field might be empty since it's not used now
        status: 'Online',
        groups: []
      };
    }

    setCurrentUser(userData);
    return userData;
  };

  // Update profile: Only username and status (no profile picture)
  const updateUserProfile = async (username, status) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const userDocRef = doc(firestore, 'users', currentUser.uid);

    // Update the fields that can be changed (username and status)
    await updateDoc(userDocRef, {
      username: username.trim(),
      status: status.trim(),
    });

    // Also update the local auth profile for username
    await updateProfile(currentUser, {
      displayName: username.trim(),
    });

    // Update the current user state
    setCurrentUser(prevUser => ({
      ...prevUser,
      username: username.trim(),
      status: status.trim(),
    }));
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  // Automatically load user from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(firestore, 'users', user.uid));
        if (docSnap.exists()) {
          setCurrentUser(docSnap.data());
        } else {
          // Fallback if user document doesn't exist
          setCurrentUser({
            id: user.uid,
            email: user.email,
            username: user.displayName || 'User',
            avatar: user.photoURL || '', // Avatar might be empty now
            status: 'Online',
            groups: []
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signup,
        login,
        updateUserProfile,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
