import React, { useEffect, useState } from 'react';
import { firestore } from '../../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom';
import '../../styles/TaskStatus.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskChart = ({ groupId }) => {
  const [taskCounts, setTaskCounts] = useState({ toDo: 0, inProgress: 0, completed: 0 });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(firestore, 'tasks'), where('groupId', '==', groupId)),
      (snapshot) => {
        let counts = { toDo: 0, inProgress: 0, completed: 0 };

        snapshot.forEach((doc) => {
          const task = doc.data();
          if (task.status === 'Not Started') counts.toDo += 1;
          if (task.status === 'In Progress') counts.inProgress += 1;
          if (task.status === 'Completed') counts.completed += 1;
        });

        setTaskCounts(counts);
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
      <Link to="/TaskStatus">
        <button className="back-button">Back to Task Manager</button>
      </Link>
    </div>
  );
};

export default TaskChart;
