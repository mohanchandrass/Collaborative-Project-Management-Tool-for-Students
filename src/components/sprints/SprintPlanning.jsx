import React, { useState, useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { TaskContext } from '../../context/TaskContext';
import '../../App.css';

const SprintPlanning = () => {
  const { currentProject, updateProject } = useContext(ProjectContext);
  const { tasks } = useContext(TaskContext);
  const [sprintName, setSprintName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTasks, setSelectedTasks] = useState([]);

  const handleCreateSprint = async () => {
    if (!sprintName || !startDate || !endDate) {
      alert('Please fill all fields');
      return;
    }

    try {
      await updateProject(currentProject.id, {
        currentSprint: {
          id: Date.now().toString(),
          name: sprintName,
          startDate,
          endDate,
        },
      });

      // In a real app, you would update tasks with the new sprintId
      setSprintName('');
      setStartDate('');
      setEndDate('');
      setSelectedTasks([]);
    } catch (error) {
      console.error('Error creating sprint:', error);
    }
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <div className="sprint-section">
      <h3>Sprint Planning</h3>
      {currentProject?.currentSprint ? (
        <div className="active-sprint">
          <h4>Current Sprint: {currentProject.currentSprint.name}</h4>
          <p>
            {new Date(currentProject.currentSprint.startDate).toLocaleDateString()} -{' '}
            {new Date(currentProject.currentSprint.endDate).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <>
          <div className="sprint-form">
            <div className="form-group">
              <label>Sprint Name</label>
              <input
                type="text"
                value={sprintName}
                onChange={(e) => setSprintName(e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="available-tasks">
            <h4>Available Tasks</h4>
            {tasks.filter(task => !task.sprintId).length === 0 ? (
              <div className="empty-state">No tasks available</div>
            ) : (
              tasks
                .filter(task => !task.sprintId)
                .map(task => (
                  <div key={task.id} className="task-select-item">
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => toggleTaskSelection(task.id)}
                    />
                    <span>{task.title}</span>
                  </div>
                ))
            )}
          </div>
          <button
            onClick={handleCreateSprint}
            className="primary-button"
            disabled={!sprintName || !startDate || !endDate}
          >
            Create Sprint
          </button>
        </>
      )}
    </div>
  );
};

export default SprintPlanning;