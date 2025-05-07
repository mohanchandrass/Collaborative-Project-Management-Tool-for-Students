import React, { useContext, useState, useEffect, useRef } from 'react';
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
import { useNavigate } from 'react-router-dom';

const ProjectDashboard = () => {
  const { currentProject } = useContext(ProjectContext);
  const { tasks } = useContext(TaskContext);
  const navigate = useNavigate();

  const [agileNotes, setAgileNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);

  const featuresRef = useRef(null);
  const benefitsRef = useRef(null);
  const contactRef = useRef(null);
  const homeRef = useRef(null);

  const handleSignInClick = () => {
    navigate('/login');
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!tasks || !currentProject) {
    return (
      <div style={vexStyles.container}>
        <header style={vexStyles.header}>
          <h1 style={vexStyles.logo}>ProjectHub</h1>
          <nav style={vexStyles.nav}>
            <button onClick={() => scrollToSection(homeRef)} style={vexStyles.navLinkButton}>Home</button>
            <button onClick={() => scrollToSection(featuresRef)} style={vexStyles.navLinkButton}>Features</button>
            <button onClick={() => scrollToSection(benefitsRef)} style={vexStyles.navLinkButton}>Benefits</button>
            <button onClick={() => scrollToSection(contactRef)} style={vexStyles.navLinkButton}>Contact</button>
          </nav>
          <button onClick={handleSignInClick} style={vexStyles.signInButton}>Sign-In</button>
        </header>
        <main style={vexStyles.hero} id="home" ref={homeRef}>
          <div style={vexStyles.heroContent}>
            <h2 style={vexStyles.heroTitle}>Power Your Projects<br />with Our App.</h2>
            <p style={vexStyles.heroSubtitle}>Take control of your projects and stay on top of your goals with our intuitive project management app. Say goodbye to chaos and hello to streamlined efficiency. Try it now and experience the difference.</p>
            <button style={vexStyles.manageProjectButton}>Manage a New Project</button>
          </div>
          {/* Placeholder for the image */}
          <div style={vexStyles.heroImagePlaceholder}>
  <img src="/logo.png" alt="Logo" style={{ width: '80%', height: 'auto', objectFit: 'contain' }} />
</div>

        </main>

        <section style={vexStyles.section} id="features" ref={featuresRef}>
          <h2 style={vexStyles.sectionTitle}>Key Features</h2>
          <div style={vexStyles.featuresGrid}>
            <div style={vexStyles.featureCard}>
              <h3>Task Management</h3>
              <p>Organize, assign, and track tasks effortlessly.</p>
            </div>
            <div style={vexStyles.featureCard}>
              <h3>Collaboration Tools</h3>
              <p>Real-time communication and file sharing for seamless teamwork.</p>
            </div>
            <div style={vexStyles.featureCard}>
              <h3>Progress Tracking</h3>
              <p>Monitor project progress with visual dashboards and reports.</p>
            </div>
            <div style={vexStyles.featureCard}>
              <h3>Agile Support</h3>
              <p>Tools designed for Scrum and Kanban methodologies.</p>
            </div>
          </div>
        </section>

        <section style={vexStyles.section} id="benefits" ref={benefitsRef}>
          <h2 style={vexStyles.sectionTitle}>Why Choose ProjectHub?</h2>
          <div style={vexStyles.benefitsList}>
            <li>Improved Team Collaboration</li>
            <li>Increased Project Efficiency</li>
            <li>Better Organization and Planning</li>
            <li>Enhanced Communication</li>
            <li>Data-Driven Insights</li>
          </div>
        </section>

        <section style={vexStyles.section} id="contact" ref={contactRef}>
          <h2 style={vexStyles.sectionTitle}>Contact Us</h2>
          <p style={vexStyles.contactText}>Have questions or need support? Reach out to our team.</p>
          <form style={vexStyles.contactForm}>
            <input type="text" placeholder="Your Name" style={vexStyles.input} />
            <input type="email" placeholder="Your Email" style={vexStyles.input} />
            <textarea placeholder="Your Message" rows="5" style={vexStyles.textarea}></textarea>
            <button type="submit" style={vexStyles.submitButton}>Send Message</button>
          </form>
        </section>

        <footer style={vexStyles.footer}>
          <p>&copy; 2025 ProjectHub. All rights reserved.</p>
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

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{currentProject.name} Overview</h2>

      {/* ... rest of your dashboard code ... */}
    </div>
  );
};

export default ProjectDashboard;

// Your existing styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: '2rem',
    background: 'linear-gradient(to bottom right, #111827, #0f172a)',
    color: '#e5e7eb',
    fontFamily: "'Inter', sans-serif",
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: '700',
    marginBottom: '2rem',
    color: '#10b981',
    textAlign: 'center',
  },
  statsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: '#1f2937',
    padding: '1.25rem',
    borderRadius: '1rem',
    flex: '1 1 240px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    color: '#f9fafb',
  },
  chartGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    justifyContent: 'center',
    marginBottom: '3rem',
  },
  chartBox: {
    backgroundColor: '#1f2937',
    padding: '1.5rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    flex: '1 1 400px',
    minHeight: '350px',
  },
  chartTitle: {
    fontSize: '1.25rem',
    fontWeight: '500',
    color: '#10b981',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  chart: {
    height: '300px',
  },
  notesSection: {
    backgroundColor: '#1f2937',
    padding: '1.5rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  },
  textarea: {
    width: '100%',
    minHeight: '120px',
    backgroundColor: '#111827',
    color: '#f3f4f6',
    border: '1px solid #374151',
    borderRadius: '0.75rem',
    padding: '0.85rem',
    fontSize: '1rem',
    resize: 'vertical',
  },
  saveButton: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    fontWeight: '600',
  },
  noteList: {
    marginTop: '1.5rem',
    color: '#d1d5db',
    paddingLeft: '1.5rem',
  },
  noteItem: {
    marginBottom: '0.5rem',
    listStyle: 'disc',
  },
};

