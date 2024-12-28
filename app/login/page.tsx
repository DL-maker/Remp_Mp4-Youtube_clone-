'use client';
import { signIn } from "next-auth/react";
import { SignUpForm } from "./form";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-2xl font-bold text-center mb-8">Sign In</h1>
        
        <SignUpForm />
        
        <div className="space-y-4">
          <button
            onClick={() => signIn("google")}
            className="w-full py-2 px-4 bg-[#4285F4] text-white rounded hover:bg-[#357ABD] transition-colors"
          >
            Sign in with Google
          </button>

          <button
            onClick={() => signIn("github")}
            className="w-full py-2 px-4 bg-[#333] text-white rounded hover:bg-[#222] transition-colors"
          >
            Sign in with Github
          </button>

          <button
            onClick={() => signIn("discord")}
            className="w-full py-2 px-4 bg-[#7289DA] text-white rounded hover:bg-[#677BC4] transition-colors"
          >
            Sign in with Discord
          </button>
        </div>
      </div>
    </div>
  );
}