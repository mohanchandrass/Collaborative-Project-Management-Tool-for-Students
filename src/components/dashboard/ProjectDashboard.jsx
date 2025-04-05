import React, { useContext } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
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
  BarElement,
  Title
);

const ProjectDashboard = () => {
  const { currentProject } = useContext(ProjectContext);
  const { tasks } = useContext(TaskContext);

  if (!tasks || !currentProject) {
    return <div>Loading dashboard...</div>;
  }

  // Calculate task status counts
  const taskStatusCount = (tasks || []).reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const completedTasks = taskStatusCount['completed'] || 0;
  const inProgressTasks = taskStatusCount['in-progress'] || 0;
  const todoTasks = taskStatusCount['todo'] || 0;

  // Pie Chart Data
  const pieData = {
    labels: ['Completed', 'In Progress', 'To Do'],
    datasets: [
      {
        data: [completedTasks, inProgressTasks, todoTasks],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(255, 99, 132, 0.7)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Bar Chart Data
  const barData = {
    labels: ['Tasks'],
    datasets: [
      {
        label: 'Completed',
        data: [completedTasks],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
      {
        label: 'In Progress',
        data: [inProgressTasks],
        backgroundColor: 'rgba(255, 206, 86, 0.7)',
      },
      {
        label: 'To Do',
        data: [todoTasks],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Task Status Distribution',
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>{currentProject?.name || 'Project'} Dashboard</h2>
      </header>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <h3>Total Tasks</h3>
          <p>{tasks.length}</p>
        </div>
        <div className="stat-card completed">
          <h3>Completed</h3>
          <p>{completedTasks}</p>
        </div>
        <div className="stat-card in-progress">
          <h3>In Progress</h3>
          <p>{inProgressTasks}</p>
        </div>
        <div className="stat-card todo">
          <h3>To Do</h3>
          <p>{todoTasks}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-wrapper">
          <h3>Task Status Pie Chart</h3>
          <div className="chart">
            <Pie data={pieData} options={options} />
          </div>
        </div>
        <div className="chart-wrapper">
          <h3>Task Status Bar Chart</h3>
          <div className="chart">
            <Bar data={barData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;