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
      setNotifications([]);  // Reset notifications if no user is present
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

      // Only update notifications if the value has changed to avoid unnecessary renders
      setNotifications((prevNotifications) => {
        // Check if the notifications have changed before updating state
        if (JSON.stringify(prevNotifications) !== JSON.stringify(newNotifications)) {
          return newNotifications;
        }
        return prevNotifications;
      });
    } catch (error) {
      console.error('Error processing notifications:', error);
      setNotifications([]);
    }
  }, [tasks, user?.id]);  // Optional chaining here

  // ... rest of your component code remains the same ...
};

export default Notifications;
