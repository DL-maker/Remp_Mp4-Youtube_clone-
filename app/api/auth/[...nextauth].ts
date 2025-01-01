import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials || typeof credentials.username !== 'string') {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (user && typeof credentials.password === 'string' && typeof user.passwordHash === 'string' && bcrypt.compareSync(credentials.password, user.passwordHash)) {
          return { id: user.id, name: user.username, email: user.email };
        }

        return null;
      },
    }),
    // ...other providers
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }: { session: any, token: any }) {
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
});
