import React, { useContext } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2'; // Correct import names
import { ProjectContext } from '../../context/ProjectContext';
import { TaskContext } from '../../context/TaskContext';
import '../../App.css';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const ProjectDashboard = () => {
  const { currentProject } = useContext(ProjectContext);
  const { tasks } = useContext(TaskContext);

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;

  const pieData = {
    labels: ['Completed', 'In Progress', 'To Do'],
    datasets: [
      {
        data: [completedTasks, inProgressTasks, todoTasks],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        hoverBackgroundColor: ['#66BB6A', '#FFD54F', '#EF5350'],
      },
    ],
  };

  const barData = {
    labels: ['Completed', 'In Progress', 'To Do'],
    datasets: [
      {
        label: 'Tasks Status',
        data: [completedTasks, inProgressTasks, todoTasks],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
      },
    ],
  };

  return (
    <div className="dashboard-section">
      <h3>{currentProject?.name || 'Project'} Dashboard</h3>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h4>Total Tasks</h4>
          <p>{tasks.length}</p>
        </div>
        <div className="stat-card">
          <h4>Completed</h4>
          <p>{completedTasks}</p>
        </div>
        <div className="stat-card">
          <h4>In Progress</h4>
          <p>{inProgressTasks}</p>
        </div>
        <div className="stat-card">
          <h4>To Do</h4>
          <p>{todoTasks}</p>
        </div>
      </div>
      <div className="dashboard-charts">
        <div className="chart-container">
          <Pie data={pieData} /> {/* Changed from PieChart to Pie */}
        </div>
        <div className="chart-container">
          <Bar data={barData} /> {/* Changed from BarChart to Bar */}
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;