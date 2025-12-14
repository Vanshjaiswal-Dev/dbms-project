import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    received: {
      bg: 'bg-statusReceived',
      text: 'text-white',
      label: 'Received'
    },
    preparing: {
      bg: 'bg-statusPreparing',
      text: 'text-textPrimary',
      label: 'Preparing'
    },
    ready: {
      bg: 'bg-statusReady',
      text: 'text-white',
      label: 'Ready'
    },
    completed: {
      bg: 'bg-statusCompleted',
      text: 'text-white',
      label: 'Completed'
    },
    cancelled: {
      bg: 'bg-gray-400',
      text: 'text-white',
      label: 'Cancelled'
    }
  };

  const config = statusConfig[status] || statusConfig.received;

  return (
    <span className={`${config.bg} ${config.text} px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide shadow-soft`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
