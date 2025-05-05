import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ProjectContext } from '../../context/ProjectContext';
import Message from './Message';
import '../../App.css';

const ChatWindow = () => {
  const { user } = useContext(AuthContext);
  const { currentProject } = useContext(ProjectContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // In a real app, you would use WebSocket or a real-time database
  useEffect(() => {
    if (currentProject) {
      // Simulate loading some initial messages
      const initialMessages = [
        {
          id: '1',
          text: 'Welcome to the project chat!',
          sender: { id: 'system', username: 'System' },
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          text: 'Let\'s discuss our project tasks here.',
          sender: { id: 'user1', username: 'Project Manager' },
          timestamp: new Date().toISOString(),
        },
      ];
      setMessages(initialMessages);
    }
  }, [currentProject]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: { id: user.id, username: user.username },
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // In a real app, you would send the message to the server here
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Project Chat</h3>
      </div>
      <div className="chat-messages">
        {messages.map(message => (
          <Message
            key={message.id}
            message={message}
            isCurrentUser={message.sender.id === user.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;