import React, { createContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // This will now work after installation

export const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState({});
  
  const createGroup = (name) => {
    const newGroup = {
      id: uuidv4(),
      name,
      members: []
    };
    setGroups(prev => ({ ...prev, [newGroup.id]: newGroup }));
    return newGroup.id;
  };

  return (
    <GroupContext.Provider value={{ groups, createGroup }}>
      {children}
    </GroupContext.Provider>
  );
};