import { NextResponse } from 'next/server';

// This file is conventionally used for NextAuth.js catch-all routes.
// To remove NextAuth, we are replacing its content to indicate it's not in use.

export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  console.log(`GET request to /api/auth/${pathname.split('/').pop()}: NextAuth not configured.`);
  return NextResponse.json(
    { error: `NextAuth feature not configured for this path: ${pathname}` },
    { status: 404 }
  );
}

export async function POST(request: Request) {
  const { pathname } = new URL(request.url);
  console.log(`POST request to /api/auth/${pathname.split('/').pop()}: NextAuth not configured.`);
  return NextResponse.json(
    { error: `NextAuth feature not configured for this path: ${pathname}` },
    { status: 404 }
  );
}