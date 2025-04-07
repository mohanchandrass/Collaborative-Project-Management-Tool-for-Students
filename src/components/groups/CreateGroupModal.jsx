import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography
} from '@mui/material';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const CreateGroupModal = ({ open, onClose }) => {
  const [groupName, setGroupName] = useState('');
  const [status, setStatus] = useState(null);
  const db = getFirestore();
  const auth = getAuth();

  const handleCreateGroup = async () => {
    if (!groupName) {
      setStatus('Group name cannot be empty.');
      return;
    }

    try {
      const user = auth.currentUser;
      await addDoc(collection(db, 'groups'), {
        name: groupName,
        createdBy: user.email,
        members: [user.email],
        invites: [],
        createdAt: new Date(),
      });
      setGroupName('');
      setStatus('Group created successfully!');
      onClose(); // Close modal after success
    } catch (error) {
      console.error('Error creating group:', error);
      setStatus('Something went wrong. Try again.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create a New Group</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Group Name"
          type="text"
          fullWidth
          variant="standard"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        {status && (
          <Typography
            variant="body2"
            color={status.includes('successfully') ? 'green' : 'error'}
            style={{ marginTop: '0.5rem' }}
          >
            {status}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleCreateGroup}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateGroupModal;
