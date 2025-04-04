import React, { useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ProjectContext } from '../../context/ProjectContext';
import { TaskContext } from '../../context/TaskContext';
import '../../App.css';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const ReportGenerator = () => {
  const { currentProject } = useContext(ProjectContext);
  const { tasks } = useContext(TaskContext);

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;

  const chartData = {
    labels: ['Completed', 'In Progress', 'To Do'],
    datasets: [
      {
        data: [completedTasks, inProgressTasks, todoTasks],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
      },
    ],
  };

  const generateReport = () => {
    alert('Report generation would create a PDF download in a real application');
  };

  return (
    <div className="report-container">
      <h3>Project Report</h3>
      <div className="report-content">
        <div className="report-summary">
          <h4>{currentProject?.name || 'Project'} Summary</h4>
          <p>Total Tasks: {tasks.length}</p>
          <p>Completed: {completedTasks}</p>
          <p>In Progress: {inProgressTasks}</p>
          <p>To Do: {todoTasks}</p>
        </div>
        <div className="report-chart">
          <Pie data={chartData} />  {/* Changed from PieChart to Pie */}
        </div>
      </div>
      <button onClick={generateReport} className="primary-button">
        Generate Report
      </button>
    </div>
  );
};

export default ReportGenerator;