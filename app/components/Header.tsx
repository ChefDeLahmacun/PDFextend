'use client';

import React from 'react';
import Image from 'next/image';
import { FaFileAlt } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '100px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottom: '1px solid #ddd',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '10px 0',
      boxSizing: 'border-box'
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
          padding: '3px',
          boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
        }}>
          <Image 
            src="/images/Logo.png"
            alt="Document Extender Logo"
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
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#2c3e50',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>SpaceMyPDF</span>
          </div>
          <div style={{
            fontSize: '14px',
            color: '#555',
            fontStyle: 'italic',
            marginTop: '2px'
          }}>
            Add note space to your PDFs easily
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 