import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions } from "next-auth";
import type { NextRequest } from "next/server";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = {
          id: 1,  // Assuming this is a number from your database
          username: "test",
          email: "test@example.com"
        };

        if (credentials?.username === "test" && credentials?.password === "test") {
          return {
            id: user.id.toString(),  // Convert id to string
            name: user.username,
            email: user.email
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
  }
};

const handler = NextAuth(authOptions);

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
