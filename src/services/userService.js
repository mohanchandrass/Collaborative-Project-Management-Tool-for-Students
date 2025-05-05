import { db } from './firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

export const addFriend = async (userId, friendId) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    friends: arrayUnion(friendId)
  });
};

// Add other user-related functions here