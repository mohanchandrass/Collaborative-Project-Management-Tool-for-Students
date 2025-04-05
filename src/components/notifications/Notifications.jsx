import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { TaskContext } from '../../context/TaskContext';
import { FiBell, FiCheck } from 'react-icons/fi';
import '../../App.css';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const { tasks = [] } = useContext(TaskContext); // Default empty array for tasks
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Return early if user is not available
    if (!user?.id) {
      setNotifications([]);
      return;
    }

    try {
      const overdueTasks = tasks.filter(
        task => 
          task.assignedTo === user.id && 
          task.dueDate && 
          new Date(task.dueDate) < new Date() && 
          task.status !== 'completed'
      );

      const newNotifications = overdueTasks.map(task => ({
        id: `task-overdue-${task.id}`,
        message: `Task "${task.title}" is overdue!`,
        type: 'warning',
        read: false,
      }));

      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error processing notifications:', error);
      setNotifications([]);
    }
  }, [tasks, user?.id]);  // Optional chaining here

  // ... rest of your component code remains the same ...
};

export default Notifications;