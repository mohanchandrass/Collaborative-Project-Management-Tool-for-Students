import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  query,
  collection,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, firestore } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import {
  FiUsers,
  FiSettings,
  FiArrowLeft,
  FiTrash2,
  FiPlus,
  FiCopy
} from 'react-icons/fi';
import '../styles/GroupPage.css';
import Dashboard from './dashboard';

const GroupPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const groupDoc = await getDoc(doc(firestore, 'groups', groupId));

        if (!groupDoc.exists()) {
          throw new Error('Group not found');
        }

        const groupData = groupDoc.data();
        setGroup({ id: groupDoc.id, ...groupData });

        if (groupData.inviteCode) {
          setInviteCode(groupData.inviteCode);
        }

        const membersData = await Promise.all(
          groupData.members.map(async (memberId) => {
            const userDoc = await getDoc(doc(firestore, 'users', memberId));
            return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
          })
        );

        setUsersData(membersData.filter(Boolean));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) return;

    try {
      const usersQuery = query(
        collection(firestore, 'users'),
        where('email', '==', newMemberEmail.trim())
      );
      const querySnapshot = await getDocs(usersQuery);

      if (querySnapshot.empty) {
        throw new Error('User with this email not found');
      }

      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;

      await updateDoc(doc(firestore, 'groups', groupId), {
        members: arrayUnion(userId)
      });

      const updatedGroupDoc = await getDoc(doc(firestore, 'groups', groupId));
      setGroup({ id: updatedGroupDoc.id, ...updatedGroupDoc.data() });

      setUsersData([...usersData, { id: userDoc.id, ...userDoc.data() }]);
      setNewMemberEmail('');
    } catch (err) {
      alert(`Error adding member: ${err.message}`);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!currentUser || group.admin !== currentUser.uid) return;

    try {
      await updateDoc(doc(firestore, 'groups', groupId), {
        members: arrayRemove(memberId)
      });

      const updatedGroupDoc = await getDoc(doc(firestore, 'groups', groupId));
      setGroup({ id: updatedGroupDoc.id, ...updatedGroupDoc.data() });

      setUsersData(usersData.filter(user => user.id !== memberId));
    } catch (err) {
      alert('Error removing member');
    }
  };

  const handleLeaveGroup = async () => {
    if (!currentUser) return;

    try {
      await updateDoc(doc(firestore, 'groups', groupId), {
        members: arrayRemove(currentUser.uid)
      });

      navigate('/');
    } catch (err) {
      alert('Error leaving group');
    }
  };

  const handleGenerateInviteCode = async () => {
    const code = Math.random().toString(36).substring(2, 10);
    try {
      await updateDoc(doc(firestore, 'groups', groupId), {
        inviteCode: code
      });
      setInviteCode(code);
    } catch (err) {
      alert('Error generating invite code');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    alert('Invite code copied to clipboard!');
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!group) return <div className="not-found">Group not found</div>;

  const isAdmin = currentUser && group.admin === currentUser.uid;

  return (
    <div className="group-page-layout">
      {/* Left Sidebar */}
      <div className="group-sidebar">
        <button className="back-button" onClick={() => navigate('/')}>
          <FiArrowLeft /> Back
        </button>
        <h1>{group.name}</h1>

        {/* Always Show Invite Code */}
        {inviteCode && (
          <div className="invite-code-box">
            <p>Invite Code:</p>
            <div className="invite-code-row">
              <strong>{inviteCode}</strong>
              <button onClick={handleCopyCode} className="copy-button">
                <FiCopy />
              </button>
            </div>
          </div>
        )}

        {isAdmin && (
          <button
            className="settings-button"
            onClick={() => setShowSettings(!showSettings)}
          >
            <FiSettings />
          </button>
        )}

        {showSettings && isAdmin && (
          <div className="group-settings">
            <input
              type="email"
              placeholder="Add member by email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
            />
            <button onClick={handleAddMember}>
              <FiPlus /> Add
            </button>

            <div className="invite-code-section">
              <button onClick={handleGenerateInviteCode}>
                Generate New Invite Code
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Center Content with Dashboard */}
      <div className="group-main-content">
        <Dashboard groupId={groupId} />
      </div>

      {/* Right Members Panel */}
      <div className="group-members-panel">
        <h2><FiUsers /> Members</h2>
        <div className="members-list">
          {usersData.map((user) => (
            <div key={user.id} className="member-card">
              <div className="member-info">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="member-avatar" />
                ) : (
                  <div className="member-avatar-default">
                    {user.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <h4>{user.displayName || 'Unknown'}</h4>
                  <p>{user.email}</p>
                  {user.id === group.admin && <span className="admin-badge">Admin</span>}
                </div>
              </div>
              {isAdmin && user.id !== currentUser.uid && (
                <button
                  className="remove-member-button"
                  onClick={() => handleRemoveMember(user.id)}
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          ))}
        </div>

        {!isAdmin && (
          <button className="leave-group-button" onClick={handleLeaveGroup}>
            Leave Group
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupPage;
