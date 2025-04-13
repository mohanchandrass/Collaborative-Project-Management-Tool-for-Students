// src/components/groups/CreateGroupModal.jsx
import React, { useState } from 'react';

const CreateGroupModal = ({ onClose, onCreate, onJoin }) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Create or Join Group</h3>
        <div className="modal-section">
          <h4>Create New Group</h4>
          <input
            placeholder="New Group Name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <button onClick={() => {
            onCreate(newGroupName);
            setNewGroupName('');
          }}>Create</button>
        </div>
        <div className="modal-section">
          <h4>Join Existing Group</h4>
          <input
            placeholder="Enter Group ID"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
          />
          <button onClick={() => {
            onJoin(joinCode);
            setJoinCode('');
          }}>Join</button>
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CreateGroupModal;
