import { verifySession } from '@/app/_lib/session';
import { prisma } from '@/lib/prisma';
import { cache } from 'react';

// Define interfaces for related models
interface Video {
  id: string;
  title: string;
  // Add other video properties as needed
}

interface LikeDislike {
  id: string;
  videoId: string;
  type: 'LIKE' | 'DISLIKE';
  // Add other like/dislike properties as needed
}

interface Comment {
  id: string;
  content: string;
  videoId: string;
  // Add other comment properties as needed
}

interface Subscription {
  id: string;
  subscriberId: string;
  subscribedToId: string;
  // Add other subscription properties as needed
}

// Use the interface (this addresses the "defined but never used" error)
interface User {
  id: string;
  username: string;
  email: string;
  videos: Video[];
  likesDislikes: LikeDislike[];
  comments: Comment[];
  subscriptionsFrom: Subscription[];
  subscriptionsTo: Subscription[];
}

// Define session type
interface SessionData {
  userId: number;
}

export const getUser = cache(async (): Promise<User> => {
  // Verify user's session
  const session = await verifySession();
  if (!session || typeof session === 'string') {
    throw new Error('Session not found');
  }
  
  const { userId } = session as unknown as SessionData;

  const userIdNumber = parseInt(userId.toString(), 10);
  if (isNaN(userIdNumber)) {
    throw new Error('Invalid user ID');
  }

  // Fetch user data with all relations defined in schema
  const user = await prisma.user.findUnique({
    where: {
      id: userIdNumber
    },
    select: {
      id: true,
      username: true,
      email: true,
      videos: true,
      likes: true,
      comments: true,
      subscriptions: true,
    }
  });

  // Combine likes and dislikes if needed
  if (!user) {
    throw new Error('User not found');
  }

  // Combine likes and dislikes if needed
  const userData = {
    ...user,
    likesDislikes: user.likes
  };
  if (!user) {
    throw new Error('User not found');
  }

  return userData as unknown as User;
});