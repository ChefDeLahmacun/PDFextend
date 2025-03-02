'use client';

import React from 'react';
import Image from 'next/image';

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
          width: '80px',
          height: '80px',
          backgroundColor: 'white',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          border: '1px solid #ddd',
          padding: '3px'
        }}>
          <Image 
            src="/images/Logo.png"
            alt="PDFextend Logo"
            width={70}
            height={70}
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              transform: 'scale(1.1)'
            }}
            priority
          />
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