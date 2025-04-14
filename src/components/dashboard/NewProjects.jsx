import React, { useState } from 'react';
import { firestore } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../../styles/NewProjects.css';

const NewProjects = ({ groupId }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectStatus, setProjectStatus] = useState('In Progress');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [storyPoints, setStoryPoints] = useState('');
  const [subject, setSubject] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectName || !projectDescription || !estimatedTime || !storyPoints || !subject) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      // Add the project to the specific group
      const projectRef = await addDoc(collection(firestore, 'groups', groupId, 'projects'), {
        name: projectName,
        description: projectDescription,
        status: projectStatus,
        estimatedTime: parseInt(estimatedTime),
        storyPoints: parseInt(storyPoints),
        subject: subject,
        createdAt: new Date(),
        elapsedTime: 0,
        startTime: null,
        isRunning: false,
      });

      console.log('Project created with ID:', projectRef.id);

      // Reset form fields
      setProjectName('');
      setProjectDescription('');
      setEstimatedTime('');
      setStoryPoints('');
      setProjectStatus('In Progress');
      setSubject('');
      setIsLoading(false);

      // Redirect to the project's group page after creation
      navigate(`/groups/${groupId}/projects`);
    } catch (error) {
      console.error('Error adding document:', error);
      setErrorMessage('Error creating project. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="new-project-container">
      <h2>Create New Project</h2>
      <form className="new-project-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="projectName">Project Name</label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="projectDescription">Description</label>
          <textarea
            id="projectDescription"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Enter project description"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="storyPoints">Story Points</label>
          <input
            type="number"
            id="storyPoints"
            value={storyPoints}
            onChange={(e) => setStoryPoints(e.target.value)}
            placeholder="Enter total story points"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="estimatedTime">Estimated Time (in hours)</label>
          <input
            type="number"
            id="estimatedTime"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            placeholder="Enter estimated time"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="projectStatus">Project Status</label>
          <select
            id="projectStatus"
            value={projectStatus}
            onChange={(e) => setProjectStatus(e.target.value)}
          >
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Not Started">Not Started</option>
          </select>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
};

export default NewProjects;
