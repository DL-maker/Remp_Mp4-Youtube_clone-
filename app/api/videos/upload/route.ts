import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export async function POST() {
  try {
    // Handle the request
    return NextResponse.json({ message: 'Upload successful' });
  } catch (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error
  ) {
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}