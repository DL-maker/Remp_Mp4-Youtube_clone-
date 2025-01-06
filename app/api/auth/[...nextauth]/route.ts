// Remove unused import
// import { auth } from "@/auth";
import NextAuth from "next-auth";

// Remove unused parameter
export async function GET() {
  const authResponse = await NextAuth({
    providers: [
      // Add your providers here
    ],
    secret: process.env.NEXTAUTH_SECRET,
    // Add other NextAuth configuration options here
  });
  return new Response(JSON.stringify(authResponse), {
    headers: { "Content-Type": "application/json" },
  });
}

// Remove unused parameter
export async function POST() {
  const authResponse = await NextAuth({
    providers: [
      // Add your providers here
    ],
    secret: process.env.NEXTAUTH_SECRET,
    // Add other NextAuth configuration options here
  });
  return new Response(JSON.stringify(authResponse), {
    headers: { "Content-Type": "application/json" },
  });
}