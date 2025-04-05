import React, { useContext, useState, useRef, useEffect } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import { AuthContext } from '../context/AuthContext';
import { FiPlus, FiHome, FiLogOut, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { BsPersonFill } from 'react-icons/bs';

const Sidebar = () => {
  const { projects, createProject, activeProject, setActiveProject } = useContext(ProjectContext);
  const { user, logout } = useContext(AuthContext);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName);
      setNewProjectName('');
      setShowCreateModal(false);
    }
  };

  const sidebarWidth = expanded ? '200px' : '72px';

  return (
    <>
      {/* Sidebar */}
      <div
        style={{
          width: sidebarWidth,
          backgroundColor: '#1e1e1e',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '12px',
          position: 'fixed',
          transition: 'width 0.3s ease',
        }}
      >
        {/* Toggle Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: expanded ? 'flex-end' : 'center',
            padding: '10px',
          }}
        >
          <button
            onClick={() => setExpanded((prev) => !prev)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ccc',
              cursor: 'pointer',
              fontSize: '20px',
            }}
          >
            {expanded ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
        </div>

        {/* Home */}
        <SidebarItem
          icon={<FiHome />}
          label="Home"
          active={activeProject === null}
          onClick={() => setActiveProject(null)}
          expanded={expanded}
        />

        {/* Divider */}
        <div style={{ width: '80%', height: '1px', backgroundColor: '#363636', margin: '8px auto' }} />

        {/* Projects */}
        {projects.map((project) => (
          <SidebarItem
            key={project.id}
            icon={project.name.charAt(0).toUpperCase()}
            label={project.name}
            active={activeProject === project.id}
            onClick={() => setActiveProject(project.id)}
            expanded={expanded}
          />
        ))}

        {/* Add Project */}
        <SidebarItem
          icon={<FiPlus />}
          label="New Project"
          onClick={() => setShowCreateModal(true)}
          expanded={expanded}
        />

        <div style={{ marginTop: 'auto', paddingBottom: '12px' }} ref={userMenuRef}>
          {/* Profile Avatar */}
          <div
            onClick={() => setShowUserMenu((prev) => !prev)}
            style={{
              width: '48px',
              height: '48px',
              margin: '0 auto',
              borderRadius: '50%',
              backgroundColor: '#363636',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              overflow: 'hidden'
            }}
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" style={{ width: '100%', height: '100%' }} />
            ) : (
              <BsPersonFill size={20} />
            )}
          </div>

          {/* Dropdown */}
          {showUserMenu && (
            <div
              style={{
                position: 'absolute',
                left: expanded ? '210px' : '80px',
                bottom: '60px',
                backgroundColor: '#2a2a2a',
                borderRadius: '8px',
                padding: '12px',
                width: '220px',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                zIndex: 100,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#363636',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '10px',
                    overflow: 'hidden',
                  }}
                >
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="User" style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <BsPersonFill />
                  )}
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: 'bold' }}>{user?.displayName || 'User'}</div>
                  <div style={{ color: '#aaa', fontSize: '12px' }}>ID: {user?.uid?.slice(0, 8)}</div>
                </div>
              </div>

              <div
                onClick={logout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '4px',
                }}
              >
                <FiLogOut />
                <span>Log Out</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#2a2a2a',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
            }}
          >
            <h3 style={{ color: 'white', marginBottom: '10px' }}>Create Project</h3>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter project name"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #444',
                marginBottom: '10px',
                backgroundColor: '#1e1e1e',
                color: 'white',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  backgroundColor: '#444',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                style={{
                  backgroundColor: '#3a7bfd',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SidebarItem = ({ icon, label, active, onClick, expanded }) => (
  <div
    onClick={onClick}
    title={!expanded ? label : ''}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: expanded ? '12px' : '0',
      width: '100%',
      padding: '10px 16px',
      color: 'white',
      cursor: 'pointer',
      backgroundColor: active ? '#363636' : 'transparent',
      transition: 'background 0.2s ease',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2a2a2a')}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = active ? '#363636' : 'transparent')}
  >
    <div style={{ width: '24px', textAlign: 'center' }}>{icon}</div>
    {expanded && <span>{label}</span>}
  </div>
);

export default Sidebar;
