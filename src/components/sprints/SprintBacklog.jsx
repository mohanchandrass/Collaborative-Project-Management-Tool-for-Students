import React, { useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { TaskContext } from '../../context/TaskContext';
import '../../App.css';

const SprintBacklog = () => {
  const { currentProject } = useContext(ProjectContext);
  const { tasks } = useContext(TaskContext);

  const sprintTasks = tasks.filter(task => task.sprintId === currentProject?.currentSprint?.id);

  return (
    <div className="sprint-section">
      <h3>Sprint Backlog</h3>
      {currentProject?.currentSprint ? (
        <>
          <div className="sprint-info">
            <h4>{currentProject.currentSprint.name}</h4>
            <p>
              {new Date(currentProject.currentSprint.startDate).toLocaleDateString()} -{' '}
              {new Date(currentProject.currentSprint.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="sprint-tasks">
            {sprintTasks.length === 0 ? (
              <div className="empty-state">No tasks in this sprint</div>
            ) : (
              sprintTasks.map(task => (
                <div key={task.id} className="sprint-task-item">
                  <span>{task.title}</span>
                  <span className={`status-badge ${task.status}`}>
                    {task.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="empty-state">No active sprint</div>
      )}
    </div>
  );
};

export default SprintBacklog;