# PDF Note Space Extender

A web application that allows users to extend PDF files by adding white space to the right side for note-taking purposes.

## Features

- PDF file upload with drag-and-drop support
- PDF preview with page navigation
- Adjustable note space width (100-500px)
- Server-side PDF processing
- Download modified PDFs with extended space
- Responsive design
- Modern UI with Tailwind CSS

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- PDF-Lib for PDF manipulation
- React-PDF for PDF preview
- React-Dropzone for file upload

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd PDFextend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Upload a PDF file by dragging and dropping it into the upload area or clicking to select a file
2. Use the slider or input field to adjust the width of the note-taking space
3. Preview the PDF with the extended space
4. Click "Download Extended PDF" to get the modified version

## Development

### Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── extend-pdf/
│   │       └── route.ts    # PDF processing API endpoint
│   └── page.tsx            # Main application page
├── components/
│   ├── PDFUpload.tsx       # File upload component
│   ├── PDFViewer.tsx       # PDF preview component
│   ├── NoteSpaceControl.tsx # Width control component
│   └── DownloadButton.tsx  # PDF download component
```

### API Endpoint

The `/api/extend-pdf` endpoint handles PDF processing:
- Accepts PDF file and note space width via FormData
- Uses PDF-Lib to modify the PDF
- Returns the modified PDF for download

## License

MIT License
