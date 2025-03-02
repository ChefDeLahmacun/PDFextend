'use client';

import React from 'react';
import { FaUserFriends, FaSlidersH, FaLock, FaGift } from 'react-icons/fa';

const Features: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '350px',
      padding: '15px 20px 15px 20px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 2,
      overflow: 'hidden'
    }}>
      {/* AI-created info banner */}
      <div style={{
        width: 'calc(100% - 20px)',
        margin: '0 auto',
        padding: '8px 15px',
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: '5px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#555',
        marginBottom: '15px',
        boxSizing: 'border-box',
        wordWrap: 'break-word',
        maxWidth: '100%'
      }}>
        <p style={{ margin: '0', maxWidth: '100%' }}>
          <strong>Enhanced with AI:</strong> This tool was developed to streamline your document workflow. We welcome your feedback via the form below.
        </p>
      </div>
      
      <h2 style={{
        textAlign: 'center',
        margin: '0 0 15px 0',
        color: '#333',
        fontSize: '26px',
        fontWeight: '600',
        letterSpacing: '0.5px'
      }}>
        Why Choose SpaceMyPDF?
      </h2>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '15px',
        height: '200px',
        overflow: 'auto'
      }}>
        <FeatureCard 
          icon={<FaUserFriends size={24} color="#4a6741" />}
          title="Intuitive Interface"
          description="Transform your PDFs with just a few clicks. Our streamlined process makes adding note space effortless for students, researchers, and professionals alike."
        />
        
        <FeatureCard 
          icon={<FaSlidersH size={24} color="#4a6741" />}
          title="Fully Customizable"
          description="Tailor the note space to your exact requirements. Adjust width, position, and color to complement your workflow and enhance your productivity."
        />
        
        <FeatureCard 
          icon={<FaLock size={24} color="#4a6741" />}
          title="Privacy Guaranteed"
          description="Your documents never leave your device. All processing happens locally in your browser, ensuring complete confidentiality for sensitive materials."
        />
        
        <FeatureCard 
          icon={<FaGift size={24} color="#4a6741" />}
          title="Always Free"
          description="Access professional-grade PDF enhancement without cost. No registration, subscriptions, or hidden fees—just powerful functionality when you need it."
        />
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div style={{
      flex: 1,
      backgroundColor: 'rgba(255,255,255,0.7)',
      padding: '15px',
      borderRadius: '8px',
      height: '130px',
      overflow: 'auto',
      marginBottom: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'default',
      minWidth: '200px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ marginRight: '10px' }}>{icon}</div>
        <h3 style={{ margin: '0', fontSize: '18px', fontWeight: '600', color: '#2c3e50' }}>{title}</h3>
      </div>
      <p style={{ margin: '0', fontSize: '13px', lineHeight: '1.4', color: '#34495e' }}>
        {description}
      </p>
    </div>
  );
};

export default Features; 