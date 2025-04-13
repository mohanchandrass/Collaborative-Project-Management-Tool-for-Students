import React, { createContext, useContext } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../firebase';  // Correctly importing firestore
import { AuthContext } from './AuthContext';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  const createTask = async (taskData) => {
    const taskWithMeta = {
      ...taskData,
      createdAt: new Date(),
      createdBy: currentUser ? currentUser.uid : null, // Associate task with the current user
    };

    try {
      await addDoc(collection(firestore, 'tasks'), taskWithMeta); // Use firestore here
      console.log('Task created successfully!');
    } catch (error) {
      console.error('Error creating task: ', error);
    }
  };

  const getTasksByProject = async (projectId) => {
    const q = query(collection(firestore, 'tasks'), where('projectId', '==', projectId)); // Use firestore here
    try {
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching tasks: ', error);
      return [];
    }
  };

  return (
    <TaskContext.Provider value={{ createTask, getTasksByProject }}>
      {children}
    </TaskContext.Provider>
  );
};
