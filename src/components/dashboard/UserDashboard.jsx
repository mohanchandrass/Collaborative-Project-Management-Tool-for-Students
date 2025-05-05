import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaCalculator,
    FaChartLine,
    FaBook,
    FaFileAlt,
    FaInstagram,
    FaFacebook,
    FaTwitter,
    FaUsers,
    FaBriefcase,
    FaCalendarCheck,
    FaTasks,
    FaGraduationCap, // New icon for Education/Learning
    FaQuestionCircle,   // New icon for Help/Support
    FaFile, //New Icon for File Converter
    FaHome
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { ProjectContext } from '../../context/ProjectContext';

const UserDashboard = () => {
    const { currentUser } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { projects } = useContext(ProjectContext);
    const [userProjects, setUserProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                setLoading(false);
            } catch (err) {
                setError(err.message || 'An unexpected error occurred.');
                setLoading(false);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (currentUser && projects) {
            const projectsWhereUserIsMember = projects.filter((project) =>
                project.members.includes(currentUser.id)
            );
            setUserProjects(projectsWhereUserIsMember);
        }
    }, [currentUser, projects]);

    if (loading) {
        return <div className="loading-dashboard">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="error-dashboard">Error: {error}</div>;
    }

    if (!currentUser) {
        return <div className="loading-dashboard">Loading dashboard...</div>;
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
        hover: { scale: 1.03, boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)' },
    };

    const toolVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeInOut', delay: 0.2 } },
        hover: { scale: 1.1, backgroundColor: '#4ade80' },
    };

    const resourceVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeInOut', delay: 0.4 } },
        hover: { scale: 1.05, color: '#6ee7b7' },
    };

    const calculateProjectProgress = (project) => {
        if (!project.tasks || project.tasks.length === 0) return 0;
        const completedTasks = project.tasks.filter((task) => task.status === 'completed').length;
        return (completedTasks / project.tasks.length) * 100;
    };

    const handleHomeNavigation = () => {
        const confirmation = window.confirm(
            "Are you sure you want to return to the home page?"
        );
        if (confirmation) {
            navigate("/");
        }
        // If the user cancels, do nothing (stay on the dashboard)
    };

    return (
        <div className="dashboard-section">
            <div className="top-right-link">
                <button onClick={handleHomeNavigation} className="home-link">
                    <FaHome size={24} />
                    <span>Home</span>
                </button>
            </div>
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="dashboard-welcome-heading"
            >
                Welcome to Your ProjectHub
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.2 }}
                className="dashboard-subtitle"
            >
                Your personalized space for project management and collaboration.
            </motion.p>

            {/* New Feature: Project Progress Visualization */}
            {userProjects.length > 0 && (
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="project-progress-container"
                >
                    <h3 className="project-progress-title">Your Projects</h3>
                    <div className="project-progress-grid">
                        {userProjects.map((project) => {
                            const progress = calculateProjectProgress(project);
                            return (
                                <div key={project.id} className="project-progress-card">
                                    <h4 className="project-title">{project.title}</h4>
                                    <div className="progress-bar-container">
                                        <motion.div
                                            className="progress-bar-fill"
                                            style={{ width: `${progress}%` }}
                                            initial={{ width: '0%' }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                                        />
                                        <span className="progress-percentage">{progress.toFixed(0)}%</span>
                                    </div>
                                    <Link to={`/project/${project.id}`} className="view-project-button">
                                        View Project
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* MOVED SECTION - BEGIN */}
            <motion.div
                variants={toolVariants}
                initial="hidden"
                animate="visible"
                className="quick-tools-container user-quick-tools-container"
            >
                <h3 className="quick-tools-title">Quick Tools</h3>
                <div className="tools-grid user-tools-grid">
                    <Link to="/calculator" className="tool-button user-tool-button">
                        <div className="tool-icon">
                            <FaCalculator size={24} />
                        </div>
                        <span>Calculator</span>
                    </Link>
                    <Link to="/chart-generator" className="tool-button user-tool-button">
                        <div className="tool-icon">
                            <FaChartLine size={24} />
                        </div>
                        <span>Generate Chart</span>
                    </Link>
                    <Link to="/dictionary" className="tool-button user-tool-button">
                        <div className="tool-icon">
                            <FaBook size={24} />
                        </div>
                        <span>Dictionary</span>
                    </Link>
                    <Link to="/report-generator" className="tool-button user-tool-button">
                        <div className="tool-icon">
                            <FaFileAlt size={24} />
                        </div>
                        <span>Report Generator</span>
                    </Link>
                    {/* New Feature: File Converter */}

                    {/* New Feature: Learning Resources */}
                    <a href="https://www.coursera.org/" target="_blank" rel="noopener noreferrer" className="tool-button user-tool-button">
                        <div className="tool-icon">
                            <FaGraduationCap size={24} />
                        </div>
                        <span>Learning</span>
                    </a>
                    {/* New Feature: Help and Support */}
                    <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" className="tool-button user-tool-button">
                        <div className="tool-icon">
                            <FaQuestionCircle size={24} />
                        </div>
                        <span>Help</span>
                    </a>
                </div>
            </motion.div>

            <motion.div
                variants={resourceVariants}
                initial="hidden"
                animate="visible"
                className="additional-resources"
            >
                <h3 className="resources-title">Explore Resources</h3>
                <ul className="resources-list">
                  {/* Added links for online code editor and GitHub */}
                  <motion.li
                        whileHover="hover"
                        variants={resourceVariants}
                        className="resource-item"
                    >
                        <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
                            GitHub
                        </a>
                    </motion.li>
                  <motion.li
                        whileHover="hover"
                        variants={resourceVariants}
                        className="resource-item"
                    >
                        <a href="https://stackblitz.com/" target="_blank" rel="noopener noreferrer">
                            Online Code Editor (StackBlitz)
                        </a>
                    </motion.li>
                    
                    <motion.li
                        whileHover="hover"
                        variants={resourceVariants}
                        className="resource-item"
                    >
                        <a href="https://www.atlassian.com/agile" target="_blank" rel="noopener noreferrer">
                            Learn about Agile
                        </a>
                    </motion.li>
                    <motion.li
                        whileHover="hover"
                        variants={resourceVariants}
                        className="resource-item"
                    >
                        <a href="https://www.atlassian.com/software/jira" target="_blank" rel="noopener noreferrer">
                            Jira Documentation
                        </a>
                    </motion.li>
                    <motion.li
                        whileHover="hover"
                        variants={resourceVariants}
                        className="resource-item"
                    >
                        <a href="https://www.projectmanagement.com/" target="_blank" rel="noopener noreferrer">
                            Project Management Institute
                        </a>
                    </motion.li>
                    
                </ul>
            </motion.div>
            {/* MOVED SECTION - END */}

            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="dashboard-summary-cards"
            ></motion.div>

            <footer className="dashboard-footer">
                <div className="footer-content">
                    <div className="social-links">
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FaInstagram size={24} />
                        </a>
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <FaFacebook size={24} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <FaTwitter size={24} />
                        </a>
                    </div>
                    <div className="contact-details">
                        <p>Email: support@example.com</p>
                        <p>Phone: +123 456 7890</p>
                    </div>
                    <p className="copyright">© {new Date().getFullYear()} Project Dashboard. All rights reserved.</p>
                </div>
            </footer>

            <style jsx global>{`
                body {
                    margin: 0;
                }

                .dashboard-section {
                    padding: 2rem;
                    color: #e5e7eb;
                    font-family: 'Inter', sans-serif;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    padding-bottom: 80px;
                    box-sizing: border-box;
                }
                .top-right-link {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    z-index: 10;
                }

                .home-link {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #fff;
                    text-decoration: none;
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    background-color: #3b82f6;
                    transition: background-color 0.3s ease;
                    border: none; // Remove default button border
                    cursor: pointer; // Show pointer cursor on hover
                }

                .home-link:hover {
                    background-color: #2563eb;
                }

                .dashboard-welcome-heading {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    color: #fff;
                    text-align: center;
                    background: linear-gradient(to right, #6ee7b7, #3b82f6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .dashboard-subtitle {
                    font-size: 1.1rem;
                    color: #d1d5db;
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .dashboard-summary-cards {
                    display: grid;
                    grid-templateColumns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 2rem;
                    margin-bottom: 2rem;
                }

                .summary-card {
                    background-color: #2c2c3b;
                    padding: 2rem;
                    border-radius: 1rem;
                    text-align: left;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                    border: 1px solid #4a5568;
                }

                .summary-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
                }

                .summary-icon {
                    margin-bottom: 1rem;
                    color: #6ee7b7;
                }

                .summary-content h4 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #fff;
                    margin-bottom: 0.75rem;
                }

                .summary-content p {
                    font-size: 1rem;
                    color: #d1d5db;
                }

                .tools-and-resources {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 2rem;
                }

                .quick-tools-container {
                    background-color: #2c2c3b;
                    padding: 2rem;
                    border-radius: 1rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    margin-bottom: 2rem;
                    flex: 1;
                    border: 1px solid #4a5568;
                }

                .user-quick-tools-container {
                    margin-top: 2rem;
                }

                .quick-tools-title {
                    font-size: 1.8rem;
                    font-weight: 600;
                    color: #fff;
                    text-align: left;
                    margin-bottom: 1.5rem;
                    background: linear-gradient(to right, #a7f3d0, #60a5fa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .tools-grid {
                    display: grid;
                    grid-templateColumns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 1.5rem;
                }

                .user-tools-grid {
                    grid-templateColumns: repeat(3, 1fr);
                }

                .tool-button {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background-color: #3b3b4f;
                    color: #ffffff;
                    padding: 1.5rem;
                    border-radius: 1rem;
                    text-decoration: none;
                    transition:
                        background-color 0.3s ease,
                        transform 0.3s ease,
                        box-shadow 0.3s ease;
                    border: 1px solid #6b7280;
                }

                .tool-button:hover {
                    background-color: #4a5568;
                    transform: translateY(-10px);
                    box-shadow: 0 6px 20px rgba(0, 0, 0.15);
                }

                .tool-button span {
                    margin-top: 1rem;
                    font-size: 1.1rem;
                    font-weight: 500;
                    color: #fff;
                }

                .tool-icon {
                    margin-bottom: 1rem;
                    color: #6ee7b7;
                    width: 36px;
                    height: 36px;
                }

                .loading-dashboard {
                    color: #fff;
                    font-size: 1.2rem;
                    text-align: center;
                    padding: 2rem;
                }

                .error-dashboard {
                    color: #red;
                    font-size: 1.2rem;
                    text-align: center;
                    padding: 2rem;
                }

                .additional-resources {
                    background-color: #2c2c3b;
                    padding: 2rem;
                    border-radius: 1rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    margin-bottom: 2rem;
                    flex: 1;
                    border: 1px solid #4a5568;
                }

                .resources-title {
                    font-size: 1.8rem;
                    font-weight: 600;
                    color: #fff;
                    text-align: left;
                    margin-bottom: 1.5rem;
                    background: linear-gradient(to right, #f9a8d4, #8b5cf6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .resources-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .resource-item {
                    margin-bottom: 1.25rem;
                    transition: transform 0.3s ease, color 0.3s ease;
                }

                .resource-item a {
                    color: #ffffff;
                    text-decoration: none;
                    font-size: 1.1rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .resource-item a:hover {
                    color: #6ee7b7;
                    transform: translateX(5px);
                }

                .dashboard-footer {
                    background-color: #1e293b;
                    color: #e5e7eb;
                    padding: 1.5rem;
                    text-align: center;
                    margin-top: auto;
                    width: 100%;
                    border-top: 1px solid #4a5568;
                }

                .footer-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .social-links {
                    display: flex;
                    gap: 1.5rem;
                    margin-bottom: 1rem;
                }

                .social-links a {
                    color: #e5e7eb;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .social-links a:hover {
                    color: #6ee7b7;
                }

                .contact-details {
                    font-size: 1rem;
                    margin-bottom: 1rem;
                }

                .copyright {
                    font-size: 0.9rem;
                    color: #9ca3af;
                }

                /* Project Progress Styles */
                .project-progress-container {
                    background-color: #2c2c3b;
                    padding: 2rem;
                    border-radius: 1rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    margin-bottom: 2rem;
                    border: 1px solid #4a5568;
                }

                .project-progress-title {
                    font-size: 1.8rem;
                    font-weight: 600;
                    color: #fff;
                    margin-bottom: 1.5rem;
                    background: linear-gradient(to right, #8b5cf6, #3b82f6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .project-progress-grid {
                    display: grid;
                    grid-templateColumns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                }

                .project-progress-card {
                    background-color: #3b3b4f;
                    padding: 1.5rem;
                    border-radius: 1rem;
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                    border: 1px solid #6b7280;
                }

                .project-progress-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
                }

                .project-title {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #fff;
                    margin-bottom: 1rem;
                }

                .progress-bar-container {
                    background-color: #4a5568;
                    height: 1rem;
                    border-radius: 0.5rem;
                    position: relative;
                    margin-bottom: 1rem;
                    overflow: hidden;
                }

                .progress-bar-fill {
                    height: 100%;
                    background: linear-gradient(to right, #6ee7b7, #3b82f6);
                    border-radius: 0.5rem;
                    position: relative;
                    transition: width 0.5s ease-in-out;
                    width: 0;
                }

                .progress-percentage {
                    position: absolute;
                    right: 0.5rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #fff;
                    font-size: 0.8rem;
                    font-weight: 500;
                    z-index: 1;
                }

                .view-project-button {
                    display: inline-block;
                    background-color: #6ee7b7;
                    color: #1f2937;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    text-decoration: none;
                    font-weight: 500;
                    transition: background-color 0.3s ease;
                    margin-top: 0.5rem;
                    font-size: 0.9rem;
                }

                .view-project-button:hover {
                    background-color: #3b82f6;
                    color: #fff;
                }
            `}</style>
        </div>
    );
};

export default UserDashboard;