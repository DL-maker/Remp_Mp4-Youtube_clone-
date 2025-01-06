// app/api/auth/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ status: 'Authentication temporarily disabled' });
}

export async function POST() {
  return NextResponse.json({ status: 'Authentication temporarily disabled' });
}

// Note: Ne pas utiliser export default dans les route handlers de Next.js
// Remove any default export