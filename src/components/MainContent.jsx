import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

import ProjectDashboard from './dashboard/ProjectDashboard';
import UserDashboard from './dashboard/UserDashboard';
import TaskList from './tasks/TaskList';
import ChatWindow from './chat/ChatWindow';
import SprintBacklog from './sprints/SprintBacklog';
import SprintPlanning from './sprints/SprintPlanning';
import Notifications from './notifications/Notifications';
import ReportGenerator from './reports/ReportGenerator';

const TABS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'tasks', label: 'Tasks' },
  { key: 'sprints', label: 'Sprints' },
  { key: 'chat', label: 'Chat' },
  { key: 'reports', label: 'Reports' },
];

const MainContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const storedTab = localStorage.getItem('activeTab');
    if (storedTab) setActiveTab(storedTab);
  }, []);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const saveData = async () => {
    const docId = 'exampleDoc';
    const data = { title: "New Document", content: "This is a test." };
    try {
      await setDoc(doc(firestore, 'documents', docId), data);
      alert('Data saved to Firestore!');
    } catch (error) {
      console.error('Error writing document: ', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <ProjectDashboard />
            <UserDashboard />
          </>
        );
      case 'tasks':
        return <TaskList />;
      case 'sprints':
        return (
          <>
            <SprintPlanning />
            <SprintBacklog />
          </>
        );
      case 'chat':
        return <ChatWindow />;
      case 'reports':
        return <ReportGenerator />;
      default:
        return null;
    }
  };

  return (
    <div className="main-content">
      <div className="content-header">
        <h2>Project Management</h2>
        <div className="tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? 'active' : ''}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="content-body">
        {renderTabContent()}
        <button onClick={saveData} className="save-demo-button">
          Save Example Doc
        </button>
      </div>

      <Notifications />

      {/* Inline CSS for the component */}
      <style jsx="true">{`
        .main-content {
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #eee;
          padding-bottom: 10px;
        }

        .tabs {
          display: flex;
          gap: 10px;
        }

        .tabs button {
          padding: 10px 15px;
          border: none;
          background-color: #f1f1f1;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.2s ease;
        }

        .tabs button.active {
          background-color: #007bff;
          color: white;
        }

        .tabs button:hover {
          background-color: #e0e0e0;
        }

        .content-body {
          margin-top: 20px;
        }

        .save-demo-button {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        .save-demo-button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default MainContent;
