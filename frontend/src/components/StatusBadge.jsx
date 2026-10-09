import React from 'react';
import { HeartPulse, Sprout, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const normalized = (status || 'Planted').toLowerCase().replace(/\s+/g, '');

  const getIcon = () => {
    switch (status) {
      case 'Healthy':
        return <CheckCircle2 size={13} />;
      case 'Growing':
        return <Sprout size={13} />;
      case 'Planted':
        return <Sprout size={13} />;
      case 'Needs Attention':
        return <AlertTriangle size={13} />;
      case 'Deceased':
        return <XCircle size={13} />;
      default:
        return <HeartPulse size={13} />;
    }
  };

  return (
    <span className={`badge badge-${normalized}`}>
      {getIcon()}
      {status || 'Planted'}
    </span>
  );
};

export default StatusBadge;
