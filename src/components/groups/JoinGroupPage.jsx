import React, { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Paper
} from '@mui/material';
import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const JoinGroupPage = () => {
  const [invitedGroups, setInvitedGroups] = useState([]);
  const db = getFirestore();
  const auth = getAuth();
  const userEmail = auth.currentUser?.email;

  useEffect(() => {
    if (!userEmail) return;

    const q = query(collection(db, 'groups'), where('invites', 'array-contains', userEmail));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const groups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInvitedGroups(groups);
    });

    return () => unsubscribe();
  }, [userEmail]);

  const handleJoin = async (groupId) => {
    const groupRef = doc(db, 'groups', groupId);
    try {
      await updateDoc(groupRef, {
        invites: arrayRemove(userEmail),
        members: arrayUnion(userEmail),
      });
    } catch (err) {
      console.error('Failed to join group:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>📨 Join a Group</Typography>
      {invitedGroups.length ? (
        <Grid container spacing={3}>
          {invitedGroups.map(group => (
            <Grid item xs={12} md={6} lg={4} key={group.id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">{group.name}</Typography>
                  <Typography variant="body2">Created by: {group.createdBy}</Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" onClick={() => handleJoin(group.id)}>Join</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper elevation={2} style={{ padding: '1rem', marginTop: '1rem' }}>
          <Typography variant="body1">You have no group invites at the moment.</Typography>
        </Paper>
      )}
    </div>
  );
};

export default JoinGroupPage;
