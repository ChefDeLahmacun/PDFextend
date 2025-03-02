'use client';

import React, { useEffect, useLayoutEffect } from 'react';

interface ControlsProps {
  file: File | null;
  noteSpaceWidth: number;
  setNoteSpaceWidth: (width: number) => void;
  noteSpacePosition: string;
  setNoteSpacePosition: (position: string) => void;
  colorOption: string;
  setColorOption: (option: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  baseFileName: string;
  handleBaseFileNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  includeWithNotes: boolean;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetBaseFileName: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (file: File) => void;
  clearFile: () => void;
  handleDownload: () => void;
  downloadIsProcessing: boolean;
  predefinedColors: { name: string; value: string }[];
  specifyLocation: boolean;
  setSpecifyLocation: (specify: boolean) => void;
  successMessage: string;
}

const Controls: React.FC<ControlsProps> = ({
  file,
  noteSpaceWidth,
  setNoteSpaceWidth,
  noteSpacePosition,
  setNoteSpacePosition,
  colorOption,
  setColorOption,
  customColor,
  setCustomColor,
  baseFileName,
  handleBaseFileNameChange,
  includeWithNotes,
  handleCheckboxChange,
  resetBaseFileName,
  fileInputRef,
  handleFileUpload,
  clearFile,
  handleDownload,
  downloadIsProcessing,
  predefinedColors,
  specifyLocation,
  setSpecifyLocation,
  successMessage
}) => {
  // Simple effect to trigger resize when important props change
  useEffect(() => {
    // Dispatch a resize event when file or colorOption changes
    window.dispatchEvent(new Event('resize'));
  }, [file, colorOption]);

  return (
    <div style={{
      flex: 2,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'visible'
    }}>
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: '600',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: '12px',
        marginTop: '0',
        letterSpacing: '0.5px'
      }}>
        Settings
      </h2>
      
