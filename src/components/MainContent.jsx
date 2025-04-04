import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProjectDashboard from './dashboard/ProjectDashboard';
import UserDashboard from './dashboard/UserDashboard';
import TaskList from './tasks/TaskList';
import ChatWindow from './chat/ChatWindow';
import SprintBacklog from './sprints/SprintBacklog';
import SprintPlanning from './sprints/SprintPlanning';
import Notifications from './notifications/Notifications';
import ReportGenerator from './reports/ReportGenerator';
import '../App.css';

const MainContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="main-content">
      <div className="content-header">
        <h2>Project Management</h2>
        <div className="tabs">
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={activeTab === 'tasks' ? 'active' : ''}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
          <button
            className={activeTab === 'sprints' ? 'active' : ''}
            onClick={() => setActiveTab('sprints')}
          >
            Sprints
          </button>
          <button
            className={activeTab === 'chat' ? 'active' : ''}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
          <button
            className={activeTab === 'reports' ? 'active' : ''}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>
      </div>

      <div className="content-body">
        {activeTab === 'dashboard' && (
          <>
            <ProjectDashboard />
            <UserDashboard />
          </>
        )}
        {activeTab === 'tasks' && <TaskList />}
        {activeTab === 'sprints' && (
          <>
            <SprintPlanning />
            <SprintBacklog />
          </>
        )}
        {activeTab === 'chat' && <ChatWindow />}
        {activeTab === 'reports' && <ReportGenerator />}
      </div>

      <Notifications />
    </div>
  );
};

export default MainContent;