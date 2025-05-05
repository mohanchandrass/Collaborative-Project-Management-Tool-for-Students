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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!tasks || !currentProject) {
    return (
      <div style={styles.homeWrapper}>
        <section style={styles.heroSection}>
          <h1 style={styles.heroTitle}>Welcome to ProjectHub</h1>
          <p style={styles.heroSubtitle}>Your all-in-one Agile collaboration and task management platform.</p>
        </section>
  
        <section style={styles.featuresSection}>
          <div style={styles.featureCard}>
            <h3>📊 Real-Time Dashboards</h3>
            <p>Visualize task progress and team performance in real-time.</p>
          </div>
          <div style={styles.featureCard}>
            <h3>👥 Group Collaboration</h3>
            <p>Effortless group communication with integrated chat and notes.</p>
          </div>
          <div style={styles.featureCard}>
            <h3>⚙️ Agile Tools</h3>
            <p>Plan sprints, log retros, and keep track of standups in one place.</p>
          </div>
        </section>
  
        <footer style={styles.footer}>
          <p>Connect with us</p>
          <div style={styles.socialLinks}>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram</a> |{" "}
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer">Facebook</a> |{" "}
            <a href="mailto:support@taskpilot.com">Email</a>
          </div>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#777' }}>
            © 2025 TaskPilot Inc. All rights reserved.
          </p>
        </footer>
      </div>
    );
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

  const handleLogin = () => {
    setIsLoggedIn(true); // Simulate successful login
  };

  return (
    <div style={styles.container}>
      {!isLoggedIn ? (
        <div style={styles.loginWrapper}>
          <div style={styles.loginCard}>
            <h2 style={styles.loginTitle}>Login to ProjectHub</h2>
            <input
              type="text"
              style={styles.input}
              placeholder="Username"
            />
            <input
              type="password"
              style={styles.input}
              placeholder="Password"
            />
            <button style={styles.loginButton} onClick={handleLogin}>
              Log In
            </button>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default ProjectDashboard;

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'rgba(0, 0, 0, 0.5)', // Transparent background
    color: '#fff',
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    position: 'relative', // Ensures the container fits the page
    zIndex: 0,
  },
  loginWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    position: 'absolute', // Ensures it stays centered in fullscreen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)', // Semi-transparent overlay
    zIndex: 10, // Places login above content
  },
  loginCard: {
    background: 'rgba(0, 0, 0, 0.8)', // Transparent background for login card
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
    width: '300px',
    backdropFilter: 'blur(10px)', // Optional blur effect
  },
  input: {
    width: '100%',
    padding: '0.8rem',
    marginBottom: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    background: 'rgba(255, 255, 255, 0.2)', // Transparent input background
    color: '#ecf0f1',
  },
  loginButton: {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '6px',
    background: '#2980b9',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
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
    background: 'rgba(0, 0, 0, 0.5)', // Transparent background for stat cards
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
    background: 'rgba(0, 0, 0, 0.5)', // Transparent background for chart box
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
    background: 'rgba(0, 0, 0, 0.5)', // Transparent background for notes section
    padding: '1rem',
    borderRadius: '8px',
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    padding: '0.75rem',
    borderRadius: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Transparent textarea background
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
  
  // Home Section Styles
  homeWrapper: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#f4f4f4',
    background: 'rgba(0, 0, 0, 0.5)', // Transparent background
    borderRadius: '8px',
    position: 'relative', // Fullscreen positioning
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    zIndex: 0, 
  },
  
  heroSection: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  
  heroTitle: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
    color: '#00bfa6',
  },
  
  heroSubtitle: {
    fontSize: '1.25rem',
    color: '#ccc',
  },
  
  featuresSection: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '1.5rem',
    flexWrap: 'wrap',
    marginBottom: '3rem',
  },
  
  featureCard: {
    flex: '1',
    minWidth: '250px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background for feature cards
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#ddd',
  },
  
  footer: {
    textAlign: 'center',
    paddingTop: '2rem',
    borderTop: '1px solid #333',
    marginTop: '2rem',
    color: '#aaa',
  },
  
  socialLinks: {
    marginTop: '0.5rem',
    fontSize: '1rem',
  },
};
