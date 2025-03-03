import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const formData = await request.formData();
    const feedback = formData.get('feedback')?.toString() || '';
    
    // Get all image files
    const attachments = [];
    const files = formData.getAll('attachment');
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file instanceof Blob) {
        const buffer = Buffer.from(await file.arrayBuffer());
        attachments.push({
          filename: `image-${i + 1}.png`,
          content: buffer
        });
      }
    }
    
    // Create a unique subject with timestamp
    const subject = `PDFextend Feedback - ${new Date().toLocaleString()}`;
    
    // Create a transporter with certificate verification disabled
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false // Bypass certificate verification
      }
    });
    
    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'code.canogullari@gmail.com',
      subject: subject,
      html: `
        <h2>New Feedback from PDFextend</h2>
        <p><strong>Feedback:</strong> ${feedback}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        ${attachments.length > 0 ? `<p><strong>Attachments:</strong> ${attachments.length} image(s)</p>` : ''}
      `,
      attachments: attachments
    };
    
    // Send the email
    await transporter.sendMail(mailOptions);
    
    // Return success response
    return NextResponse.json({ success: true, message: 'Feedback sent successfully' });
  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process feedback' },
      { status: 500 }
    );
  }
} 