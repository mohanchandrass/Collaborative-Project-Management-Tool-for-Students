import React, { useState, useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { AuthContext } from '../../context/AuthContext';
import { FiEdit2, FiTrash2, FiCheck, FiClock } from 'react-icons/fi';
import '../../App.css';

const TaskItem = ({ task }) => {
  const { updateTask } = useContext(TaskContext);
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTask(task.id, { status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleSave = async () => {
    try {
      await updateTask(task.id, {
        title: editedTitle,
        description: editedDescription,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const isAssignedToMe = task.assignedTo === user.id;
  const isCreator = task.createdBy === user.id;

  return (
    <div className={`task-item ${task.status}`}>
      {isEditing ? (
        <div className="task-edit-form">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="task-edit-input"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="task-edit-textarea"
          />
          <div className="task-edit-actions">
            <button onClick={() => setIsEditing(false)} className="secondary-button">
              Cancel
            </button>
            <button onClick={handleSave} className="primary-button">
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-header">
            <h4>{task.title}</h4>
            <div className="task-meta">
              <span className={`priority-badge ${task.priority}`}>
                {task.priority}
              </span>
              {task.dueDate && (
                <span className="due-date">
                  <FiClock /> {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <p className="task-description">{task.description}</p>
          <div className="task-footer">
            <div className="task-status">
              {(isAssignedToMe || isCreator) && (
                <div className="status-actions">
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusChange('completed')}
                      className="status-button complete"
                    >
                      <FiCheck /> Complete
                    </button>
                  )}
                  {task.status !== 'in-progress' && (
                    <button
                      onClick={() => handleStatusChange('in-progress')}
                      className="status-button progress"
                    >
                      In Progress
                    </button>
                  )}
                  {task.status !== 'todo' && (
                    <button
                      onClick={() => handleStatusChange('todo')}
                      className="status-button todo"
                    >
                      To Do
                    </button>
                  )}
                </div>
              )}
              <span className={`status-label ${task.status}`}>
                {task.status}
              </span>
            </div>
            {(isAssignedToMe || isCreator) && (
              <div className="task-actions">
                <button
                  onClick={() => setIsEditing(true)}
                  className="icon-button"
                >
                  <FiEdit2 />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;