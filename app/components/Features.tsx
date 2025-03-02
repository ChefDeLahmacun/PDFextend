'use client';

import React from 'react';

const Features: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      minHeight: '350px',
      padding: '15px 20px 15px 20px',
      boxSizing: 'border-box',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 2,
      maxHeight: '350px'
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
          <strong>Created with AI:</strong> This website was developed using artificial intelligence. Please share any feedback or report bugs using the form at the bottom of the page.
        </p>
      </div>
      
      <h2 style={{
        textAlign: 'center',
        margin: '0 0 10px 0',
        color: '#333',
        fontSize: '24px'
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
          title="Easy to Use"
          description="SpaceMyPDF allows you to easily add note space to your PDFs. Perfect for students, professionals, and anyone who needs more room for annotations."
        />
        
        <FeatureCard 
          title="Customizable"
          description="Adjust the note space width to fit your needs. Whether you need a small margin or a full page for notes, SpaceMyPDF has you covered."
        />
        
        <FeatureCard 
          title="Private & Secure"
          description="All processing happens directly in your browser. Your PDFs never leave your device, ensuring complete privacy and security for your sensitive documents."
        />
        
        <FeatureCard 
          title="Free to Use"
          description="SpaceMyPDF is completely free to use. No registration required, no hidden fees, and no limits on the number of PDFs you can process."
        />
      </div>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => {
  return (
    <div style={{
      flex: 1,
      backgroundColor: 'rgba(255,255,255,0.7)',
      padding: '12px',
      borderRadius: '5px',
      height: '130px',
      overflow: 'auto',
      marginBottom: '10px'
    }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{title}</h3>
      <p style={{ margin: '0', fontSize: '13px', lineHeight: '1.3' }}>
        {description}
      </p>
    </div>
  );
};

export default Features; 