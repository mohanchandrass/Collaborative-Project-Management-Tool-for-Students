import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react'; 
import { firestore } from '../../firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  getDoc,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import '../../styles/TaskStatus.css';

const TaskStatus = forwardRef(({ groupId }, ref) => {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('Not Started');
  const [newAssignedTo, setNewAssignedTo] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newUserStory, setNewUserStory] = useState('');
  const [newPoints, setNewPoints] = useState(1); // Default to 1 point

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(firestore, 'groups', groupId, 'tasks')),
      (querySnapshot) => {
        const loadedTasks = [];
        querySnapshot.forEach((doc) => {
          loadedTasks.push({ id: doc.id, ...doc.data() });
        });
        setTasks(loadedTasks);
      }
    );

    const fetchGroupMembers = async () => {
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
    fetchGroupMembers();

    const projectsRef = collection(firestore, 'groups', groupId, 'projects');
    const unsubProjects = onSnapshot(projectsRef, (snapshot) => {
      const projs = snapshot.docs.map(doc => doc.data().name);
      setProjects(projs);
    });

    return () => {
      unsubscribe();
      unsubProjects();
    };
  }, [groupId]);

  // 🔥 Export to Excel (exposed to parent)
  const exportToExcel = () => {
    if (!tasks || tasks.length === 0) {
      alert("No tasks available to export.");
      return;
    }

    const memberMap = Object.fromEntries(members.map(m => [m.id, m.displayName]));

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
  };

  // 👇 Expose the export function to parent
  useImperativeHandle(ref, () => ({
    exportToExcel,
  }));

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    try {
      await addDoc(collection(firestore, 'groups', groupId, 'tasks'), {
        name: newTaskName,
        status: newTaskStatus,
        assignedTo: newAssignedTo || '',
        projectName: newProjectName || '',
        userStory: newUserStory || '',
        points: newPoints,
        groupId,
      });
      setNewTaskName('');
      setNewTaskStatus('Not Started');
      setNewAssignedTo('');
      setNewProjectName('');
      setNewUserStory('');
      setNewPoints(1);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleStatusChange = async (id, key, value) => {
    try {
      const taskRef = doc(firestore, 'groups', groupId, 'tasks', id);
      await updateDoc(taskRef, { [key]: value });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'groups', groupId, 'tasks', id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getStatusCount = (status) => tasks.filter((task) => task.status === status).length;

  return (
    <div className="task-status-container">
      <h2>
        Task Status
      </h2>
      <button 
  style={{ 
    backgroundColor: '#2ca3ff', 
    color: 'white', 
    fontWeight: '600', 
    padding: '0.5rem 1rem', 
    borderRadius: '8px', 
    border: 'none', 
    cursor: 'pointer', 
    transition: 'background-color 0.2s ease, transform 0.2s ease' 
  }}
  onMouseEnter={(e) => e.target.style.backgroundColor = '#3d4353'}
  onMouseLeave={(e) => e.target.style.backgroundColor = '#2ca3ff'}
>
  View Chart
</button>
      <div className="task-status-cards">
        {['Not Started', 'In Progress', 'Completed'].map((status) => (
          <div className="task-card" key={status}>
            <h4>{status}</h4>
            <p>{getStatusCount(status)} Tasks</p>
          </div>
        ))}
      </div>

      <button onClick={exportToExcel} className="export-btn" style={{ 
    backgroundColor: '#2ca3ff', 
    color: 'white', 
    fontWeight: '600', 
    padding: '0.5rem 1rem', 
    borderRadius: '8px', 
    border: 'none', 
    cursor: 'pointer', 
    transition: 'background-color 0.2s ease, transform 0.2s ease' 
  }}
  onMouseEnter={(e) => e.target.style.backgroundColor = '#3d4353'}
  onMouseLeave={(e) => e.target.style.backgroundColor = '#2ca3ff'}>
  📥 Export Product Backlog
</button>


      <h3>Add New Task</h3>
<form onSubmit={handleAddTask} className="add-task-form">
  <div className="form-group">
    <label>Task Name</label>
    <input
      type="text"
      placeholder="Enter task name"
      value={newTaskName}
      onChange={(e) => setNewTaskName(e.target.value)}
      required
    />
  </div>

  <div className="form-group">
    <label>Status</label>
    <select value={newTaskStatus} onChange={(e) => setNewTaskStatus(e.target.value)}>
      <option>Not Started</option>
      <option>In Progress</option>
      <option>Completed</option>
    </select>
  </div>

  <div className="form-group">
    <label>Assign To</label>
    <select value={newAssignedTo} onChange={(e) => setNewAssignedTo(e.target.value)}>
      <option value="">Assign To</option>
      {members && members.map((m) => (
        <option key={m.id} value={m.id}>{m.displayName}</option>
      ))}
    </select>
  </div>

  <div className="form-group">
    <label>Project</label>
    <select value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)}>
      <option value="">Select Project</option>
      {projects && projects.map((p, idx) => <option key={idx} value={p}>{p}</option>)}
    </select>
  </div>

  <div className="form-group">
    <label>User Story</label>
    <textarea
      placeholder="Enter user story"
      value={newUserStory}
      onChange={(e) => setNewUserStory(e.target.value)}
    />
  </div>

  <div className="form-group">
    <label>Story Points</label>
    <input
      type="number"
      value={newPoints}
      onChange={(e) => setNewPoints(Number(e.target.value))}
      min="1"
      max="10"
    />
  </div>

  <div className="form-divider"></div>

  <button type="submit" className="add-task-btn">Add Task</button>
</form>


      <h3>Manage Tasks</h3>
      <div className="task-list">
        {tasks && tasks.map(task => (
          <div key={task.id} className="task-item">
            <strong>{task.name}</strong>
            <p>User Story: {task.userStory || 'N/A'}</p>
            <p>Story Points: {task.points}</p>
            <p>Status:
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, 'status', e.target.value)}
              >
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </p>
            <p>Assign To:
              <select
                value={task.assignedTo || ''}
                onChange={(e) => handleStatusChange(task.id, 'assignedTo', e.target.value)}
              >
                <option value="">Assign To</option>
                {members && members.map((m) => (
                  <option key={m.id} value={m.id}>{m.displayName}</option>
                ))}
              </select>
            </p>
            <p>Select project:
              <select
                value={task.projectName || ''}
                onChange={(e) => handleStatusChange(task.id, 'projectName', e.target.value)}
              >
                <option value="">Select Project</option>
                {projects && projects.map((p, idx) => <option key={idx} value={p}>{p}</option>)}
              </select>
            </p>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
});

export default TaskStatus;
