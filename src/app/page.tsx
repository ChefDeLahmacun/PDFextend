'use client';

import { useState } from 'react';
import PDFUpload from '../components/PDFUpload';
import PDFViewer from '../components/PDFViewer';
import NoteSpaceControl from '../components/NoteSpaceControl';
import DownloadButton from '../components/DownloadButton';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [noteSpaceWidth, setNoteSpaceWidth] = useState(200);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">PDF Note Space Extender</h1>
        
        <div className="space-y-6">
          {!file && (
            <div className="max-w-xl mx-auto">
              <PDFUpload onFileUpload={setFile} />
            </div>
          )}

          {file && (
            <>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setFile(null)}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Upload Different PDF
                </button>
                <div className="w-64">
                  <NoteSpaceControl
                    width={noteSpaceWidth}
                    onChange={setNoteSpaceWidth}
                  />
                </div>
                <DownloadButton
                  file={file}
                  noteSpaceWidth={noteSpaceWidth}
                />
              </div>

              <div className="overflow-x-auto pb-8">
                <PDFViewer
                  file={file}
                  noteSpaceWidth={noteSpaceWidth}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
} 