const vexStyles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#181825',
    color: '#f4f4f5',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    margin: 0,
    padding: 0,
    overflowY: 'auto', // Enable vertical scrolling
    scrollBehavior: 'smooth', // Enable smooth scrolling
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    position: 'sticky', // Make the header stick to the top
    top: 0,
    backgroundColor: '#181825',
    zIndex: 10,
  },
  logo: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#64ffda',
  },
  nav: {
    display: 'flex',
  },
  navLinkButton: {
    color: '#ccd6f6',
    textDecoration: 'none',
    margin: '0 15px',
    fontSize: '1rem',
    transition: 'color 0.3s ease',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
  },
  navLinkButtonHover: {
    color: '#64ffda',
  },
  signInButton: {
    backgroundColor: 'transparent',
    color: '#64ffda',
    border: '1px solid #64ffda',
    borderRadius: '5px',
    padding: '10px 20px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  signInButtonHover: {
    backgroundColor: '#64ffda1a',
  },
  hero: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '80px 40px',
    minHeight: 'calc(100vh - 60px)', // Adjust for header height
  },
  heroContent: {
    maxWidth: '600px',
    textAlign: 'left',
    marginRight: '40px',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    lineHeight: '1.2',
    marginBottom: '20px',
    color: '#ccd6f6',
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#a8b2d1',
    marginBottom: '30px',
  },
  manageProjectButton: {
    backgroundColor: '#64ffda',
    color: '#0a192f',
    border: 'none',
    borderRadius: '5px',
    padding: '15px 30px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  manageProjectButtonHover: {
    backgroundColor: '#54e6da',
  },
  heroImagePlaceholder: {
    width: '100%', // Make it responsive to screen size
    maxWidth: '500px', // Limit the max size
    height: 'auto', // Allow it to scale responsively with the width
    aspectRatio: '1', // Keeps the aspect ratio of the container square
    backgroundColor: '#233554', // Dark background for contrast
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)', // Subtle shadow for depth
    marginTop: '20px', // Add some space above
    marginBottom: '20px', // Add space below
    overflow: 'hidden', // Prevents any overflow from breaking layout
  },
  section: {
    padding: '80px 40px',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#ccd6f6',
    marginBottom: '40px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginTop: '20px',
  },
  featureCard: {
    backgroundColor: '#233554',
    padding: '30px',
    borderRadius: '10px',
    textAlign: 'left',
  },
  featureCardH3: {
    fontSize: '1.5rem',
    color: '#64ffda',
    marginBottom: '15px',
  },
  featureCardP: {
    color: '#a8b2d1',
    lineHeight: '1.6',
  },
  benefitsList: {
    textAlign: 'left',
    margin: '20px auto',
    maxWidth: '600px',
    listStyleType: 'none',
    paddingLeft: 0,
  },
  benefitsListLi: {
    fontSize: '1.1rem',
    color: '#a8b2d1',
    lineHeight: '1.8',
    marginBottom: '10px',
    position: 'relative',
    paddingLeft: '25px',
  },
  benefitsListLiBefore: {
    content: "'\\2022'",
    color: '#64ffda',
    position: 'absolute',
    left: 0,
    top: '5px',
    fontSize: '1.5rem',
  },
  contactText: {
    color: '#a8b2d1',
    marginBottom: '30px',
    fontSize: '1.1rem',
  },
  contactForm: {
    maxWidth: '500px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  input: {
    backgroundColor: '#233554',
    border: 'none',
    borderRadius: '5px',
    padding: '15px',
    color: '#ccd6f6',
    fontSize: '1rem',
    '&::placeholder': {
      color: '#a8b2d1',
    },
  },
  textarea: {
    backgroundColor: '#233554',
    border: 'none',
    borderRadius: '5px',
    padding: '15px',
    color: '#ccd6f6',
    fontSize: '1rem',
    '&::placeholder': {
      color: '#a8b2d1',
    },
  },
  submitButton: {
    backgroundColor: '#64ffda',
    color: '#0a192f',
    border: 'none',
    borderRadius: '5px',
    padding: '15px 30px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  submitButtonHover: {
    backgroundColor: '#54e6da',
  },
  footer: {
    textAlign: 'center',
    padding: '30px 0',
    color: '#a8b2d1',
    fontSize: '0.9rem',
    backgroundColor: '#233554',
},
};