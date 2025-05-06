import React, { useState, useEffect } from 'react';
import { firestore } from '../../firebase';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { auth } from '../../firebase';
import '../../styles/Modal.css';

const GroupInviteModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [groupId, setGroupId] = useState('');
  const [message, setMessage] = useState('');

  const handleInvite = async () => {
    try {
      const userQuery = query(collection(firestore, 'users'), where('email', '==', email));
      const userSnap = await getDocs(userQuery);

      if (userSnap.empty) {
        setMessage('User not found.');
        return;
      }

      const invitedUserId = userSnap.docs[0].id;

      const groupRef = doc(firestore, 'groups', groupId);
      await updateDoc(groupRef, {
        members: arrayUnion(invitedUserId)
      });

      setMessage('User invited successfully!');
    } catch (error) {
      console.error(error);
      setMessage('Failed to invite user.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Invite to Group</h2>
        <input
          type="text"
          placeholder="Enter group ID"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter user's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleInvite}>Send Invite</button>
        {message && <p>{message}</p>}
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default GroupInviteModal;
