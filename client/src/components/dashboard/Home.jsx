import React, { useContext, useState, useEffect, useRef } from 'react';
<<<<<<< HEAD
=======
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
import logo from './logo.png';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);
>>>>>>> bb2b9e030f8743d4fadb329bd818f472e1c185ad
import { useNavigate } from 'react-router-dom';
import backgroundVideo from '../../assets/background3.mp4';

const ProjectDashboard = () => {
    const navigate = useNavigate();

    const [circleRadius, setCircleRadius] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [isSticky, setIsSticky] = useState(false);

    const homeRef = useRef(null);
    const featuresRef = useRef(null);
    const dashboardRef = useRef(null);
    const benefitsRef = useRef(null);
    const headerRef = useRef(null);

    const handleSignInClick = () => {
        navigate('/login');
    };

    const handleGetStartedClick = () => {
        navigate('/register');
    };

    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const animateShape = () => {
            let animationFrameId;
            let startTime;
            const duration = 5000;

            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min(1, (timestamp - startTime) / duration);

                if (progress < 0.3) {
                    setCircleRadius(Math.round((progress / 0.3) * 80));
                    setRotation(0);
                } else if (progress >= 0.3 && progress < 0.7) {
                    setCircleRadius(80);
                    setRotation(Math.round(((progress - 0.3) / 0.4) * 360));
                } else {
                    setCircleRadius(Math.round(((1 - progress) / 0.3) * 80));
                    setRotation(360);
                }

                animationFrameId = requestAnimationFrame(step);

                if (progress === 1) {
                    requestAnimationFrame(animateShape);
                    cancelAnimationFrame(animationFrameId);
                }
            };

            animationFrameId = requestAnimationFrame(step);
            return () => cancelAnimationFrame(animationFrameId);
        };

        animateShape();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!true) {
        return (
            <div style={styles.container}>
                <h2>Dashboard Content Here</h2>
            </div>
        );
    }

    return (
<<<<<<< HEAD
        <div style={vexStyles.container}>
            <header ref={headerRef} style={{ ...vexStyles.header, ...(isSticky ? vexStyles.headerSticky : {}) }}>
                <h1 style={{ ...vexStyles.logoAnimated, fontSize: '3rem' }}>ProjectHub</h1> {/* Increased logo size */}
                <nav style={vexStyles.nav}>
                    <button onClick={() => scrollToSection(homeRef)} style={vexStyles.navLinkButton}>Home</button>
                    <button onClick={() => scrollToSection(featuresRef)} style={vexStyles.navLinkButton}>Features</button>
                    <button onClick={() => scrollToSection(dashboardRef)} style={vexStyles.navLinkButton}>User Dashboard</button>
                    <button onClick={() => scrollToSection(benefitsRef)} style={vexStyles.navLinkButton}>Benefits</button>
                </nav>
                <button onClick={handleSignInClick} style={vexStyles.signInButtonImprovised}>Sign In</button> {/* Using the improvised style */}
            </header>
            <main style={vexStyles.hero} ref={homeRef}>
                <div style={vexStyles.heroContent}>
                    <h2 style={vexStyles.heroTitle}>Empower Your Student Projects with ProjectHub</h2>
                    <p style={vexStyles.heroSubtitle}>The ultimate collaborative project management tool designed specifically for students. Seamlessly manage projects, communicate effectively, and access a suite of quick tools within your user dashboard to boost your productivity.</p>
                    <button onClick={handleGetStartedClick} style={vexStyles.manageProjectButton}>Get Started Now</button>
                </div>
                <div style={vexStyles.heroImagePlaceholder}>
  <img src="/logo.png" alt="Logo" style={{ width: '80%', height: 'auto', objectFit: 'contain' }} />
=======
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
    <img src={logo} alt="Logo" style={{ width: '80%', height: 'auto', objectFit: 'contain' }} />
>>>>>>> bb2b9e030f8743d4fadb329bd818f472e1c185ad
</div>
            </main>

            <section style={vexStyles.section} ref={featuresRef}>
                <h2 style={vexStyles.sectionTitle}>Key Features for Collaborative Success</h2>
                <div style={vexStyles.featuresGrid}>
                    <div style={vexStyles.featureCard} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <h3 style={vexStyles.featureCardH3}>Project Creation & Management</h3>
                        <p style={vexStyles.featureCardP}>Initiate new projects, define clear objectives, and maintain comprehensive control throughout the lifecycle.</p>
                    </div>
                    <div style={vexStyles.featureCard} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <h3 style={vexStyles.featureCardH3}>Task Creation & Assignment</h3>
                        <p style={vexStyles.featureCardP}>Divide projects into actionable tasks, assign team members, and monitor progress with ease.</p>
                    </div>
                    <div style={vexStyles.featureCard} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <h3 style={vexStyles.featureCardH3}>Backlog Generator</h3>
                        <p style={vexStyles.featureCardP}>Efficiently create and organize your project backlog, enabling effective prioritization and planning.</p>
                    </div>
                    <div style={vexStyles.featureCard} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <h3 style={vexStyles.featureCardH3}>Group & Personal Chats</h3>
                        <p style={vexStyles.featureCardP}>Foster real-time communication within project teams and facilitate direct conversations between members.</p>
                    </div>
                </div>
            </section>

            <section style={vexStyles.section} ref={dashboardRef}>
                <h2 style={vexStyles.sectionTitle}>Your Personal User Dashboard</h2>
                <p style={vexStyles.sectionSubtitle}>Access a suite of quick tools designed to enhance your productivity directly from your dashboard.</p>
                <div style={vexStyles.toolsGrid}>
                    <div style={vexStyles.toolCard} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <h3 style={vexStyles.toolCardH3}>Calculators</h3>
                        <p style={vexStyles.toolCardP}>Perform quick calculations without switching applications.</p>
                    </div>
                    <div style={vexStyles.toolCard} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <h3 style={vexStyles.toolCardH3}>Dictionary</h3>
                        <p style={vexStyles.toolCardP}>Instantly look up definitions to clarify terms and enhance understanding.</p>
                    </div>
                    <div style={vexStyles.toolCard} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <h3 style={vexStyles.toolCardH3}>Chart Generator</h3>
                        <p style={vexStyles.toolCardP}>Visualize project data and progress with dynamically generated charts.</p>
                    </div>
                    <div style={vexStyles.toolCard} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <h3 style={vexStyles.toolCardH3}>Report Generator</h3>
                        <p style={vexStyles.toolCardP}>Generate detailed reports on project status, task completion, and team contributions.</p>
                    </div>
                </div>
            </section>

            <section style={vexStyles.section} ref={benefitsRef}>
                <h2 style={vexStyles.sectionTitle}>Unlock the Benefits of ProjectHub for Students</h2>
                <ul style={vexStyles.benefitsList}>
                    <li style={vexStyles.benefitsListLi}><span style={vexStyles.benefitIcon}>&#10003;</span> Streamlined Collaboration on Group Assignments</li>
                    <li style={vexStyles.benefitsListLi}><span style={vexStyles.benefitIcon}>&#10003;</span> Enhanced Organization and Efficient Time Management</li>
                    <li style={vexStyles.benefitsListLi}><span style={vexStyles.benefitIcon}>&#10003;</span> Real-time Communication for Seamless Teamwork</li>
                    <li style={vexStyles.benefitsListLi}><span style={vexStyles.benefitIcon}>&#10003;</span> Easy Access to Integrated Productivity Tools</li>
                    <li style={vexStyles.benefitsListLi}><span style={vexStyles.benefitIcon}>&#10003;</span> Improved Tracking of Individual and Collective Progress</li>
                    <li style={vexStyles.benefitsListLi}><span style={vexStyles.benefitIcon}>&#10003;</span> Simplified Project Planning and Execution</li>
                </ul>
            </section>

            <footer style={vexStyles.footer}>
                <p>&copy; 2025 ProjectHub. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default ProjectDashboard;



const styles = {
    container: {
        // Your original dashboard styles
    }
};

const vexStyles = {
    container: {
        fontFamily: "'Open Sans', sans-serif",
        background: 'linear-gradient(to bottom, #30197d, #1a0a47)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        overflowY: 'auto',
        scrollBehavior: 'smooth',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '25px 50px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'transparent',
        zIndex: 10,
        width: '100%',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
    },
    headerSticky: {
        background: '#1a0a47',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    },
    logo: {
        fontSize: '2.5rem',
        fontWeight: '700',
        color: '#fff',
    },
    logoAnimated: {
        fontSize: '2.5rem',
        fontWeight: '700',
        background: 'linear-gradient(to right, #a770ef, #cf8bfd)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'flowGradient 2.5s linear infinite alternate',
    },
    nav: {
        display: 'flex',
    },
    navLinkButton: {
        color: '#fff',
        textDecoration: 'none',
        margin: '0 20px',
        fontSize: '1.15rem',
        transition: 'color 0.3s ease',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
    },
    navLinkButtonHover: {
        color: '#e0f7fa',
    },
    signInButton: {
        backgroundColor: 'transparent',
        color: '#fff',
        border: '2px solid #fff',
        borderRadius: '10px',
        padding: '12px 25px',
        fontSize: '1.15rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, color 0.3s ease',
    },
    signInButtonHover: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    signInButtonImprovised: { // New style for the sign-in button
        backgroundColor: '#fff', // Full white background
        color: '#30197d', // Dark purple text to contrast
        border: 'none', // Remove border
        borderRadius: '15px', // More rounded corners
        padding: '15px 30px', // Larger padding for a bigger button
        fontSize: '1.3rem', // Increased font size
        fontWeight: '600', // Make the text bolder
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.2s ease',
    },
    signInButtonImprovisedHover: {
        backgroundColor: '#f0f0f0', // Slightly lighter on hover
        transform: 'scale(1.05)', // Subtle scale animation on hover
        color: '#1a0a47', // Even darker purple on hover
    },
    hero: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '150px 50px 100px',
        minHeight: 'calc(100vh - 90px)',
        marginTop: 0,
    },
    heroContent: {
        maxWidth: '700px',
        textAlign: 'left',
        marginRight: '50px',
    },
    heroTitle: {
        fontSize: '4rem',
        fontWeight: '800',
        lineHeight: '1.2',
        marginBottom: '30px',
        color: '#fff',
    },
    heroSubtitle: {
        fontSize: '1.3rem',
        lineHeight: '1.8',
        color: '#f0f8ff',
        marginBottom: '50px',
    },
    manageProjectButton: {
        backgroundColor: '#673ab7',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        padding: '18px 35px',
        fontSize: '1.25rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
    },
    manageProjectButtonHover: {
        backgroundColor: '#512da8',
        transform: 'scale(1.05)',
    },
    heroImagePlaceholder: {
        width: '100%',
        maxWidth: '500px', // Limit the max size
        height: 'auto',
        aspectRatio: '1',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',

    },

    section: {
        padding: '100px 50px',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: '3rem',
        fontWeight: '700',
        color: '#fff',marginBottom: '60px',
    },
    sectionSubtitle: {
        fontSize: '1.2rem',
        color: '#e0f7fa',
        marginBottom: '40px',
    },
    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '50px',
        marginTop: '40px',
    },
    featureCard: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: '40px',
        borderRadius: '15px',
        textAlign: 'left',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.3s ease',
    },
    featureCardH3: {
        fontSize: '1.8rem',
        color: '#a770ef',
        marginBottom: '20px',
    },
    featureCardP: {
        color: '#f0f8ff',
        lineHeight: '1.8',
    },
    toolsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '40px',
        marginTop: '30px',
    },
    toolCard: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.3s ease',
    },
    toolCardH3: {
        fontSize: '1.6rem',
        color: '#fdd835',
        marginBottom: '15px',
    },
    toolCardP: {
        color: '#f0f8ff',
        lineHeight: '1.7',
    },
    benefitsList: {
        textAlign: 'left',
        margin: '40px auto',
        maxWidth: '800px',
        listStyleType: 'none',
        paddingLeft: 0,
    },
    benefitsListLi: {
        fontSize: '1.3rem',
        color: '#f0f8ff',
        lineHeight: '2.0',
        marginBottom: '20px',
        position: 'relative',
        paddingLeft: '35px',
    },
    benefitIcon: {
        color: '#4caf50',
        position: 'absolute',
        left: 0,
        top: '2px',
        fontSize: '1.6rem',
    },
    footer: {
        textAlign: 'center',
        padding: '50px 0',
        color: '#e0f7fa',
        fontSize: '0.95rem',
        background: 'linear-gradient(to bottom, #30197d, #1a0a47)',
    },
    '@keyframes flowGradient': {
        '0%': { backgroundPosition: '0% 50%' },
        '100%': { backgroundPosition: '100% 50%' },
    },
<<<<<<< HEAD
};
=======
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
>>>>>>> bb2b9e030f8743d4fadb329bd818f472e1c185ad
