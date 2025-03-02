'use client';

import React from 'react';

const Header: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      minHeight: '100px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottom: '1px solid #ddd',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* Header content */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          backgroundColor: 'white',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          border: '1px solid #ddd',
          padding: '8px'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url('../images/SpaceMyPDF_Logo.jpeg')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}></div>
        </div>
        <div style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#333'
        }}>
          SpaceMyPDF
        </div>
      </div>
    </div>
  );
};

export default Header; 