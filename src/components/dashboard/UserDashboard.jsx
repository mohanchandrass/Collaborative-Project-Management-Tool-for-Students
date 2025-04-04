import React, { useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { TaskContext } from '../../context/TaskContext';  // Import from correct file
import { AuthContext } from '../../context/AuthContext';
import '../../App.css';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const { tasks } = useContext(TaskContext);

  const userTasks = tasks.filter(task => task.assignedTo === user.id);
  const completedTasks = userTasks.filter(task => task.status === 'completed').length;
  const overdueTasks = userTasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
  ).length;

  return (
    <div className="dashboard-section user-dashboard">
      <h3>Your Dashboard</h3>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h4>Your Tasks</h4>
          <p>{userTasks.length}</p>
        </div>
        <div className="stat-card">
          <h4>Completed</h4>
          <p>{completedTasks}</p>
        </div>
        <div className="stat-card">
          <h4>Overdue</h4>
          <p>{overdueTasks}</p>
        </div>
      </div>
      <div className="task-preview">
        <h4>Recent Tasks</h4>
        {userTasks.slice(0, 3).map(task => (
          <div key={task.id} className="task-preview-item">
            <span>{task.title}</span>
            <span className={`status-badge ${task.status}`}>
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;