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
        <h1>Project Dashboard</h1><br></br>
        <h2>Add</h2><br></br>
        <Link to="/create-project" className="create-project-button">
          + New Project
        </Link>
      </header>

      <section className="projects-overview">
  <div className="projects-header">
    <h2>My Projects</h2><br></br>
    {/* 👇 Add the button here */}
    <Link to="/my-projects" className="view-projects-button">
      View All My Projects
    </Link>
    
  </div>
  <div className="project-cards">
    
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
        <br></br>
        <Link to="/task-status" className="view-projects-button">
  View Task Status
</Link>
      </section>
    </div>
  );
};

export default Dashboard;
