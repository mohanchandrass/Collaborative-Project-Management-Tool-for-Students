import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase'; // Firebase imports
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore functions
import { BsPersonFill } from 'react-icons/bs'; // Icons
import { FiX } from 'react-icons/fi';
import '../styles/UserProfile.css';

const UserProfile = ({ show, onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [userStatus, setUserStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState({
    username: false,
    email: false,
    status: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const userDocRef = doc(firestore, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUsername(data.username || '');
            setEmail(data.email || currentUser.email || '');
            setUserStatus(data.status || '');
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }
    };

    if (show) fetchUserData();
  }, [show]);

  const handleUpdateProfile = async () => {
    if (isUploading) return;
    setIsUploading(true);
    setErrorMessage('');

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('No authenticated user');

      const userDocRef = doc(firestore, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error('User document not found');
      }

      // Update user profile in Firestore
      await updateDoc(userDocRef, {
        username: username.trim(),
        email: email.trim(),
        status: userStatus.trim(),
      });

      // If email is updated, re-authenticate before updating it in Firebase Authentication
      if (email !== currentUser.email) {
        const userPassword = prompt("Please enter your password to update the email");
        if (!userPassword) {
          setErrorMessage('Email update failed: Password is required');
          setIsUploading(false);
          return;
        }

        try {
          // Re-authenticate with current email and password
          await auth.signInWithEmailAndPassword(currentUser.email, userPassword);

          // Update email in Firebase Authentication
          await currentUser.updateEmail(email.trim());
        } catch (error) {
          setErrorMessage('Reauthentication failed. Please check your password and try again.');
          setIsUploading(false);
          return;
        }
      }

      onClose();
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrorMessage(`Update failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="user-profile-modal">
      <div className="user-profile-modal-content">
        <button className="close-button" onClick={onClose}>
          <FiX size={24} />
        </button>

        <div className="user-profile-header">
          <div className="avatar">
            <BsPersonFill size={40} />
          </div>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="user-details">
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={!isEditing.username}
            />
            <button
              className="edit-button-box"
              onClick={() => setIsEditing((prevState) => ({ ...prevState, username: !prevState.username }))}
            >
              {isEditing.username ? 'Confirm' : 'Edit'}
            </button>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              disabled={!isEditing.email}
            />
            <button
              className="edit-button-box"
              onClick={() => setIsEditing((prevState) => ({ ...prevState, email: !prevState.email }))}
            >
              {isEditing.email ? 'Confirm' : 'Edit'}
            </button>
          </div>

          <div className="input-group">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              value={userStatus}
              onChange={(e) => setUserStatus(e.target.value)}
              disabled={!isEditing.status}
            >
              <option value="online">🟢 Online</option>
              <option value="idle">🌙 Idle</option>
              <option value="dnd">🔴 Do Not Disturb</option>
              <option value="invisible">⚫ Invisible</option>
            </select>
            <button
              className="edit-button-box"
              onClick={() => setIsEditing((prevState) => ({ ...prevState, status: !prevState.status }))}
            >
              {isEditing.status ? 'Confirm' : 'Edit'}
            </button>
          </div>

          <button
            className="save-button"
            onClick={handleUpdateProfile}
            disabled={isUploading || !username.trim() || !email.trim()}
          >
            {isUploading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
