import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { firestore } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FaCalculator, FaChartLine, FaBook, FaFileAlt} from 'react-icons/fa';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [currentSprint, setCurrentSprint] = useState(null);
  const [taskCounts, setTaskCounts] = useState({
    toDo: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(firestore, 'projects'), where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const userProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(userProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    if (currentUser) fetchProjects();
  }, [currentUser]);

  useEffect(() => {
    const fetchSprintDetails = async () => {
      try {
        const sprintSnapshot = await getDocs(collection(firestore, 'sprints'));
        const activeSprint = sprintSnapshot.docs.find(doc => doc.data().status === 'active');
        
        if (activeSprint) {
          const sprintData = activeSprint.data();
          const counts = { toDo: 0, inProgress: 0, completed: 0 };
          
          sprintData.tasks?.forEach(task => {
            if (task.status === 'To Do') counts.toDo++;
            if (task.status === 'In Progress') counts.inProgress++;
            if (task.status === 'Completed') counts.completed++;
          });
          
          setCurrentSprint(sprintData);
          setTaskCounts(counts);
        }
      } catch (error) {
        console.error('Error fetching sprint details:', error);
      }
    };

    fetchSprintDetails();
  }, [currentUser]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Project Dashboard</h1>
        <p className="dashboard-subtitle">
          Manage your projects, monitor progress, and stay updated with your current sprint.
        </p>
      </header>

      <div className="dashboard-grid">
        <section className="dashboard-card instructions-card">
          <h2>Project Management Guide</h2>
          <ol className="instruction-list">
            <li className="instruction-item">
              <span className="instruction-step">1</span>
              <div>
                <h3>Create a New Project</h3>
                <p>Fill out the project details form with name, description, and deadline.</p>
              </div>
            </li>
            <li className="instruction-item">
              <span className="instruction-step">2</span>
              <div>
                <h3>Add Tasks</h3>
                <p>Specify task details and assign them to team members.</p>
              </div>
            </li>
            <li className="instruction-item">
              <span className="instruction-step">3</span>
              <div>
                <h3>View Projects</h3>
                <p>Navigate to the Projects section to view and edit your projects.</p>
              </div>
            </li>
            <li className="instruction-item">
              <span className="instruction-step">4</span>
              <div>
                <h3>Monitor Progress</h3>
                <p>Track task status (To Do, In Progress, Completed).</p>
              </div>
            </li>
            <li className="instruction-item">
              <span className="instruction-step">5</span>
              <div>
                <h3>Complete Tasks</h3>
                <p>Mark tasks as completed to update project progress.</p>
              </div>
            </li>
          </ol>
        </section>

        {currentSprint && (
          <section className="dashboard-card sprint-card">
            <h2>Current Sprint</h2>
            <div className="sprint-details">
              <div className="sprint-info">
                <h3>{currentSprint.name}</h3>
                <p>{currentSprint.startDate} - {currentSprint.endDate}</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${currentSprint.progress}%` }}
                  ></div>
                </div>
                <span>{currentSprint.progress}% Complete</span>
              </div>
              <div className="task-stats">
                <div className="stat-item">
                  <span className="stat-number">{taskCounts.toDo}</span>
                  <span className="stat-label">To Do</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{taskCounts.inProgress}</span>
                  <span className="stat-label">In Progress</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{taskCounts.completed}</span>
                  <span className="stat-label">Completed</span>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="dashboard-card tools-card">
          <h2>Quick Tools</h2>
          <div className="tools-grid">
            <Link to="/calculator" className="tool-button">
              <div className="tool-icon">
                <FaCalculator size={24} />
              </div>
              <span>Calculator</span>
            </Link>
            <Link to="/chart-generator" className="tool-button">
              <div className="tool-icon">
                <FaChartLine size={24} />
              </div>
              <span>Generate Chart</span>
            </Link>
            <Link to="/dictionary" className="tool-button">
              <div className="tool-icon">
                <FaBook size={24} />
              </div>
              <span>Dictionary</span>
            </Link>
            <Link to="/report-generator" className="tool-button">
              <div className="tool-icon">
                <FaFileAlt size={24} />
              </div>
              <span>Report Generator</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
