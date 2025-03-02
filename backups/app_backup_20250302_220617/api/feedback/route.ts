import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // We're not processing the feedback here anymore since it's handled by FormSubmit.co
    // Just return a success response
    return new NextResponse(JSON.stringify({ 
      success: true,
      message: 'Feedback is now handled directly by FormSubmit.co in the frontend'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (error) {
    console.error('API route error:', error);
    return new NextResponse(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  }
} 