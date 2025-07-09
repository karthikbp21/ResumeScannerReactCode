import React from 'react';

const LoadingSpinner = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div style={{
      display: 'flex',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      zIndex: 1050,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="spinner-border text-primary" role="status" style={{ width: '4rem', height: '4rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
