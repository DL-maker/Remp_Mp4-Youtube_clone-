import { verifySession } from '@/app/_lib/session';
import { prisma } from '@/lib/prisma';
import { cache } from 'react';

// Définition des types
type UserRole = 'admin' | 'user';

interface UserData {
  id: string;
  username: string;
  email: string;
  videos: any[];
  likesDislikes: any[];
  comments: any[];
  subscriptionsFrom: any[];
  subscriptionsTo: any[];
}

export const getUser = cache(async () => {
  // Verify user's session
  const session = await verifySession();
  if (!session || typeof session === 'string') {
    throw new Error('Session not found');
  }
  const { userId } = session as { userId: string };

  // Fetch user data with all relations defined in schema
  const user = await prisma.user.findUnique({
    where: { 
      id: userId 
    },
    select: {
      id: true,
      username: true,
      email: true,
      videos: true,
      likesDislikes: true,
      comments: true,
      subscriptionsFrom: true,
      subscriptionsTo: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
});