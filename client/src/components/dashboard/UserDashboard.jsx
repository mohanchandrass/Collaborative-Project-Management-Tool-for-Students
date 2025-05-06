import React, { useContext, useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { FaCalculator, FaChartLine, FaBook, FaFileAlt, FaGraduationCap, FaQuestionCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { ProjectContext } from '../../context/ProjectContext';
import '../../styles/UserDashboard.css';
import logo from './logo.png';  // Adjust the path if the image is in the same folder


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

    if (loading) return <div className="loading-dashboard">Loading dashboard...</div>;
    if (error) return <div className="error-dashboard">Error: {error}</div>;
    if (!currentUser) return <div className="loading-dashboard">Loading dashboard...</div>;

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
        hover: { scale: 1.05, boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)' },
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

    return (
        <div className="dashboard-section user-dashboard">
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

            {/* Projects Section */}
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

            {/* Quick Tools Section */}
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
                    <a href="https://www.coursera.org/" target="_blank" rel="noopener noreferrer" className="tool-button user-tool-button">
                        <div className="tool-icon">
                            <FaGraduationCap size={24} />
                        </div>
                        <span>Learning</span>
                    </a>
                    <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" className="tool-button user-tool-button">
                        <div className="tool-icon">
                            <FaQuestionCircle size={24} />
                        </div>
                        <span>Help</span>
                    </a>
                </div>
            </motion.div>

            {/* Explore Resources Section */}
            <motion.div
                variants={resourceVariants}
                initial="hidden"
                animate="visible"
                className="additional-resources"
            >
                <h3 className="resources-title">Explore Resources</h3>
                <div className="resources-container">
                    <ul className="resources-list">
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
                </div>
            </motion.div>
        </div>
    );
};

export default UserDashboard;
