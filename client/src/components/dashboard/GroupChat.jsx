import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../../firebase';
import { FiSend } from 'react-icons/fi';
import '../../styles/GroupChat.css';

const GroupChat = ({ groupId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!groupId) {
      console.error('No groupId found');
      return;
    }

    const messagesQuery = query(
      collection(firestore, 'groups', groupId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(newMessages);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );

    return () => unsubscribe();
  }, [groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    const currentUser = auth.currentUser; // Get the current user directly from Firebase auth

    if (!currentUser) {
      console.error('User is not logged in');
      alert('Please log in to send a message.');
      return;
    }

    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) {
      console.error('Message content is empty');
      return;
    }

    const messageData = {
      userId: currentUser.uid,
      content: trimmedMessage,
      timestamp: serverTimestamp(),
      displayName: currentUser.displayName || 'Anonymous',
    };

    try {
      // Add the message to Firestore
      await addDoc(collection(firestore, 'groups', groupId, 'messages'), messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="group-chat-window">
      <div className="group-chat-header">
        <h3>Group Chat</h3>
      </div>

      <div className="group-chat-messages">
        {loading ? (
          <div>Loading messages...</div>
        ) : (
          <>
            {messages.map((msg) => {
              const timestamp = msg.timestamp?.toDate?.();
              return (
                <div className={`message ${msg.userId === auth.currentUser?.uid ? 'sent' : 'received'}`} key={msg.id}>
                  <div className="message-header">
                    <span className="username">{msg.displayName || 'Anonymous'}</span>
                    <span className="timestamp">
                      {timestamp ? timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <div className="message-content">{msg.content}</div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="message-input">
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          aria-label="Type a message"
        />
        <button
          onClick={handleSendMessage}
          className="send-button"
          type="button"
          aria-label="Send message"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
