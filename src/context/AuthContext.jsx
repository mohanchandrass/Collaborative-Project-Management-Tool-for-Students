import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const signup = async (username, email, password) => {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;

    const userData = {
      id: uid,
      username,
      email,
      avatar: `https://i.pravatar.cc/150?u=${uid}`,
      groups: []
    };

    await setDoc(doc(db, 'users', uid), userData);

    // ✅ Update Firebase Auth profile
    await updateProfile(userCred.user, {
      displayName: username,
      photoURL: userData.avatar
    });

    setCurrentUser(userData);
    return userData;
  };

  const login = async (email, password) => {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;

    const docSnap = await getDoc(doc(db, 'users', uid));
    if (docSnap.exists()) {
      const userData = docSnap.data();
      setCurrentUser(userData);
      return userData;
    } else {
      // Fallback if Firestore data is missing
      const fallbackUser = {
        id: uid,
        email: userCred.user.email,
        username: userCred.user.displayName || 'User',
        avatar: userCred.user.photoURL || '',
        groups: []
      };
      setCurrentUser(fallbackUser);
      return fallbackUser;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists()) {
          setCurrentUser(docSnap.data());
        } else {
          // Fallback if Firestore data not found
          setCurrentUser({
            id: user.uid,
            email: user.email,
            username: user.displayName || 'User',
            avatar: user.photoURL || '',
            groups: []
          });
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signup,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
