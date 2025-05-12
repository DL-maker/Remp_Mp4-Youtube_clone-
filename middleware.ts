import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/app/_lib/session';

// Les routes qui nécessitent une authentification
const protectedRoutes = [
  '/vos_videos',
  '/profile',
  '/parametre',
  '/historique',
  '/Liked',
  '/Dis_like',
  '/abonnement'
];

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;

  // Vérifier si la route actuelle est une route protégée
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!sessionCookie) {
      // Rediriger vers la page de connexion avec l'URL de retour
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const session = await decrypt(sessionCookie);
      if (!session?.userId) {
        // Session invalide, rediriger vers la page de connexion
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      // Erreur de décryptage de la session, rediriger vers la page de connexion
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/vos_videos/:path*',
    '/profile/:path*',
    '/parametre/:path*',
    '/historique/:path*',
    '/Liked/:path*',
    '/Dis_like/:path*',
    '/abonnement/:path*'
  ],
};

