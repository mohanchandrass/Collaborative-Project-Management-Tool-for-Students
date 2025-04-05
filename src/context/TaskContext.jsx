// src/context/TaskContext.js
import React, { createContext, useContext } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase'
import { AuthContext } from './AuthContext';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  const createTask = async (taskData) => {
    const taskWithMeta = {
      ...taskData,
      createdAt: new Date(),
    };

    await addDoc(collection(db, 'tasks'), taskWithMeta);
  };

  const getTasksByProject = async (projectId) => {
    const q = query(collection(db, 'tasks'), where('projectId', '==', projectId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  return (
    <TaskContext.Provider value={{ createTask, getTasksByProject }}>
      {children}
    </TaskContext.Provider>
  );
};
