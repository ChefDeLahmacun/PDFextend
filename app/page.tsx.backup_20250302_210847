'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import Image from 'next/image';

// Import components
import Layout from './components/Layout';
import Header from './components/Header';
import Features from './components/Features';
import Controls from './components/Controls';
import Preview from './components/Preview';
import FeedbackForm from './components/FeedbackForm';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [noteSpaceWidth, setNoteSpaceWidth] = useState(200);
  const [outputFileName, setOutputFileName] = useState('');
  const [baseFileName, setBaseFileName] = useState('');
  const [includeWithNotes, setIncludeWithNotes] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | { original: string, modified: string }>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [downloadIsProcessing, setDownloadIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // New state variables for color options
  const [useCustomColor, setUseCustomColor] = useState(true);
  const [colorOption, setColorOption] = useState('white'); // 'white', 'custom'
  const [customColor, setCustomColor] = useState('#ffffff'); // Default white
  const [noteSpacePosition, setNoteSpacePosition] = useState('right'); // 'right', 'left', 'top', 'bottom'
  const predefinedColors = [
    { name: 'White', value: '#ffffff' },
    { name: 'Light Gray', value: '#f0f0f0' },
    { name: 'Gray', value: '#cccccc' },
    { name: 'Black', value: '#000000' },
    { name: 'Light Blue', value: '#e6f7ff' },
    { name: 'Light Yellow', value: '#ffffcc' },
    { name: 'Light Green', value: '#e6ffcc' },
    { name: 'Light Pink', value: '#ffe6e6' }
  ];

  // New state for feedback image
  const [feedbackImages, setFeedbackImages] = useState<File[]>([]);
  const [feedbackImagePreviews, setFeedbackImagePreviews] = useState<string[]>([]);
  const feedbackImageRef = useRef<HTMLInputElement>(null);

  // New state for tracking if the feedback section needs extra height
  const [feedbackSectionNeedsExtraHeight, setFeedbackSectionNeedsExtraHeight] = useState(false);

  const handleFileUpload = (uploadedFile: File) => {
    if (uploadedFile.size > 50 * 1024 * 1024) { // 50MB
      alert('File size exceeds 50MB limit. Please choose a smaller file.');
      return;
    }
    setFile(uploadedFile);
    const baseName = uploadedFile.name.replace(/\.pdf$/, '');
    setBaseFileName(baseName);
    updateOutputFileName(baseName, includeWithNotes);
  };

  const clearFile = () => {
    setFile(null);
    setOutputFileName('');
    setBaseFileName('');
    setPdfPreviewUrl('');
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Update the output filename when baseFileName or includeWithNotes changes
  const updateOutputFileName = (base: string, withNotes: boolean) => {
    if (base) {
      setOutputFileName(withNotes ? `${base}_with_notes.pdf` : `${base}.pdf`);
    }
  };

  useEffect(() => {
    updateOutputFileName(baseFileName, includeWithNotes);
  }, [baseFileName, includeWithNotes]);

  // Handle base filename change
  const handleBaseFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBaseFileName = e.target.value;
    setBaseFileName(newBaseFileName);
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeWithNotes(e.target.checked);
  };

  // Reset base filename
  const resetBaseFileName = () => {
    if (file) {
      const baseName = file.name.replace(/\.pdf$/, '');
      setBaseFileName(baseName);
    } else {
      setBaseFileName('');
    }
  };

  // PDF Viewer functionality
  useEffect(() => {
    const generatePreview = async () => {
      if (!file) return;
      
      try {
        setIsProcessing(true);
        
        // Read the file
        const fileBuffer = await file.arrayBuffer();
        const originalPdfDoc = await PDFDocument.load(fileBuffer);
        const totalPageCount = originalPdfDoc.getPageCount();
        setTotalPages(totalPageCount);

        // Create original preview document (max 3 pages)
        const originalPreviewDoc = await PDFDocument.create();
        const pagesToPreview = Math.min(totalPageCount, 3);

        // Copy pages to original preview document without modifications
        for (let i = 0; i < pagesToPreview; i++) {
          const [originalPage] = await originalPreviewDoc.copyPages(originalPdfDoc, [i]);
          originalPreviewDoc.addPage(originalPage);
        }

        // Save and create URL for original preview
        const originalPdfBytes = await originalPreviewDoc.save();
        
        // Create original preview URL
        const originalPreviewUrl = URL.createObjectURL(new Blob([originalPdfBytes], { type: 'application/pdf' }));
        
        // Create modified preview document (max 3 pages)
        const modifiedPreviewDoc = await PDFDocument.create();

        // Copy pages to modified preview document
        for (let i = 0; i < pagesToPreview; i++) {
          // If noteSpaceWidth is provided, create a new page with extended dimensions
          if (noteSpaceWidth > 0) {
            const originalPage = originalPdfDoc.getPage(i);
            const { width, height } = originalPage.getSize();
            
            // Calculate new dimensions based on position
            let newWidth = width;
            let newHeight = height;
            
            if (noteSpacePosition === 'right' || noteSpacePosition === 'left') {
              newWidth = width + noteSpaceWidth;
            } else { // top or bottom
              newHeight = height + noteSpaceWidth;
            }
            
            // Create a new blank page with the new dimensions
            const newPage = modifiedPreviewDoc.addPage([newWidth, newHeight]);
            
            // Embed the original page content
            const embeddedPage = await modifiedPreviewDoc.embedPage(originalPage);
            
            // Calculate position for the embedded content
            let contentX = 0;
            let contentY = 0;
            
            if (noteSpacePosition === 'left') {
              contentX = noteSpaceWidth;
            } else if (noteSpacePosition === 'bottom') {
              contentY = noteSpaceWidth;
            }
            
            // Draw the embedded page at the correct position
            newPage.drawPage(embeddedPage, {
              x: contentX,
              y: contentY
            });
            
            // Apply color to the note space
            const color = colorOption === 'custom' ? customColor : '#ffffff';
            const rgbColor = hexToRgb(color);
            if (rgbColor) {
              // Position the rectangle based on the selected position
              let x = 0, y = 0;
              let rectWidth = 0, rectHeight = 0;
              
              switch (noteSpacePosition) {
                case 'right':
                  x = width;
                  y = 0;
                  rectWidth = noteSpaceWidth;
                  rectHeight = height;
                  break;
                case 'left':
                  x = 0;
                  y = 0;
                  rectWidth = noteSpaceWidth;
                  rectHeight = height;
                  break;
                case 'top':
                  x = 0;
                  y = height;
                  rectWidth = width;
                  rectHeight = noteSpaceWidth;
                  break;
                case 'bottom':
                  x = 0;
                  y = 0;
                  rectWidth = width;
                  rectHeight = noteSpaceWidth;
                  break;
              }
              
              // Draw the rectangle
              newPage.drawRectangle({
                x,
                y,
                width: rectWidth,
                height: rectHeight,
                color: rgb(rgbColor.r, rgbColor.g, rgbColor.b)
              });
            }
          } else {
            // If no note space is needed, just copy the original page
            const [page] = await modifiedPreviewDoc.copyPages(originalPdfDoc, [i]);
            modifiedPreviewDoc.addPage(page);
          }
        }

        // Save and create URL for modified preview
        const modifiedPdfBytes = await modifiedPreviewDoc.save();
        
        // Clean up old preview URL
        if (pdfPreviewUrl) {
          if (typeof pdfPreviewUrl === 'object') {
            URL.revokeObjectURL(pdfPreviewUrl.original);
            URL.revokeObjectURL(pdfPreviewUrl.modified);
          } else {
            URL.revokeObjectURL(pdfPreviewUrl);
          }
        }

        // Create new preview URL for modified PDF
        const modifiedPreviewUrl = URL.createObjectURL(new Blob([modifiedPdfBytes], { type: 'application/pdf' }));
        
        // Set the preview URLs
        setPdfPreviewUrl({
          original: originalPreviewUrl,
          modified: modifiedPreviewUrl
        });
      } catch (error) {
        console.error('Error generating preview:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    if (file) {
      generatePreview();
    }

    // Cleanup function
    return () => {
      if (pdfPreviewUrl) {
        if (typeof pdfPreviewUrl === 'object') {
          URL.revokeObjectURL(pdfPreviewUrl.original);
          URL.revokeObjectURL(pdfPreviewUrl.modified);
        } else {
          URL.revokeObjectURL(pdfPreviewUrl);
        }
      }
    };
  }, [file, noteSpaceWidth, colorOption, customColor, noteSpacePosition]);

  // Download functionality
  const handleDownload = async () => {
    if (!file) return;
    
    try {
      setDownloadIsProcessing(true);

      // Read the file
      const fileBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer);
      
      // Create a new PDF document for the modified pages
      const modifiedPdfDoc = await PDFDocument.create();
      
      // Process each page
      const pages = pdfDoc.getPages();
      for (let i = 0; i < pages.length; i++) {
        const originalPage = pdfDoc.getPage(i);
        const { width, height } = originalPage.getSize();
        
        // If noteSpaceWidth is provided, create a new page with extended dimensions
        if (noteSpaceWidth > 0) {
          // Calculate new dimensions based on position
          let newWidth = width;
          let newHeight = height;
          
          if (noteSpacePosition === 'right' || noteSpacePosition === 'left') {
            newWidth = width + noteSpaceWidth;
          } else { // top or bottom
            newHeight = height + noteSpaceWidth;
          }
          
          // Create a new blank page with the new dimensions
          const newPage = modifiedPdfDoc.addPage([newWidth, newHeight]);
          
          // Embed the original page content
          const embeddedPage = await modifiedPdfDoc.embedPage(originalPage);
          
          // Calculate position for the embedded content
          let contentX = 0;
          let contentY = 0;
          
          if (noteSpacePosition === 'left') {
            contentX = noteSpaceWidth;
          } else if (noteSpacePosition === 'bottom') {
            contentY = noteSpaceWidth;
          }
          
          // Draw the embedded page at the correct position
          newPage.drawPage(embeddedPage, {
            x: contentX,
            y: contentY
          });
          
          // Apply color to the note space
          const color = colorOption === 'custom' ? customColor : '#ffffff';
          const rgbColor = hexToRgb(color);
          if (rgbColor) {
            // Position the rectangle based on the selected position
            let x = 0, y = 0;
            let rectWidth = 0, rectHeight = 0;
            
            switch (noteSpacePosition) {
              case 'right':
                x = width;
                y = 0;
                rectWidth = noteSpaceWidth;
                rectHeight = height;
                break;
              case 'left':
                x = 0;
                y = 0;
                rectWidth = noteSpaceWidth;
                rectHeight = height;
                break;
              case 'top':
                x = 0;
                y = height;
                rectWidth = width;
                rectHeight = noteSpaceWidth;
                break;
              case 'bottom':
                x = 0;
                y = 0;
                rectWidth = width;
                rectHeight = noteSpaceWidth;
                break;
            }
            
            // Draw the rectangle
            newPage.drawRectangle({
              x,
              y,
              width: rectWidth,
              height: rectHeight,
              color: rgb(rgbColor.r, rgbColor.g, rgbColor.b)
            });
          }
        } else {
          // If no note space is needed, just copy the original page
          const [page] = await modifiedPdfDoc.copyPages(pdfDoc, [i]);
          modifiedPdfDoc.addPage(page);
        }
      }

      // Save the PDF
      const modifiedPdfBytes = await modifiedPdfDoc.save();
      
      // Create download link
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = outputFileName || file.name.replace('.pdf', '_with_notes.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // After processing, show feedback
      setIsProcessing(false);
      setFeedback('PDF downloaded successfully!');
      clearAllFeedbackImages();
      setFeedbackSectionNeedsExtraHeight(false);

    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Error processing PDF. Please try again with a different file.');
    } finally {
      setDownloadIsProcessing(false);
    }
  };

  // Helper function to convert hex color to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : null;
  };

  // Handle feedback image upload
  const handleFeedbackImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Convert FileList to array
      const newFiles: File[] = Array.from(files);
      
      // Check if files are images and within size limit
      const validFiles = newFiles.filter(file => {
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
          alert('Please upload only image files (JPEG, PNG, etc.)');
          return false;
        }
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`Image "${file.name}" exceeds 5MB limit. Please choose a smaller image.`);
          return false;
        }
        
        return true;
      });
      
      if (validFiles.length > 0) {
        // Add new files to existing files
        setFeedbackImages(prev => [...prev, ...validFiles]);
        setFeedbackSectionNeedsExtraHeight(true);
        
        // Create previews for new files
        validFiles.forEach(file => {
          const reader = new FileReader();
          reader.onload = (e) => {
            setFeedbackImagePreviews(prev => [...prev, e.target?.result as string]);
          };
          reader.readAsDataURL(file);
        });
      }
      
      // Reset the file input to allow selecting the same files again
      if (feedbackImageRef.current) {
        feedbackImageRef.current.value = '';
      }
    }
  };
  
  // Clear all feedback images
  const clearAllFeedbackImages = () => {
    setFeedbackImages([]);
    setFeedbackImagePreviews([]);
    setFeedbackSectionNeedsExtraHeight(false);
    if (feedbackImageRef.current) {
      feedbackImageRef.current.value = '';
    }
  };
  
  // Remove a specific feedback image
  const removeFeedbackImage = (index: number) => {
    setFeedbackImages(prev => prev.filter((_, i) => i !== index));
    setFeedbackImagePreviews(prev => prev.filter((_, i) => i !== index));
    
    // If no images left, reset the extra height
    if (feedbackImages.length <= 1) {
      setFeedbackSectionNeedsExtraHeight(false);
    }
  };
  
  // Submit feedback
  const submitFeedback = () => {
    // In a real application, you would send the feedback and images to a server
    // For now, we'll just show an alert and clear the form
    setFeedback('');
    setFeedbackImages([]);
    setFeedbackImagePreviews([]);
    setFeedbackSectionNeedsExtraHeight(false);
    if (feedbackImageRef.current) {
      feedbackImageRef.current.value = '';
    }
    alert('Thank you for your feedback!');
  };

  return (
    <Layout feedbackSectionNeedsExtraHeight={feedbackSectionNeedsExtraHeight}>
      <Header />
      
      <Features />
      
      <div 
        className="green-content-wrapper"
        style={{
          width: '100%',
          height: '950px',
          display: 'flex',
          boxSizing: 'border-box',
          paddingBottom: '60px',
          borderBottom: '1px solid #ddd',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
          flex: 1,
          flexWrap: 'wrap'
        }}>
          <Preview 
            file={file}
            isProcessing={isProcessing}
            pdfPreviewUrl={pdfPreviewUrl}
          />
          
          <div style={{
            width: '1px',
            backgroundColor: 'black',
            height: '100%'
          }}></div>
          
          <Controls 
            file={file}
            noteSpaceWidth={noteSpaceWidth}
            setNoteSpaceWidth={setNoteSpaceWidth}
            noteSpacePosition={noteSpacePosition}
            setNoteSpacePosition={setNoteSpacePosition}
            colorOption={colorOption}
            setColorOption={setColorOption}
            customColor={customColor}
            setCustomColor={setCustomColor}
            baseFileName={baseFileName}
            handleBaseFileNameChange={handleBaseFileNameChange}
            includeWithNotes={includeWithNotes}
            handleCheckboxChange={handleCheckboxChange}
            resetBaseFileName={resetBaseFileName}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
            clearFile={clearFile}
            handleDownload={handleDownload}
            downloadIsProcessing={downloadIsProcessing}
            predefinedColors={predefinedColors}
          />
        </div>
      </div>
      
      <FeedbackForm 
        feedback={feedback}
        setFeedback={setFeedback}
        feedbackImages={feedbackImages}
        feedbackImagePreviews={feedbackImagePreviews}
        handleFeedbackImageUpload={handleFeedbackImageUpload}
        clearAllFeedbackImages={clearAllFeedbackImages}
        removeFeedbackImage={removeFeedbackImage}
        submitFeedback={submitFeedback}
        feedbackSectionNeedsExtraHeight={feedbackSectionNeedsExtraHeight}
      />
    </Layout>
  );
}
