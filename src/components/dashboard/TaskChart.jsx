import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../../styles/TaskStatus.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskChart = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [taskCounts, setTaskCounts] = useState({ toDo: 0, inProgress: 0, completed: 0 });

  useEffect(() => {
    if (!groupId) return;

    const unsubscribe = onSnapshot(
      collection(firestore, 'groups', groupId, 'tasks'),
      (snapshot) => {
        let counts = { toDo: 0, inProgress: 0, completed: 0 };

        snapshot.forEach((doc) => {
          const task = doc.data();
          if (task.status === 'Not Started') counts.toDo += 1;
          if (task.status === 'In Progress') counts.inProgress += 1;
          if (task.status === 'Completed') counts.completed += 1;
        });

        setTaskCounts(counts);
      },
      (error) => {
        console.error('Error loading tasks for chart:', error);
      }
    );

    return () => unsubscribe();
  }, [groupId]);

  const chartData = {
    labels: ['Not Started', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [taskCounts.toDo, taskCounts.inProgress, taskCounts.completed],
        backgroundColor: ['#ffcc00', '#ff9900', '#33cc33'],
      },
    ],
  };

  return (
    <div className="task-chart-container" style={{ padding: '2rem' }}>
      <h2>Task Status Overview</h2>
      <div style={{ maxWidth: '500px', margin: 'auto' }}>
        <Pie data={chartData} />
      </div>
      <br />
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default TaskChart;