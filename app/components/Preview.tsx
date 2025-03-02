'use client';

import React from 'react';

interface PreviewProps {
  file: File | null;
  isProcessing: boolean;
  pdfPreviewUrl: string | { original: string, modified: string };
}

const Preview: React.FC<PreviewProps> = ({ file, isProcessing, pdfPreviewUrl }) => {
  return (
    <div style={{
      flex: 3,
      padding: '20px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: '10px',
        marginTop: '0'
      }}>
        PREVIEW
      </h2>
      
      {/* How-to-use instructions */}
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: '10px 15px',
        borderRadius: '5px',
        marginBottom: '15px',
        border: '1px solid #ddd'
      }}>
        <p style={{ fontSize: '14px', margin: '0', lineHeight: '1.4' }}>
          <strong>How to use:</strong> Upload your PDF, select where to add note-taking space and customize its width and color. 
          Download the modified PDF and open it in your preferred application to start taking notes in the added space.
        </p>
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px', marginTop: '0' }}>Original</h3>
          <div style={{ 
            height: '300px',
            border: '1px solid #ddd',
            backgroundColor: 'white'
          }}>
            {file ? (
              <div style={{ height: '100%', overflow: 'auto' }}>
                {isProcessing ? (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    backgroundColor: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <p>Processing PDF...</p>
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '100%', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {pdfPreviewUrl ? (
                      <iframe 
                        src={`${typeof pdfPreviewUrl === 'object' ? pdfPreviewUrl.original : pdfPreviewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                        style={{ 
                          width: '100%', 
                          height: '100%',
                          border: 'none'
                        }} 
                        title="PDF Preview"
                      />
                    ) : (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        height: '100%' 
                      }}>
                        <p>PDF preview not available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.5)',
                border: '1px dashed #999'
              }}>
                <p>Upload a PDF to see original</p>
              </div>
            )}
          </div>
        </div>
        
        <div style={{ height: '1px', backgroundColor: 'black', margin: '10px 0' }}></div>
        
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px', marginTop: '0' }}>Preview with Notes</h3>
          <div style={{ 
            height: '300px',
            border: '1px solid #ddd',
            backgroundColor: 'white'
          }}>
            {file ? (
              <div style={{ height: '100%', overflow: 'auto' }}>
                {isProcessing ? (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    backgroundColor: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <p>Processing PDF...</p>
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '100%', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {pdfPreviewUrl ? (
                      <iframe 
                        src={`${typeof pdfPreviewUrl === 'object' ? pdfPreviewUrl.modified : pdfPreviewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                        style={{ 
                          width: '100%', 
                          height: '100%',
                          border: 'none'
                        }} 
                        title="PDF Preview with Notes"
                      />
                    ) : (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        height: '100%' 
                      }}>
                        <p>PDF preview not available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.5)',
                border: '1px dashed #999'
              }}>
                <p>Upload a PDF to see preview</p>
              </div>
            )}
          </div>
          {file && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ fontSize: '12px', margin: '0' }}>Note: Only the first 3 pages will be shown in the preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview; 