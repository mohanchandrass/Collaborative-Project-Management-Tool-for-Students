import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { doc, updateDoc, arrayRemove, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase';

const GroupItem = ({ group }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      // Check if the user is the admin or a member of the group
      if (group.admin === currentUser.uid) {
        setIsAdmin(true);
      }
      if (group.members.includes(currentUser.uid)) {
        setIsMember(true);
      }
    }
  }, [group]);

  const handleUpdateGroup = () => {
    if (isAdmin) {
      // Redirect to the group edit page (you can customize this as per your routes)
      history.push(`/group/${group.id}/edit`);
    }
  };

  const handleLeaveGroup = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const groupDocRef = doc(firestore, 'groups', group.id);
        await updateDoc(groupDocRef, {
          members: arrayRemove(currentUser.uid),
        });
        console.log('User left the group');
      } catch (error) {
        console.error('Error leaving the group:', error);
      }
    }
  };

  return (
    <div className="group-item">
      <div onClick={handleUpdateGroup} className="group-project-icon">
        {/* The group icon can be styled accordingly */}
        <span>{group.name}</span>
      </div>
      <div className="group-actions">
        {isAdmin ? (
          <>
            <button onClick={handleUpdateGroup} className="action-button" title="Edit group info">
              <FiEdit size={14} />
            </button>
          </>
        ) : isMember ? (
          <>
            <button onClick={handleLeaveGroup} className="action-button" title="Leave group">
              <FiTrash2 size={14} />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default GroupItem;
