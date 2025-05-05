import { db } from './firebase';
import { collection, doc, setDoc, updateDoc, arrayUnion, getDocs, query, where } from 'firebase/firestore';

export const createGroup = async (groupName, userId) => {
  const groupRef = doc(collection(db, 'groups'));
  await setDoc(groupRef, {
    name: groupName,
    icon: '⭐',
    members: [userId],
    admin: userId,
    createdAt: new Date()
  });
  return groupRef.id;
};

export const joinGroup = async (groupId, userId) => {
  const groupRef = doc(db, 'groups', groupId);
  await updateDoc(groupRef, {
    members: arrayUnion(userId)
  });
};

export const getUserGroups = async (userId) => {
  const q = query(
    collection(db, 'groups'),
    where('members', 'array-contains', userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const generateInviteLink = (groupId) => {
  return `${window.location.origin}/join/${groupId}`;
};