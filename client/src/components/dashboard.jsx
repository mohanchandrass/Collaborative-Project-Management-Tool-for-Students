import React, { useState, useEffect } from 'react';    
import { Link, useNavigate } from 'react-router-dom';
import { firestore, auth } from '../firebase'; // Import auth from firebase
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { FaFolder, FaUsers, FaCheckSquare, FaFileAlt, FaTasks } from 'react-icons/fa';
import '../styles/Dashboard.css';
import * as XLSX from 'xlsx';

const Dashboard = ({ groupId, setActiveTab }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [currentSprint, setCurrentSprint] = useState(null);
  const [taskCounts, setTaskCounts] = useState({
    toDo: 0,
    inProgress: 0,
    completed: 0,
  });
  const [members, setMembers] = useState([]);

  // Fetch user projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.error("User is not logged in.");
          navigate("/login"); // Redirect to login page if the user is not authenticated
          return;
        }

        const q = query(collection(firestore, 'projects'), where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const userProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(userProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [navigate]);

  // Fetch sprint details and task counts
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
  }, []);

  // Fetch members of the group
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const groupRef = doc(firestore, 'groups', groupId);
        const groupSnap = await getDoc(groupRef);
        if (groupSnap.exists()) {
          const groupData = groupSnap.data();
          if (groupData.members && Array.isArray(groupData.members)) {
            const fetchedMembers = await Promise.all(
              groupData.members.map(async (memberId) => {
                const userRef = doc(firestore, 'users', memberId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                  const userData = userSnap.data();
                  return {
                    id: memberId,
                    displayName: userData.displayName || userData.username || userData.email || 'Unnamed',
                  };
                }
                return null;
              })
            );
            setMembers(fetchedMembers.filter(Boolean));
          }
        }
      } catch (err) {
        console.error('Failed to fetch group members:', err);
      }
    };
    fetchMembers();
  }, [groupId]);

  // Export backlog to Excel
  const exportBacklogToExcel = async () => {
    try {
      if (!groupId) {
        console.error("Group ID is not available.");
        return;
      }

      const tasksRef = collection(firestore, 'groups', groupId, 'tasks');
      const projectRef = collection(firestore, 'groups', groupId, 'projects');

      // Fetch tasks for the group
      const taskSnapshot = await getDocs(tasksRef);
      const tasks = taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fetch projects for the group
      const projectSnapshot = await getDocs(projectRef);
      const projects = projectSnapshot.docs.map(doc => doc.data().name);

      if (!tasks.length) {
        alert("No tasks available to export.");
        return;
      }

      const memberMap = {}; // Map user ID to display name
      members.forEach(member => {
        memberMap[member.id] = member.displayName;
      });

      // Create a workbook instance
      const workbook = XLSX.utils.book_new();

      // Group tasks by project name
      const groupedTasks = tasks.reduce((acc, task) => {
        const projectName = task.projectName || 'Unnamed Project';
        if (!acc[projectName]) {
          acc[projectName] = [];
        }
        acc[projectName].push({
          Name: task.name || '',
          Status: task.status || '',
          AssignedTo: memberMap[task.assignedTo] || '',
          UserStory: task.userStory || '',
          'Story Points': typeof task.points === 'number' ? task.points : 0,
        });
        return acc;
      }, {});

      // Add a sheet for each project
      Object.keys(groupedTasks).forEach(projectName => {
        const tasksForProject = groupedTasks[projectName];
        const worksheet = XLSX.utils.json_to_sheet(tasksForProject);
        // Add the worksheet with the project name as the sheet name
        XLSX.utils.book_append_sheet(workbook, worksheet, projectName.substring(0, 31)); // Sheet name max length 31
      });

      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `Product_Backlog_By_Project_${currentDate}.xlsx`;

      // Export the workbook to a file
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error('Error exporting backlog:', error);
    }
  };

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

        <section className="dashboard-card quick-access-card">
          <h2>Quick Access</h2>
          <div className="tools-grid">
            <button className="tool-button" onClick={() => setActiveTab('my-projects')}>
              <div className="tool-icon">
                <FaFolder size={24} />
              </div>
              <span>All Projects</span>
            </button>

            <button className="tool-button" onClick={() => setActiveTab('group-chat')}>
              <div className="tool-icon">
                <FaUsers size={24} />
              </div>
              <span>Group Chat</span>
            </button>

            <button className="tool-button" onClick={() => setActiveTab('task-status')}>
              <div className="tool-icon">
                <FaCheckSquare size={24} />
              </div>
              <span>Task Status</span>
            </button>

            <button
              className="tool-button"
              onClick={exportBacklogToExcel}
            >
              <div className="tool-icon">
                <FaTasks size={24} />
              </div>
              <span>Generate Product Backlog</span>
            </button>

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
