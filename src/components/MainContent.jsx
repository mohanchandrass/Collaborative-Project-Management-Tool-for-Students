import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

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

const MainContent = ({ selectedProjectId }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!selectedProjectId) return;

      const projectDocRef = doc(firestore, 'projects', selectedProjectId);
      try {
        const projectSnap = await getDoc(projectDocRef);
        if (projectSnap.exists()) {
          setProject(projectSnap.data());
        } else {
          console.error("Project not found");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProjectData();
  }, [selectedProjectId]);

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
          <div className="dashboard-grid">
            <ProjectDashboard project={project} />
            <UserDashboard />
          </div>
        );
      case 'tasks':
        return <TaskList project={project} />;
      case 'sprints':
        return (
          <>
            <SprintPlanning project={project} />
            <SprintBacklog project={project} />
          </>
        );
      case 'chat':
        return <ChatWindow project={project} />;
      case 'reports':
        return <ReportGenerator project={project} />;
      default:
        return null;
    }
  };

  if (!project) {
    return <div>Loading project data...</div>;
  }

  return (
    <div className="main-content">
      <div className="content-header">
        <h2>{project.name}</h2>
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
          <button
            className="my-projects-btn"
            onClick={() => navigate('/projects')}
          >
            My Projects
          </button>
        </div>
      </div>

      <div className="content-body">
        {renderTabContent()}
        <button onClick={saveData} className="save-demo-button">
          Save Example Doc
        </button>
      </div>

      <Notifications />

      <style jsx="true">{`
        .main-content {
          padding: 0;
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          flex-direction: column;
          height: 100vh;
          background-color: #1e1e2f;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #333;
          padding: 20px;
        }

        .tabs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .tabs button {
          padding: 10px 15px;
          border: none;
          background-color: #2e2e3e;
          color: white;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.2s ease;
        }

        .tabs button.active {
          background-color: #007bff;
        }

        .tabs button:hover {
          background-color: #3a3a4a;
        }

        .content-body {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
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

        .my-projects-btn {
          background-color: #673ab7;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }

        .my-projects-btn:hover {
          background-color: #5e35b1;
        }

        .dashboard-grid {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
};

export default MainContent;