      {/* Detailed instructions for controls section */}
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: '12px 15px',
        borderRadius: '8px',
        marginBottom: '15px',
        border: '1px solid #ddd',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <p style={{ fontSize: '14px', margin: '0 0 8px 0', lineHeight: '1.5', color: '#34495e' }}>
          <strong>Step 1:</strong> Upload your PDF below.
        </p>
        <p style={{ fontSize: '14px', margin: '0 0 8px 0', lineHeight: '1.5', color: '#34495e' }}>
          <strong>Step 2:</strong> Choose how wide you want your note space and where you want it.
        </p>
        <p style={{ fontSize: '14px', margin: '0', lineHeight: '1.5', color: '#34495e' }}>
          <strong>Step 3:</strong> Download your PDF and open it in your preferred note-taking application to start writing notes.
        </p>
      </div>
      
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: '600', marginBottom: '5px', color: '#2c3e50', fontSize: '15px' }}>Upload PDF</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              style={{ marginRight: '10px', maxWidth: '100%', width: '100%' }}
              key={file ? 'pdf-input-with-file' : 'pdf-input-empty'}
            />
          </div>
          <p style={{ fontSize: '12px', marginTop: '5px' }}>Maximum file size: 50MB</p>
        </div>
        
        {file && (
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={clearFile}
              style={{
                padding: '5px 10px',
                backgroundColor: 'white',
                border: '1px solid black',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Clear Document
            </button>
          </div>
        )}
        
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Note Space Width: {noteSpaceWidth}px</p>
          <input
            type="range"
            min="100"
            max="1000"
            value={noteSpaceWidth}
            onChange={(e) => setNoteSpaceWidth(Number(e.target.value))}
            style={{ width: '95%', maxWidth: '350px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', width: '95%', maxWidth: '350px' }}>
            <span>100px</span>
            <span>1000px</span>
          </div>
          
          {/* Preset size buttons */}
          <div style={{ marginTop: '10px' }}>
            <p style={{ fontSize: '14px', marginBottom: '5px' }}>Preset Sizes:</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setNoteSpaceWidth(200)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: noteSpaceWidth === 200 ? '#e6e6e6' : 'white',
                  border: noteSpaceWidth === 200 ? '2px solid black' : '1px solid black',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                S (200px)
              </button>
              <button
                onClick={() => setNoteSpaceWidth(400)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: noteSpaceWidth === 400 ? '#e6e6e6' : 'white',
                  border: noteSpaceWidth === 400 ? '2px solid black' : '1px solid black',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                M (400px)
              </button>
              <button
                onClick={() => setNoteSpaceWidth(600)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: noteSpaceWidth === 600 ? '#e6e6e6' : 'white',
                  border: noteSpaceWidth === 600 ? '2px solid black' : '1px solid black',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                L (600px)
              </button>
              <button
                onClick={() => setNoteSpaceWidth(800)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: noteSpaceWidth === 800 ? '#e6e6e6' : 'white',
                  border: noteSpaceWidth === 800 ? '2px solid black' : '1px solid black',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                XL (800px)
              </button>
            </div>
          </div>
        </div>
        
        {/* Note Space Position selector */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Note Space Position</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {['right', 'left', 'top', 'bottom'].map((position) => (
                <button
                  key={position}
                  onClick={() => setNoteSpacePosition(position)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: noteSpacePosition === position ? '#e6e6e6' : 'white',
                    border: noteSpacePosition === position ? '2px solid black' : '1px solid black',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    flex: '1 0 calc(50% - 10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '80px'
                  }}
                >
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    marginRight: '5px',
                    position: 'relative',
                    border: '1px solid #666',
                    borderRadius: '2px'
                  }}>
                    <div style={{ 
                      position: 'absolute',
                      backgroundColor: '#666',
                      ...(position === 'right' ? { right: 0, top: 0, width: '30%', height: '100%' } :
                         position === 'left' ? { left: 0, top: 0, width: '30%', height: '100%' } :
                         position === 'top' ? { top: 0, left: 0, width: '100%', height: '30%' } :
                         { bottom: 0, left: 0, width: '100%', height: '30%' })
                    }}></div>
                  </div>
                  {position}
                </button>
              ))}
            </div>
            <p style={{ fontSize: '12px', margin: '5px 0 0 0' }}>
              Select where to add the note space on each page
            </p>
          </div>
        </div>
        
        {/* Color options section */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Note Space Color</p>
          <p style={{ fontSize: '12px', marginTop: '0', marginBottom: '10px' }}>Default: White</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="radio"
                id="colorWhite"
                name="colorOption"
                checked={colorOption === 'white'}
                onChange={() => {
                  setColorOption('white');
                }}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="colorWhite" style={{ fontSize: '14px', cursor: 'pointer' }}>
                White (Default)
              </label>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                backgroundColor: '#ffffff', 
                border: '1px solid #ccc',
                marginLeft: '5px'
              }}></div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="radio"
                id="colorCustom"
                name="colorOption"
                checked={colorOption === 'custom'}
                onChange={() => {
                  setColorOption('custom');
                }}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="colorCustom" style={{ fontSize: '14px', cursor: 'pointer' }}>
                Custom Color
              </label>
            </div>
            
            {colorOption === 'custom' && (
              <div style={{ marginLeft: '25px', marginTop: '5px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
                  {predefinedColors.map((color) => (
                    <div
                      key={color.value}
                      onClick={() => setCustomColor(color.value)}
                      style={{
                        width: '25px',
                        height: '25px',
                        backgroundColor: color.value,
                        border: customColor === color.value ? '2px solid black' : '1px solid #ccc',
                        cursor: 'pointer',
                        borderRadius: '3px'
                      }}
                      title={color.name}
                    ></div>
                  ))}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    style={{ width: '40px', height: '30px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                        setCustomColor(value);
                      }
                    }}
                    style={{
                      width: '80px',
                      padding: '5px',
                      border: '1px solid #ccc',
                      borderRadius: '3px'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Output Filename</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              display: 'flex', 
              flex: 1,
              border: '1px solid black',
              borderRadius: '3px 0 0 3px',
              overflow: 'hidden'
            }}>
              <input
                type="text"
                value={baseFileName}
                onChange={handleBaseFileNameChange}
                style={{
                  flex: 1,
                  padding: '5px',
                  border: 'none',
                  outline: 'none',
                  minWidth: 0
                }}
                placeholder="Enter filename"
              />
              <span style={{ 
                padding: '5px', 
                backgroundColor: '#f0f0f0', 
                color: '#666',
                borderLeft: '1px solid #ccc',
                whiteSpace: 'nowrap'
              }}>
                {includeWithNotes ? '_with_notes.pdf' : '.pdf'}
              </span>
            </div>
            <button
              onClick={resetBaseFileName}
              style={{
                padding: '5px 10px',
                backgroundColor: 'white',
                border: '1px solid black',
                borderLeft: 'none',
                borderRadius: '0 3px 3px 0',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Reset
            </button>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginTop: '8px',
            gap: '8px'
          }}>
            <input
              type="checkbox"
              id="includeWithNotes"
              checked={includeWithNotes}
              onChange={handleCheckboxChange}
              style={{ cursor: 'pointer' }}
            />
            <label 
              htmlFor="includeWithNotes" 
              style={{ 
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Include "_with_notes" in filename
            </label>
          </div>
        </div>
        
        {file && (
          <>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '15px',
              gap: '8px'
            }}>
              <input
                type="checkbox"
                id="specifyLocation"
                checked={specifyLocation}
                onChange={(e) => setSpecifyLocation(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <label 
                htmlFor="specifyLocation" 
                style={{ 
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Specify where to save the document
              </label>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <button
                onClick={handleDownload}
                disabled={downloadIsProcessing}
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  border: '1px solid black',
                  borderRadius: '3px',
                  cursor: downloadIsProcessing ? 'default' : 'pointer',
                  opacity: downloadIsProcessing ? 0.7 : 1
                }}
              >
                {downloadIsProcessing ? 'Processing...' : 'Download PDF'}
              </button>
              {successMessage && (
                <div style={{ 
                  marginTop: '10px', 
                  padding: '8px 12px',
                  backgroundColor: '#e6f7e6',
                  border: '1px solid #c3e6cb',
                  borderRadius: '4px',
                  color: '#155724',
                  fontSize: '14px',
                  textAlign: 'center',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z" 
                        fill="currentColor"/>
                    </svg>
                    {successMessage}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Controls; 