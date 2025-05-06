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
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import { auth, firestore } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import {
  FiUsers,
  FiSettings,
  FiTrash2,
  FiPlus,
  FiCopy,
  FiHome,
  FiFilePlus,
  FiFolder,
  FiCheckSquare
} from 'react-icons/fi';
import '../styles/GroupPage.css';
import Dashboard from './dashboard';
import NewProjects from './dashboard/NewProjects';
import MyProjects from './dashboard/MyProjects';
import TaskStatus from './dashboard/TaskStatus';
import TaskChart from './dashboard/TaskChart';
import ProjectPreview from './dashboard/ProjectPreview';
import TaskStatusPreview from './dashboard/TaskStatusPreview';
import GroupChat from './dashboard/GroupChat'; 

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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showChat, setShowChat] = useState(false);

  const isAdmin = currentUser && group?.admin === currentUser.uid;

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const groupDoc = await getDoc(doc(firestore, 'groups', groupId));
        if (!groupDoc.exists()) throw new Error('Group not found');

        const groupData = groupDoc.data();
        setGroup({ id: groupDoc.id, ...groupData });

        if (groupData.inviteCode) setInviteCode(groupData.inviteCode);

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

  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'group-chat': 
        return <GroupChat groupId={groupId} />;
      case 'new-project':
        return <NewProjects groupId={groupId} />;
      case 'my-projects':
        return <MyProjects groupId={groupId} userId={currentUser?.uid} />;
      case 'task-status':
        return <TaskStatus groupId={groupId} />;
      default:
        return <Dashboard groupId={groupId} setActiveTab={setActiveTab} />;
    }
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) return;

    try {
      const usersQuery = query(
        collection(firestore, 'users'),
        where('email', '==', newMemberEmail.trim())
      );
      const querySnapshot = await getDocs(usersQuery);

      if (querySnapshot.empty) throw new Error('User not found');

      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;

      await updateDoc(doc(firestore, 'groups', groupId), {
        members: arrayUnion(userId),
      });

      setUsersData([...usersData, { id: userId, ...userDoc.data() }]);
      setNewMemberEmail('');
    } catch (err) {
      alert(`Error adding member: ${err.message}`);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!isAdmin) return;

    try {
      await updateDoc(doc(firestore, 'groups', groupId), {
        members: arrayRemove(memberId),
      });
      setUsersData(usersData.filter(user => user.id !== memberId));
    } catch (err) {
      alert('Error removing member');
    }
  };

  const handleLeaveGroup = async () => {
    const currentUser = auth.currentUser; // Get the current user from auth
    if (!currentUser || !currentUser.uid) {
      alert('User data not loaded properly.');
      return;
    }
  
    try {
      if (!group) return;
  
      const confirmed = window.confirm('Are you sure you want to leave this group?');
      if (!confirmed) return;
  
      const groupRef = doc(firestore, 'groups', groupId);
      const isOnlyMember = group.members.length === 1;
      const isAdmin = group.admin === currentUser.uid;
  
      if (isOnlyMember) {
        await deleteDoc(groupRef);
        alert('Group deleted because you were the only member.');
  
        // Navigate to user dashboard after deletion
        navigate('/dashboard');
        return;
      }
  
      if (isAdmin) {
        const remainingMembers = group.members.filter((id) => id !== currentUser.uid);
        const newAdmin = remainingMembers[0];
  
        await updateDoc(groupRef, {
          admin: newAdmin,
          members: arrayRemove(currentUser.uid),
        });
  
        alert(`You left the group. Admin rights transferred to another member.`);
      } else {
        await updateDoc(groupRef, {
          members: arrayRemove(currentUser.uid),
        });
      }
  
      // Navigate to user dashboard after leaving group
      navigate('/dashboard');
    } catch (err) {
      alert('Error leaving group');
      console.error(err);
    }
  };
  

  const handleDeleteGroup = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this group? This cannot be undone.');
    if (!confirmed) return;

    try {
      await deleteDoc(doc(firestore, 'groups', groupId));
      navigate('/');
    } catch (err) {
      alert('Failed to delete group');
    }
  };

  const handleGenerateInviteCode = async () => {
    const generateCode = () => Math.random().toString(36).substring(2, 10);
    let uniqueCode = generateCode();

    const checkIfCodeExists = async (code) => {
      const groupsQuery = query(collection(firestore, 'groups'), where('inviteCode', '==', code));
      const groupsSnapshot = await getDocs(groupsQuery);
      return !groupsSnapshot.empty;
    };

    try {
      let isUnique = false;
      while (!isUnique) {
        isUnique = !(await checkIfCodeExists(uniqueCode));
        if (!isUnique) uniqueCode = generateCode();
      }

      await updateDoc(doc(firestore, 'groups', groupId), {
        inviteCode: uniqueCode,
      });

      setInviteCode(uniqueCode);
    } catch {
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

  return (
    <div className="group-page-layout">
      <div className="group-sidebar">
        <h1 className="group-title">{group.name}</h1>
        <hr />
        {/* Dashboard Navigation */}
        <div className="dashboard-nav">
          <button 
            className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FiHome className="nav-icon" /> Dashboard
          </button>

          <button 
            className={`nav-button ${activeTab === 'group-chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('group-chat')}
          >
          <FiUsers className="nav-icon" /> Group Chat
          </button>
          
          <button 
            className={`nav-button ${activeTab === 'new-project' ? 'active' : ''}`}
            onClick={() => setActiveTab('new-project')}
          >
            <FiFilePlus className="nav-icon" /> New Project
          </button>
          <button 
            className={`nav-button ${activeTab === 'my-projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-projects')}
          >
            <FiFolder className="nav-icon" /> All Projects
          </button>
          <button 
            className={`nav-button ${activeTab === 'task-status' ? 'active' : ''}`}
            onClick={() => setActiveTab('task-status')}
          >
            <FiCheckSquare className="nav-icon" /> Task Status
          </button>
        </div>

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

        <hr />

        {isAdmin ? (
          <>
            <button className="settings-button" onClick={() => setShowSettings(!showSettings)}>
              <FiSettings /> Group Settings
            </button>
            <button className="delete-group-button" onClick={handleDeleteGroup}>
              <FiTrash2 /> Delete Group
            </button>
          </>
        ) : (
          <button className="leave-group-button" onClick={handleLeaveGroup}>
            Leave Group
          </button>
        )}

        {showSettings && (
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
            <button onClick={handleGenerateInviteCode}>
              Generate New Invite Code
            </button>
          </div>
        )}
      </div>

      <div className="group-main-content">
        {renderDashboardContent()}
      </div>

      <div className="group-members-panel">
        <h2><FiUsers /> Members</h2>
        <div className="members-list">
          {usersData.map((user) => (
            <div key={user.id} className="member-card">
              <div className="member-info">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || user.email} className="member-avatar" />
                ) : (
                  <div className="member-avatar-default">
                    {(user.displayName || user.username || user.email)?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4>{user.displayName || user.username || user.email}</h4>
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
      </div>
    </div>
  );
};

export default GroupPage;