import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  feedbackSectionNeedsExtraHeight: boolean;
}

const Layout = ({ children, feedbackSectionNeedsExtraHeight }: LayoutProps) => {
  // Define consistent dimensions
  const headerHeight = '100px';
  const featuresHeight = '350px';
  const greenSectionHeight = '950px';
  const feedbackHeight = feedbackSectionNeedsExtraHeight ? '500px' : '400px';
  const sideBoxWidth = '180px';
  
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
        height: headerHeight,
        backgroundColor: '#edc077',
        zIndex: 0
      }}></div>
      
      <div style={{
        position: 'absolute',
        top: headerHeight,
        left: 0,
        width: '100%',
        height: featuresHeight,
        backgroundColor: '#b5b2ae',
        zIndex: 0
      }}></div>
      
      {/* Green section with fixed height */}
      <div id="greenSection" style={{
        position: 'absolute',
        top: `calc(${headerHeight} + ${featuresHeight})`,
        left: 0,
        width: '100%',
        height: greenSectionHeight,
        backgroundColor: '#c7edd4',
        zIndex: 0
      }}></div>
      
      <div style={{
        position: 'absolute',
        top: `calc(${headerHeight} + ${featuresHeight} + ${greenSectionHeight})`,
        left: 0,
        width: '100%',
        height: feedbackHeight,
        backgroundColor: '#c7caed',
        zIndex: 0
      }}></div>
      
      {/* Left side box */}
      <div style={{
        backgroundColor: '#f2c4aa',
        width: sideBoxWidth,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 1
      }}></div>
      
      {/* Right side box */}
      <div style={{
        backgroundColor: '#f2c4aa',
        width: sideBoxWidth,
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 1
      }}></div>
      
      {/* Main content */}
      <div style={{
        position: 'relative',
        width: `calc(100% - ${parseInt(sideBoxWidth) * 2}px)`,
        maxWidth: '1200px',
        margin: '0 auto',
        marginLeft: sideBoxWidth,
        paddingTop: '0',
        zIndex: 2
      }}>
        {children}
      </div>
    </div>
  );
};

export default Layout; 