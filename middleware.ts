
// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  // `withAuth` augmente votre middleware
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

// Spécifier le runtime
export const runtime = 'nodejs';

export const config = {
  matcher: [
    // Routes qui nécessitent une authentification
    "/protected/:path*",
    // Vous pouvez ajouter d'autres routes protégées
    // "/profile/:path*",
    // "/dashboard/:path*",
  ]
};

