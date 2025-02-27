'use client';

import { useState } from 'react';

interface DownloadButtonProps {
  file: File;
  noteSpaceWidth: number;
}

export default function DownloadButton({ file, noteSpaceWidth }: DownloadButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDownload = async () => {
    try {
      setIsProcessing(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('noteSpaceWidth', noteSpaceWidth.toString());

      const response = await fetch('/api/extend-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `extended-${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to process and download the PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isProcessing}
      className={`px-4 py-2 rounded-md text-white ${
        isProcessing
          ? 'bg-blue-400 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      {isProcessing ? 'Processing...' : 'Download Extended PDF'}
    </button>
  );
} 