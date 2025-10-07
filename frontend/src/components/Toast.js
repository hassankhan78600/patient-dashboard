/**
 * A reusable toast notification component for displaying temporary messages.
 * The component automatically dismisses itself after a specified duration and can also be closed manually. 
 * Its appearance and icon are determined by the `type` prop.
 */
import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '✓';
    }
  };

  return (
    <div className={`toast toast-${type}`} role="alert" aria-live="polite">
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
      <button
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;