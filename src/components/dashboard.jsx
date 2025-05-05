import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { firestore } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FaCalculator, FaChartLine, FaBook, FaFileAlt } from 'react-icons/fa';
import '../styles/Dashboard.css';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [currentSprint, setCurrentSprint] = useState(null);
  const [taskCounts, setTaskCounts] = useState({
    toDo: 0,
    inProgress: 0,
    completed: 0,
  });
  const [projectProgressData, setProjectProgressData] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(firestore, 'projects'), where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const userProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(userProjects);

        // Prepare data for project progress visualization
        const progressData = userProjects.map(project => ({
          name: project.name,
          completed: project.tasks?.filter(task => task.status === 'Completed').length || 0,
          total: project.tasks?.length || 0,
        }));
        setProjectProgressData(progressData);

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

  const pieChartData = [
    { name: 'To Do', value: taskCounts.toDo },
    { name: 'In Progress', value: taskCounts.inProgress },
    { name: 'Completed', value: taskCounts.completed },
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Project Dashboard</h1>
        <p className="dashboard-subtitle">
          Your central hub for project overview and quick access.
        </p>
      </header>

      <div className="dashboard-grid">
        <section className="dashboard-card quick-overview-card">
          <h2>Quick Overview</h2>
          <div className="overview-stats">
            <div className="stat-box">
              <FaFileAlt className="stat-icon" />
              <span>{projects.length} Projects</span>
            </div>
            {currentSprint && (
              <>
                <div className="stat-box">
                  <FaBook className="stat-icon" />
                  <span>Current Sprint: {currentSprint.name}</span>
                </div>
                <div className="stat-box">
                  <FaCalculator className="stat-icon" />
                  <span>{currentSprint.progress}% Sprint Progress</span>
                </div>
              </>
            )}
          </div>

          {currentSprint && (
            <div className="sprint-task-pie-chart">
              <h3>Current Sprint Task Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="dashboard-card project-progress-card">
          <h2>Your Projects' Progress</h2>
          {projectProgressData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Tasks', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                <Bar dataKey="total" fill="#8884d8" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No projects available to display progress.</p>
          )}
        </section>

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
          <section className="dashboard-card sprint-details-card">
            <h2>Current Sprint Details</h2>
            <div className="sprint-details">
              <div className="sprint-info">
                <h3>{currentSprint.name}</h3>
                <p>
                  <span className="label">Start Date:</span> {currentSprint.startDate}
                </p>
                <p>
                  <span className="label">End Date:</span> {currentSprint.endDate}
                </p>
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
      </div>
    </div>
  );
};

export default Dashboard;