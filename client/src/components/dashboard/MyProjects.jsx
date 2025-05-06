import React, { useEffect, useState } from 'react';
import { firestore } from '../../firebase';
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../../styles/MyProjects.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MyProjects = ({ groupId }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [chartData, setChartData] = useState({});
  const [completedInput, setCompletedInput] = useState('');
  const [sortType, setSortType] = useState('storyPoints');

  const sortProjects = (projectsList) => {
    return [...projectsList].sort((a, b) => {
      if (sortType === 'storyPoints') {
        return (b.storyPoints ?? 0) - (a.storyPoints ?? 0);
      } else {
        return (a.estimatedTime ?? Infinity) - (b.estimatedTime ?? Infinity);
      }
    });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, 'groups', groupId, 'projects'), // Fetch projects from a specific group
      async (snapshot) => {
        const now = new Date();

        const dataWithPoints = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const startTime = data.startTime?.toDate?.();
            const elapsed = data.elapsedTime ?? 0;
            const isRunning = data.isRunning ?? false;

            const elapsedSeconds =
              isRunning && startTime ? elapsed + Math.floor((now - startTime) / 1000) : elapsed;

            const subRef = collection(firestore, `groups/${groupId}/projects/${docSnap.id}/completedPoints`);
            const subSnap = await getDocs(subRef);
            let totalCompleted = 0;
            subSnap.forEach((sub) => {
              const d = sub.data();
              totalCompleted += d.points || 0;
            });

            return {
              id: docSnap.id,
              ...data,
              elapsedSeconds,
              totalCompleted,
            };
          })
        );

        const sorted = sortProjects(dataWithPoints);
        setProjects(sorted);
      }
    );

    return () => unsubscribe();
  }, [groupId, sortType]);

  const handleDelete = async (projectId) => {
    if (window.confirm('Delete this project?')) {
      await deleteDoc(doc(firestore, 'groups', groupId, 'projects', projectId)); // Delete from specific group
    }
  };

  const handleStartPause = async (project) => {
    const ref = doc(firestore, 'groups', groupId, 'projects', project.id); // Update in specific group
    const now = new Date();

    if (project.isRunning) {
      const start = project.startTime?.toDate();
      const elapsed = Math.floor((now - start) / 1000);
      await updateDoc(ref, {
        isRunning: false,
        elapsedTime: (project.elapsedTime ?? 0) + elapsed,
        startTime: null,
      });
    } else {
      await updateDoc(ref, {
        isRunning: true,
        startTime: new Date(),
      });
    }
  };

  const handleLogStoryPoints = async () => {
    const points = parseInt(completedInput);
    if (!selectedProject || isNaN(points)) return;

    const subRef = collection(firestore, `groups/${groupId}/projects/${selectedProject.id}/completedPoints`);
    await addDoc(subRef, {
      points,
      timestamp: new Date(),
    });

    setCompletedInput('');
  };

  const updateProjectStatus = async (projectId, newStatus) => {
    try {
      await updateDoc(doc(firestore, 'groups', groupId, 'projects', projectId), {
        status: newStatus,
      });
      alert('Status updated!');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const fetchBurndownData = async (projectId, totalPoints) => {
    const subRef = collection(firestore, `groups/${groupId}/projects/${projectId}/completedPoints`);
    const q = query(subRef, orderBy('timestamp'));

    onSnapshot(q, (snapshot) => {
      const labels = [];
      const remaining = [];
      let completed = 0;

      snapshot.forEach((docSnap) => {
        const { points, timestamp } = docSnap.data();
        completed += points;
        const label = new Date(timestamp.toDate()).toLocaleString();
        labels.push(label);
        remaining.push(Math.max(totalPoints - completed, 0));
      });

      setChartData({
        labels,
        datasets: [
          {
            label: 'Remaining Story Points',
            data: remaining,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.3,
          },
        ],
      });
    });
  };

  const openModal = (project) => {
    setSelectedProject(project);
    fetchBurndownData(project.id, project.storyPoints || 0);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRunningTimer = (project) => {
    if (!project.isRunning) return formatTime(project.elapsedSeconds);
    const runningTime = Math.floor((new Date() - project.startTime.toDate()) / 1000);
    return formatTime(runningTime + project.elapsedSeconds);
  };

  const handleAddProject = async () => {
    const projectData = {
      name: 'New Project',
      description: 'Project Description',
      estimatedTime: 10,
      storyPoints: 5,
      status: 'Not Started',
      createdAt: new Date(),
      elapsedTime: 0,
      isRunning: false,
      startTime: null,
    };

    try {
      await addDoc(collection(firestore, 'groups', groupId, 'projects'), projectData); // Add to the specific group
      console.log('Project created successfully!');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="my-projects-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Projects</h2>
        <button
          onClick={() =>
            setSortType((prev) => (prev === 'storyPoints' ? 'time' : 'storyPoints'))
          }
          className="sort-toggle-button"
        >
          Sort by: {sortType === 'storyPoints' ? 'Highest Story Points' : 'Least Time'}
        </button>
        <button onClick={handleAddProject}>Add Project</button>
      </div>

      {projects.map((project) => (
        <div key={project.id} className="project-card">
          <h3>{project.name}</h3>
          <p><strong>Story Points:</strong> {project.storyPoints ?? 0}</p>
          <div className="running-time">{getRunningTimer(project)}</div>

          <button onClick={() => handleStartPause(project)}>
            {project.isRunning ? 'Pause Timer' : 'Start Timer'}
          </button>

          <button onClick={() => openModal(project)}>View Details</button>
          <button onClick={() => handleDelete(project.id)} className="delete-button">
            Delete
          </button>
        </div>
      ))}

      {selectedProject && (
        <div className="project-modal-overlay">
          <div className="project-modal">
            <button className="close-button" onClick={() => setSelectedProject(null)}>
              Close
            </button>
            <h3>{selectedProject.name}</h3>
            <p><strong>Story Points:</strong> {selectedProject.storyPoints}</p>
            <p><strong>Estimated Time:</strong> {selectedProject.estimatedTime} hours</p>

            <div>
              <label><strong>Status:</strong></label>
              <select
                value={selectedProject.status}
                onChange={(e) =>
                  setSelectedProject({ ...selectedProject, status: e.target.value })
                }
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>
              <button
                onClick={() =>
                  updateProjectStatus(selectedProject.id, selectedProject.status)
                }
              >
                Save Status
              </button>
            </div>

            <p><strong>Description:</strong> {selectedProject.description}</p>
            <p>
              <strong>Elapsed Time:</strong>{' '}
              {Math.floor(selectedProject.elapsedSeconds / 3600)}h{' '}
              {Math.floor((selectedProject.elapsedSeconds % 3600) / 60)}m
            </p>

            <input
              type="number"
              placeholder="Completed story points"
              value={completedInput}
              onChange={(e) => setCompletedInput(e.target.value)}
            />
            <button onClick={handleLogStoryPoints}>Log Points</button>

            {chartData.labels?.length > 0 ? (
              <Line data={chartData} options={{ responsive: true }} />
            ) : (
              <p>No progress data yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjects;
