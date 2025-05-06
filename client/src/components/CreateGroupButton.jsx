import React, { useState } from 'react';
import { useGroup } from '../context/GroupContext';
import CreateGroupModal from './CreateGroupModal';

const CreateGroupButton = () => {
  const [showModal, setShowModal] = useState(false);
  const { createNewGroup } = useGroup();

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Create New Group
      </button>
      
      {showModal && (
        <CreateGroupModal 
          onCreate={createNewGroup}
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
};

export default CreateGroupButton;