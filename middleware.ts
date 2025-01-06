import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest, ev: any) {
  return NextResponse.next();
}