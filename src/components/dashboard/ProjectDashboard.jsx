import React, { useContext, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { ProjectContext } from '../../context/ProjectContext';
import { TaskContext } from '../../context/TaskContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ProjectDashboard = () => {
  const { currentProject } = useContext(ProjectContext);
  const { tasks } = useContext(TaskContext);

  const [agileNotes, setAgileNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);

  if (!tasks || !currentProject) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  const taskStatusCount = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const completedTasks = taskStatusCount['completed'] || 0;
  const inProgressTasks = taskStatusCount['in-progress'] || 0;
  const todoTasks = taskStatusCount['todo'] || 0;

  const pieData = {
    labels: ['Completed', 'In Progress', 'To Do'],
    datasets: [
      {
        data: [completedTasks, inProgressTasks, todoTasks],
        backgroundColor: ['#00bfa6', '#ffc107', '#ff5252'],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Tasks'],
    datasets: [
      { label: 'Completed', data: [completedTasks], backgroundColor: '#00bfa6' },
      { label: 'In Progress', data: [inProgressTasks], backgroundColor: '#ffc107' },
      { label: 'To Do', data: [todoTasks], backgroundColor: '#ff5252' },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
    maintainAspectRatio: false,
  };

  const handleSaveNote = () => {
    if (agileNotes.trim()) {
      setSavedNotes([...savedNotes, agileNotes]);
      setAgileNotes('');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{currentProject.name} Overview</h2>

      <div style={styles.statsContainer}>
        <div style={{ ...styles.statCard, background: '#1abc9c' }}>
          <h4>Total Tasks</h4>
          <p>{tasks.length}</p>
        </div>
        <div style={{ ...styles.statCard, background: '#27ae60' }}>
          <h4>✅ Completed</h4>
          <p>{completedTasks}</p>
        </div>
        <div style={{ ...styles.statCard, background: '#f39c12' }}>
          <h4>⚙️ In Progress</h4>
          <p>{inProgressTasks}</p>
        </div>
        <div style={{ ...styles.statCard, background: '#e74c3c' }}>
          <h4>📝 To Do</h4>
          <p>{todoTasks}</p>
        </div>
      </div>

      <div style={styles.chartGrid}>
        <div style={styles.chartBox}>
          <h4 style={styles.chartTitle}>Task Pie Chart</h4>
          <div style={styles.chart}><Pie data={pieData} options={chartOptions} /></div>
        </div>
        <div style={styles.chartBox}>
          <h4 style={styles.chartTitle}>Task Status Bar</h4>
          <div style={styles.chart}><Bar data={barData} options={chartOptions} /></div>
        </div>
      </div>

      <div style={styles.notesSection}>
        <h3>🧠 Agile Notes</h3>
        <textarea
          style={styles.textarea}
          value={agileNotes}
          onChange={(e) => setAgileNotes(e.target.value)}
          placeholder="Daily standups, retros, sprint planning..."
        />
        <button style={styles.saveButton} onClick={handleSaveNote}>
          Save Note
        </button>
        <ul style={styles.noteList}>
          {savedNotes.map((note, idx) => (
            <li key={idx} style={styles.noteItem}>• {note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectDashboard;

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#f4f4f4',
    background: '#121212',
    borderRadius: '8px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    color: '#ffffff',
  },
  statsContainer: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '2rem',
  },
  statCard: {
    flex: 1,
    minWidth: '150px',
    padding: '1rem',
    borderRadius: '8px',
    color: '#fff',
    textAlign: 'center',
  },
  chartGrid: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
    marginBottom: '2rem',
  },
  chartBox: {
    flex: 1,
    minWidth: '300px',
    padding: '1rem',
    background: '#1e1e1e',
    borderRadius: '8px',
  },
  chartTitle: {
    marginBottom: '1rem',
    fontSize: '1.1rem',
    color: '#ccc',
  },
  chart: {
    height: '300px',
  },
  notesSection: {
    background: '#1e1e1e',
    padding: '1rem',
    borderRadius: '8px',
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    padding: '0.75rem',
    borderRadius: '6px',
    backgroundColor: '#2c2c2c',
    border: '1px solid #555',
    color: '#eee',
    resize: 'vertical',
  },
  saveButton: {
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    backgroundColor: '#2980b9',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  noteList: {
    marginTop: '1rem',
    paddingLeft: '1rem',
    color: '#aaa',
  },
  noteItem: {
    marginBottom: '0.25rem',
  },
  loading: {
    padding: '2rem',
    fontSize: '1.25rem',
    textAlign: 'center',
    color: '#bbb',
  },
};
