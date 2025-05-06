import React from 'react';
import '../../App.css';

const Message = ({ message, isCurrentUser }) => {
  const messageDate = new Date(message.timestamp);
  const timeString = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`message ${isCurrentUser ? 'current-user' : ''}`}>
      {!isCurrentUser && (
        <div className="message-sender">
          {message.sender.username}
        </div>
      )}
      <div className="message-content">
        <div className="message-text">{message.text}</div>
        <div className="message-time">{timeString}</div>
      </div>
    </div>
  );
};

export default Message;