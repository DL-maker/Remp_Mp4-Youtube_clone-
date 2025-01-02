import NextAuth, { Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { JWT } from 'next-auth/jwt';

interface ExtendedUser {
  id: string;
  name: string;
  email: string;
}

interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
}

interface ExtendedJWT extends JWT {
  id?: string;
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.username) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username as string },
        });

        if (
          user &&
          credentials.password &&
          user.passwordHash &&
          bcrypt.compareSync(credentials.password as string, user.passwordHash as string)
        ) {
          return {
            id: user.id,
            name: user.username,
            email: user.email,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }: { 
      session: Session; 
      token: ExtendedJWT;
    }): Promise<ExtendedSession> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
      };
    }, 

    async redirect({ baseUrl }: { baseUrl: string }): Promise<string> {
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});