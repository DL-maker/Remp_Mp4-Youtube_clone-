import { NextResponse } from 'next/server';

export async function registerUser() {
  return NextResponse.json({ message: 'Registration temporarily disabled' });
}