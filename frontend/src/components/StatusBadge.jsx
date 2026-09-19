import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toLowerCase();

  let badgeClass = 'badge';

  if (normalized === 'pending') {
    badgeClass += ' badge-pending';
  } else if (normalized === 'approved') {
    badgeClass += ' badge-approved';
  } else if (normalized === 'rejected') {
    badgeClass += ' badge-rejected';
  } else if (normalized === 'active') {
    badgeClass += ' badge-active';
  } else if (normalized === 'inactive') {
    badgeClass += ' badge-inactive';
  } else {
    badgeClass += ' badge-category';
  }

  return (
    <span className={badgeClass}>
      <span className="badge-dot"></span>
      {status}
    </span>
  );
};

export default StatusBadge;
