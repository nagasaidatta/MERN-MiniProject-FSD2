import React from 'react';

const NotificationBanner = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  let alertClass = 'alert alert-info';
  let icon = 'ℹ️';

  if (type === 'success') {
    alertClass = 'alert alert-success';
    icon = '✅';
  } else if (type === 'danger' || type === 'error') {
    alertClass = 'alert alert-danger';
    icon = '⚠️';
  }

  return (
    <div className={alertClass} role="alert">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <span>{icon}</span>
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.1rem',
            color: 'inherit',
            lineHeight: 1
          }}
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default NotificationBanner;
