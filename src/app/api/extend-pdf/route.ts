import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const noteSpaceWidth = Number(formData.get('noteSpaceWidth'));

    if (!file || !noteSpaceWidth) {
      return NextResponse.json(
        { error: 'File and note space width are required' },
        { status: 400 }
      );
    }

    // Read the PDF file
    const pdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    // Process each page
    for (const page of pages) {
      const { width, height } = page.getSize();
      page.setSize(width + noteSpaceWidth, height);
    }

    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save();

    // Return the modified PDF
    return new NextResponse(modifiedPdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="extended-${file.name}"`,
      },
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF' },
      { status: 500 }
    );
  }
} 