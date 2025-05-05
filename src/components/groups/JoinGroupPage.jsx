import React, { useState } from 'react';
import { firestore } from '../../firebase';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { auth } from '../../firebase';
import '../../styles/Modal.css';

const JoinGroupModal = ({ onClose }) => {
  const [groupId, setGroupId] = useState('');
  const [message, setMessage] = useState('');

  const handleJoin = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const groupRef = doc(firestore, 'groups', groupId);
      const groupSnap = await getDoc(groupRef);

      if (!groupSnap.exists()) {
        setMessage('Group not found.');
        return;
      }

      await updateDoc(groupRef, {
        members: arrayUnion(currentUser.uid)
      });

      setMessage('Successfully joined the group!');
    } catch (error) {
      console.error(error);
      setMessage('Failed to join the group.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Join a Group</h2>
        <input
          type="text"
          placeholder="Enter group ID"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
        />
        <button onClick={handleJoin}>Join</button>
        {message && <p>{message}</p>}
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default JoinGroupModal;
