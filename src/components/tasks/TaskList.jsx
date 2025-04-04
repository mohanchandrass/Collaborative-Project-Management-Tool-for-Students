import React, { useState, useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { ProjectContext } from '../../context/ProjectContext';
import { AuthContext } from '../../context/AuthContext';
import CreateTask from './CreateTask';
import TaskItem from './TaskItem';
import '../../App.css';

const TaskList = () => {
  const { tasks, loading } = useContext(TaskContext);
  const { currentProject } = useContext(ProjectContext);
  const { user } = useContext(AuthContext);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'assigned') return task.assignedTo === user.id;
    if (filter === 'created') return task.createdBy === user.id;
    return task.status === filter;
  });

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h3>Tasks</h3>
        <div className="task-actions">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Tasks</option>
            <option value="assigned">Assigned to Me</option>
            <option value="created">Created by Me</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="primary-button"
          >
            Create Task
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">No tasks found</div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))
          )}
        </div>
      )}

      {showCreateModal && (
        <CreateTask 
          onClose={() => setShowCreateModal(false)}
          projectId={currentProject?.id}
        />
      )}
    </div>
  );
};

export default TaskList;