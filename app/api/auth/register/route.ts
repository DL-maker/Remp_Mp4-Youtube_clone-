// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';

// Gestionnaire POST pour l'enregistrement
export async function POST() {
  return NextResponse.json({ message: 'Registration temporarily disabled' });
}

// Gestionnaire GET optionnel
export async function GET() {
  return NextResponse.json({ 
    status: 'Method not allowed', 
    message: 'Please use POST request for registration' 
  }, { status: 405 });
}