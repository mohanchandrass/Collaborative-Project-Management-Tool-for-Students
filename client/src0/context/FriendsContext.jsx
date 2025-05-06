import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getFriends } from '../services/userService';

const FriendsContext = createContext();

export function FriendsProvider({ children }) {
  const { currentUser } = useAuth();
  const [friends, setFriends] = useState([]);
  
  useEffect(() => {
    if (currentUser) {
      const fetchFriends = async () => {
        const friendsList = await getFriends(currentUser.uid);
        setFriends(friendsList);
      };
      fetchFriends();
    }
  }, [currentUser]);

  return (
    <FriendsContext.Provider value={{ friends }}>
      {children}
    </FriendsContext.Provider>
  );
}

export function useFriends() {
  return useContext(FriendsContext);
}