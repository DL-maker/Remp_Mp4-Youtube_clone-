'use client';

import { signIn } from 'next-auth/react';
import { SignUpForm } from './form';
import { useState } from 'react';
import Navbar from '@/components/navbar';

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
    return { error: 'An unexpected error occurred. Please try again.' };
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
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {state.error && (
          <div className="text-red-600 text-sm p-2 bg-red-100 rounded">
            {state.error}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [isColumnOpen, setIsColumnOpen] = useState(false);

  const toggleColumn = () => {
    setIsColumnOpen((prev) => !prev);
  };

  return (
    <>
      <Navbar toggleColumn={toggleColumn} isOpen={isColumnOpen} />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h1>

          {/* Toggle between Sign Up and Sign In */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setIsSignUp(true)}
              className={`px-6 py-2 rounded-lg font-medium ${
                isSignUp
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 transition'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setIsSignUp(false)}
              className={`px-6 py-2 rounded-lg font-medium ${
                !isSignUp
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 transition'
              }`}
            >
              Sign In
            </button>
          </div>

          {isSignUp ? <SignUpForm /> : <LoginForm />}

          {/* Social Media Sign In */}
          <div className="space-y-4">
            <button
              onClick={() => signIn('google', { callbackUrl: '/profile' })}
              className="w-full py-2 px-4 bg-[#4285F4] text-white rounded-lg hover:bg-[#357ABD] transition duration-200"
            >
              Continue with Google
            </button>
            <button
              onClick={() => signIn('github', { callbackUrl: '/profile' })}
              className="w-full py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition duration-200"
            >
              Continue with GitHub
            </button>
            <button
              onClick={() => signIn('discord', { callbackUrl: '/profile' })}
              className="w-full py-2 px-4 bg-[#7289DA] text-white rounded-lg hover:bg-[#677BC4] transition duration-200"
            >
              Continue with Discord
            </button>
          </div>

          {/* Optional Column Content */}
          {isColumnOpen && (
            <div className="mt-4 p-4 bg-gray-200 rounded-lg shadow-inner">
              <p className="text-sm">Additional column content is visible!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}