import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { doc, updateDoc, arrayUnion, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const GroupInviteModal = ({ open, onClose, groupId }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [status, setStatus] = useState(null);
  const db = getFirestore();
  const auth = getAuth();

  const handleInvite = async () => {
    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        invites: arrayUnion(inviteEmail),
      });
      setStatus('Invite sent successfully!');
      setInviteEmail('');
    } catch (error) {
      console.error(error);
      setStatus('Failed to send invite.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Invite to Group</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="User Email"
          type="email"
          fullWidth
          variant="standard"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
        />
        {status && <p style={{ color: status.includes('failed') ? 'red' : 'green' }}>{status}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleInvite} variant="contained">Send Invite</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupInviteModal;
