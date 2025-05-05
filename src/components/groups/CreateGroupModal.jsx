import React, { useState } from 'react';

const CreateGroupModal = ({ onClose, onCreate, onJoin }) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = () => {
    setLoading(true);
    onCreate(newGroupName);
    setNewGroupName('');
    setLoading(false);
  };

  const handleJoinGroup = () => {
    setLoading(true);
    onJoin(joinCode);
    setJoinCode('');
    setLoading(false);
  };

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
          <button 
            onClick={handleCreateGroup}
            disabled={!newGroupName || loading}  // Disable button if input is empty or loading
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
        <div className="modal-section">
          <h4>Join Existing Group</h4>
          <input
            placeholder="Enter Group ID"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
          />
          <button
            onClick={handleJoinGroup}
            disabled={!joinCode || loading}  // Disable button if input is empty or loading
          >
            {loading ? 'Joining...' : 'Join'}
          </button>
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CreateGroupModal;
