import React from 'react';
import { CheckCircleIcon, AlertTriangleIcon, InfoIcon, CloseIcon } from './Icons';

const NotificationBanner = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  let alertClass = 'alert alert-info';
  let IconComponent = InfoIcon;

  if (type === 'success') {
    alertClass = 'alert alert-success';
    IconComponent = CheckCircleIcon;
  } else if (type === 'danger' || type === 'error') {
    alertClass = 'alert alert-danger';
    IconComponent = AlertTriangleIcon;
  }

  return (
    <div className={alertClass} role="alert">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <IconComponent size={18} />
        </span>
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            color: 'inherit'
          }}
          aria-label="Dismiss notification"
        >
          <CloseIcon size={16} />
        </button>
      )}
    </div>
  );
};

export default NotificationBanner;
