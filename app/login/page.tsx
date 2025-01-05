'use client';
import { signIn } from "next-auth/react";
import { SignUpForm } from "./form";
import { useState } from "react";
import Navbar from "@/components/navbar";

// Définition des types
interface LoginState {
  error?: string;
}

const loginAction = async (formData: FormData): Promise<LoginState> => {
  try {
    const result = await signIn('credentials', {
      redirect: false,
      username: formData.get('username'),
      password: formData.get('password'),
    });

    if (!result?.error) {
      window.location.href = '/profile';
      return {};
    }

    return { error: result.error };
  } catch (e) {
    console.error('Login error:', e);
    return { error: 'An unexpected error occurred' };
  }
};

function LoginForm() {
  const [state, setState] = useState<LoginState>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await loginAction(formData);
    setState(result);
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {state.error && (
          <span className="text-red-500 text-sm">{state.error}</span>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <>
      <Navbar toggleColumn={function (): void {
        throw new Error("Function not implemented.");
      } } />
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-2xl font-bold text-center mb-8">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </h1>
          
          <div className="flex justify-center space-x-4 mb-4">
            <button
              onClick={() => setIsSignUp(true)}
              className={`px-4 py-2 rounded ${isSignUp ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setIsSignUp(false)}
              className={`px-4 py-2 rounded ${!isSignUp ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Sign In
            </button>
          </div>

          {isSignUp ? <SignUpForm /> : <LoginForm />}
          
          <div className="space-y-4">
            <button
              onClick={() => signIn("google", { callbackUrl: '/profile' })}
              className="w-full py-2 px-4 bg-[#4285F4] text-white rounded hover:bg-[#357ABD] transition-colors"
            >
              Sign in with Google
            </button>

            <button
              onClick={() => signIn("github", { callbackUrl: '/profile' })}
              className="w-full py-2 px-4 bg-[#333] text-white rounded hover:bg-[#222] transition-colors"
            >
              Sign in with Github
            </button>

            <button
              onClick={() => signIn("discord", { callbackUrl: '/profile' })}
              className="w-full py-2 px-4 bg-[#7289DA] text-white rounded hover:bg-[#677BC4] transition-colors"
            >
              Sign in with Discord
            </button>
          </div>
        </div>
      </div>
    </>
  );
}