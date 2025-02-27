'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface PDFUploadProps {
  onFileUpload: (file: File) => void;
}

export default function PDFUpload({ onFileUpload }: PDFUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'application/pdf') {
        onFileUpload(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-500">Drop the PDF file here</p>
      ) : (
        <div>
          <p className="text-gray-600">Drag and drop a PDF file here, or click to select a file</p>
          <p className="text-sm text-gray-400 mt-2">Only PDF files are accepted</p>
        </div>
      )}
    </div>
  );
} 