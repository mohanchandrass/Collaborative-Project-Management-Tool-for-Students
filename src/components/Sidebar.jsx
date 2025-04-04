import React, { useContext, useState } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import { AuthContext } from '../context/AuthContext';
import { FiPlus, FiUsers, FiHome } from 'react-icons/fi';
import '../App.css';

const Sidebar = () => {
  const { projects, joinProject, createProject } = useContext(ProjectContext);
  const { user } = useContext(AuthContext);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [projectCode, setProjectCode] = useState('');

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName);
      setNewProjectName('');
      setShowCreateModal(false);
    }
  };

  const handleJoinProject = () => {
    if (projectCode.trim()) {
      joinProject(projectCode);
      setProjectCode('');
      setShowJoinModal(false);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Project Groups</h3>
        <div className="sidebar-actions">
          <button onClick={() => setShowCreateModal(true)} className="icon-button">
            <FiPlus />
          </button>
        </div>
      </div>
      
      <div className="project-list">
        <div className="project-item">
          <FiHome />
          <span>Home</span>
        </div>
        {projects.map(project => (
          <div key={project.id} className="project-item">
            <FiUsers />
            <span>{project.name}</span>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create New Project</h3>
            <input
              type="text"
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button onClick={handleCreateProject}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Join Project Modal */}
      {showJoinModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Join Project</h3>
            <input
              type="text"
              placeholder="Project Code"
              value={projectCode}
              onChange={(e) => setProjectCode(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={() => setShowJoinModal(false)}>Cancel</button>
              <button onClick={handleJoinProject}>Join</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;