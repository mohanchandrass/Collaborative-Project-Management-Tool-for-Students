import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { firestore } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext); // Get current user from AuthContext
  const [projects, setProjects] = useState([]);
  const [currentSprint, setCurrentSprint] = useState(null);
  const [taskCounts, setTaskCounts] = useState({
    toDo: 0,
    inProgress: 0,
    completed: 0,
  });

  // Fetch the user's projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(firestore, 'projects'), where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);

        const userProjects = [];
        querySnapshot.forEach(doc => {
          userProjects.push({ id: doc.id, ...doc.data() });
        });
        setProjects(userProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    if (currentUser) {
      fetchProjects();
    }
  }, [currentUser]);

  // Fetch current sprint and task counts
  useEffect(() => {
    const fetchSprintDetails = async () => {
      try {
        const sprintSnapshot = await getDocs(collection(firestore, 'sprints'));
        let sprintData = null;
        let taskCounts = { toDo: 0, inProgress: 0, completed: 0 };

        sprintSnapshot.forEach(doc => {
          const sprint = doc.data();
          if (sprint.status === 'active') {
            sprintData = sprint;
            taskCounts = { toDo: 0, inProgress: 0, completed: 0 };

            // Count task statuses for the active sprint
            sprint.tasks.forEach(task => {
              if (task.status === 'To Do') taskCounts.toDo += 1;
              if (task.status === 'In Progress') taskCounts.inProgress += 1;
              if (task.status === 'Completed') taskCounts.completed += 1;
            });
          }
        });

        setCurrentSprint(sprintData);
        setTaskCounts(taskCounts);
      } catch (error) {
        console.error('Error fetching sprint details:', error);
      }
    };

    fetchSprintDetails();
  }, [currentUser]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Project Dashboard</h1>
        <Link to="/create-project" className="create-project-button">
          + New Project
        </Link>
      </header>

      <section className="projects-overview">
        <h2>My Projects</h2>
        <div className="project-cards">
          {projects.length === 0 ? (
            <p>No projects available.</p>
          ) : (
            projects.map(project => (
              <div key={project.id} className="project-card">
                <h3>{project.name}</h3>
                <p>Status: {project.status}</p>
                <Link to={`/projects/${project.id}`}>View Details</Link>
              </div>
            ))
          )}
        </div>
      </section>

      {currentSprint && (
        <section className="sprint-progress">
          <h2>Current Sprint</h2>
          <div className="sprint-details">
            <p>Sprint Name: {currentSprint.name}</p>
            <p>Duration: {currentSprint.startDate} - {currentSprint.endDate}</p>
            <p>Progress: {currentSprint.progress}%</p>
            {/* Add a progress bar or chart if desired */}
          </div>
        </section>
      )}

      <section className="task-status">
        <h2>Task Status</h2>
        <div className="task-status-cards">
          <div className="task-card">
            <h4>To Do</h4>
            <p>{taskCounts.toDo} Tasks</p>
          </div>
          <div className="task-card">
            <h4>In Progress</h4>
            <p>{taskCounts.inProgress} Tasks</p>
          </div>
          <div className="task-card">
            <h4>Completed</h4>
            <p>{taskCounts.completed} Tasks</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
