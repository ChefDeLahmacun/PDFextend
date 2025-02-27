'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File | null;
  noteSpaceWidth: number;
}

export default function PDFViewer({ file, noteSpaceWidth }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  if (!file) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No PDF file selected</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: `calc(100% + ${noteSpaceWidth}px)` }}>
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex flex-col items-center"
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg"
          />
        </Document>
        {numPages && numPages > 1 && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setPageNumber(page => Math.max(1, page - 1))}
              disabled={pageNumber <= 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="flex items-center">
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={() => setPageNumber(page => Math.min(numPages, page + 1))}
              disabled={pageNumber >= numPages}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 