import React, { useEffect } from 'react';
import { useAppStore } from '../store';
import { onNotification } from '../services/socket';
import './NotificationBell.css';

export const NotificationBell = () => {
  const {
    user,
    notifications,
    addNotification,
    markNotificationAsRead,
    showNotificationCenter,
    setShowNotificationCenter
  } = useAppStore();

  useEffect(() => {
    const handleNotification = ({ userId, notification }) => {
      if (userId === user.id) {
        addNotification(notification);
        // Show toast notification
        showToast(notification.title, notification.message);
      }
    };

    onNotification(handleNotification);
  }, [user.id, addNotification]);

  const showToast = (title, message) => {
    // Browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message, icon: '🔔' });
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-bell">
      <button
        className="bell-btn"
        onClick={() => setShowNotificationCenter(!showNotificationCenter)}
      >
        🔔
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {showNotificationCenter && (
        <div className="notification-center">
          <div className="center-header">
            <h3>Notifications</h3>
            <button
              className="close-btn"
              onClick={() => setShowNotificationCenter(false)}
            >
              ✕
            </button>
          </div>
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">No notifications yet</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="notification-header">
                    <h4>{notification.title}</h4>
                    <span className="notification-time">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p>{notification.message}</p>
                  {notification.animeId && (
                    <span className="anime-badge">
                      Anime {notification.animeId}
                    </span>
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
