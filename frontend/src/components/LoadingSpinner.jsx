import React from 'react';

const LoadingSpinner = ({ text = 'Loading portal data, please wait...' }) => {
  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <div className="spinner"></div>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;
