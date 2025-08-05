// public/src/modules/utils.js

// Global app state
export const state = {
  user: null,
  userId: null,
  songs: [],
  favorites: [],
  currentSongIndex: 0,
  player: null,
  seekInterval: null
};

// Show toast-like alert (basic UI utility)
export const showNotification = (message, type = 'info') => {
  const colorMap = {
    success: 'green',
    error: 'red',
    info: '#007bff'
  };

  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.background = colorMap[type] || '#333';
  notification.style.color = '#fff';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '4px';
  notification.style.zIndex = 9999;
  notification.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
  notification.style.fontSize = '14px';

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
};

// Helper to format time (mm:ss)
export const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60).toString().padStart(2, '0');
  const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
};
