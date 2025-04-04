import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { TaskContext } from '../../context/TaskContext';
import { FiBell, FiCheck } from 'react-icons/fi';
import '../../App.css';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const { tasks } = useContext(TaskContext);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Simulate notifications for overdue tasks
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
  }, [tasks, user.id]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true,
    })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-container">
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        className="notification-button"
      >
        <FiBell />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {showNotifications && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h4>Notifications</h4>
            <button onClick={markAllAsRead} className="mark-all-read">
              Mark all as read
            </button>
          </div>
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">No notifications</div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type}`}
                >
                  <div className="notification-message">
                    {notification.message}
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="mark-read-button"
                    >
                      <FiCheck />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;