import React from 'react';

const DashboardCard = ({ title, value, caption, icon, color = 'blue' }) => {
  return (
    <div className="metric-card">
      <div className="metric-card-top">
        <span className="metric-card-title">{title}</span>
        <div className={`metric-icon-box ${color}`}>
          {icon}
        </div>
      </div>
      <div className="metric-card-value">{value}</div>
      {caption && <div className="metric-card-caption">{caption}</div>}
    </div>
  );
};

export default DashboardCard;
