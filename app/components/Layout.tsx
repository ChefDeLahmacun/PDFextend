import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  feedbackSectionNeedsExtraHeight: boolean;
}

const Layout = ({ children, feedbackSectionNeedsExtraHeight }: LayoutProps) => {
  return (
    <div style={{ 
      width: '100%', 
      minHeight: '85vh',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#f2c4aa',
      border: 'none',
      outline: 'none'
    }}>
      {/* Background color sections */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100px',
        backgroundColor: '#edc077',
        zIndex: 0
      }}></div>
      
      <div style={{
        position: 'absolute',
        top: '100px',
        left: 0,
        width: '100%',
        height: '350px',
        backgroundColor: '#b5b2ae',
        zIndex: 0
      }}></div>
      
      {/* Green section with fixed height */}
      <div id="greenSection" style={{
        position: 'absolute',
        top: '450px',
        left: 0,
        width: '100%',
        height: '950px', /* Fixed height matching the content wrapper */
        backgroundColor: '#c7edd4',
        zIndex: 0
      }}></div>
      
      <div style={{
        position: 'absolute',
        top: '1400px', /* 450px + 950px */
        left: 0,
        width: '100%',
        height: feedbackSectionNeedsExtraHeight ? '500px' : '400px',
        backgroundColor: '#c7caed',
        zIndex: 0
      }}></div>
      
      {/* Left side box */}
      <div style={{
        backgroundColor: '#f2c4aa',
        width: '180px',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 1
      }}></div>
      
      {/* Right side box */}
      <div style={{
        backgroundColor: '#f2c4aa',
        width: '180px',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 1
      }}></div>
      
      {/* Main content */}
      <div style={{
        position: 'relative',
        width: 'calc(100% - 360px)',
        maxWidth: '1200px',
        margin: '0 auto',
        marginLeft: '180px',
        paddingTop: '0',
        zIndex: 2
      }}>
        {children}
      </div>
    </div>
  );
};

export default Layout; 