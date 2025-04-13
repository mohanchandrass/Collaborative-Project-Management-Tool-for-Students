import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  arrayUnion,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import '../styles/Chat.css';

const Chat = () => {
  const [user, setUser] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [usernameToAdd, setUsernameToAdd] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessageNotification, setNewMessageNotification] = useState({});
  const [recentChats, setRecentChats] = useState({}); // timestamp of latest messages

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const userRef = doc(firestore, 'users', currentUser.uid);

    const unsubscribe = onSnapshot(userRef, async (docSnap) => {
      const userData = docSnap.data();
      setUser(userData);

      const requests = userData.friendRequests || [];
      const friendList = userData.friends || [];
      setFriendRequests(requests);

      const friendData = await Promise.all(friendList.map(async uid => {
        const docRef = await getDoc(doc(firestore, 'users', uid));
        return { uid, ...docRef.data() };
      }));

      setFriends(friendData);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const q = await getDocs(collection(firestore, 'users'));
      const users = q.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
      setAllUsers(users);
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateFriendActivity();
    }, 3000);

    return () => clearInterval(interval);
  }, [friends, selectedFriend]);

  const updateFriendActivity = async () => {
    const currentUid = auth.currentUser.uid;
    const updatedNotifications = {};
    const recentChatTimestamps = {};

    await Promise.all(
      friends.map(async friend => {
        const chatId = [currentUid, friend.uid].sort().join('_');
        const msgQuery = query(
          collection(firestore, 'chats', chatId, 'messages'),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        const snapshot = await getDocs(msgQuery);
        const latest = snapshot.docs[0]?.data();

        if (latest) {
          recentChatTimestamps[friend.uid] = latest.timestamp?.seconds || 0;

          // If the latest message was sent by the friend and that chat is not currently open
          if (
            latest.sender !== currentUid &&
            selectedFriend?.uid !== friend.uid
          ) {
            updatedNotifications[friend.uid] = true;
          }
        }
      })
    );

    // Sort friends by recent activity
    const sortedFriends = [...friends].sort((a, b) => {
      return (recentChatTimestamps[b.uid] || 0) - (recentChatTimestamps[a.uid] || 0);
    });

    setFriends(sortedFriends);
    setNewMessageNotification(updatedNotifications);
    setRecentChats(recentChatTimestamps);
  };

  useEffect(() => {
    if (!selectedFriend) return;

    const chatId = [auth.currentUser.uid, selectedFriend.uid].sort().join('_');
    const messagesRef = collection(firestore, 'chats', chatId, 'messages');

    const unsubscribe = onSnapshot(messagesRef, snapshot => {
      const msgs = snapshot.docs
        .map(doc => doc.data())
        .sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);
      setMessages(msgs);

      // Reset notification
      setNewMessageNotification(prev => ({
        ...prev,
        [selectedFriend.uid]: false
      }));
    });

    return unsubscribe;
  }, [selectedFriend]);

  const sendFriendRequest = async () => {
    const userToAdd = allUsers.find(u => u.username === usernameToAdd.trim());
    if (!userToAdd) return alert('User not found.');

    const userRef = doc(firestore, 'users', userToAdd.uid);
    await updateDoc(userRef, {
      friendRequests: arrayUnion(auth.currentUser.uid)
    });
    setUsernameToAdd('');
    alert('Friend request sent!');
  };

  const acceptRequest = async (uid) => {
    const currentUser = auth.currentUser;
    const myRef = doc(firestore, 'users', currentUser.uid);
    const senderRef = doc(firestore, 'users', uid);

    await updateDoc(myRef, {
      friends: arrayUnion(uid),
      friendRequests: friendRequests.filter(id => id !== uid)
    });
    await updateDoc(senderRef, {
      friends: arrayUnion(currentUser.uid)
    });
  };

  const removeFriend = async (uidToRemove) => {
    const currentUid = auth.currentUser.uid;
  
    if (!window.confirm("Are you sure you want to remove this friend?")) return;
  
    // Remove from current user's friend list
    const currentRef = doc(firestore, 'users', currentUid);
    const currentSnap = await getDoc(currentRef);
    const currentFriends = currentSnap.data().friends || [];
    await updateDoc(currentRef, {
      friends: currentFriends.filter(uid => uid !== uidToRemove)
    });
  
    // Remove from friend's friend list
    const otherRef = doc(firestore, 'users', uidToRemove);
    const otherSnap = await getDoc(otherRef);
    const otherFriends = otherSnap.data().friends || [];
    await updateDoc(otherRef, {
      friends: otherFriends.filter(uid => uid !== currentUid)
    });
  
    // If currently chatting with the removed friend, reset the chat
    if (selectedFriend?.uid === uidToRemove) {
      setSelectedFriend(null);
      setMessages([]);
    }
  
    alert("Friend removed.");
  };
  

  const sendMessage = async () => {
    if (!selectedFriend || !message.trim()) return;

    const chatId = [auth.currentUser.uid, selectedFriend.uid].sort().join('_');
    const messagesRef = collection(firestore, 'chats', chatId, 'messages');

    await addDoc(messagesRef, {
      sender: auth.currentUser.uid,
      content: message,
      timestamp: new Date()
    });

    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const getUserInfo = (uid) => {
    const found = allUsers.find(u => u.uid === uid);
    return found?.username || found?.email || 'Unknown';
  };

  return (
    <div className="chat-page">
      <div className="friends-sidebar">
        <h2>Friends & Requests</h2>

        <div className="add-friend-form">
          <input
            type="text"
            placeholder="Add by username"
            value={usernameToAdd}
            onChange={e => setUsernameToAdd(e.target.value)}
          />
          <button onClick={sendFriendRequest}>Send Request</button>
        </div>

        <div className="friend-request-section">
          <h4>Pending Requests</h4>
          {friendRequests.map(uid => (
            <div key={uid} className="request-item">
              <span>{getUserInfo(uid)}</span>
              <button onClick={() => acceptRequest(uid)}>Accept</button>
            </div>
          ))}
        </div>

        <div className="friends-list">
          <h4>Your Friends</h4>
          {friends.map(friend => (
    <div
      key={friend.uid}
      className={`friend-item ${selectedFriend?.uid === friend.uid ? 'active' : ''}`}
      onClick={() => setSelectedFriend(friend)}
    >
      <div
        onClick={() => setSelectedFriend(friend)}
        className="friend-info"
      >
        <span className="friend-name">
          {friend.username || friend.email}
          {newMessageNotification[friend.uid] && <span className="new-message-dot" />}
        </span>
      </div>

      <div className="tooltip-container">
        <button
          onClick={() => removeFriend(friend.uid)}
          className="remove-friend-button"
        >
          🗑️
        </button>
        <span className="tooltip-text">Remove Friend</span>
        </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-window">
        {selectedFriend ? (
          <>
            <div className="chat-header">
              Chatting with {selectedFriend.username || selectedFriend.email}
            </div>
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.sender === auth.currentUser.uid ? 'sent' : 'received'}`}
                >
                  {msg.content}
                </div>
              ))}
            </div>
            <div className="message-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-chat">Select a friend to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
