'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import { SignUpForm } from './form';

interface LoginState {
  error?: string;
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, setState] = useState<LoginState>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.get('username'),
          password: formData.get('password'),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        setState({ error: data.error || 'Erreur lors de la connexion' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setState({ error: 'Une erreur est survenue lors de la connexion' });
    }
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
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isColumnOpen, setIsColumnOpen] = useState(false);
  const router = useRouter();

  const toggleColumn = () => {
    setIsColumnOpen((prev) => !prev);
  };

  const handleLoginSuccess = () => {
    const params = new URLSearchParams(window.location.search);
    let redirectUrl = params.get('redirect');

    // Validate the redirectyrl
    if (redirectUrl) {
      try {
        const url = new URL(redirectUrl, window.location.origin); // use a base URL to corectly pars relative path
        // allow only relative paths starting with '/'
        // disallow absolute URLs or protocol-relative URLs
        if (url.origin !== window.location.origin || !redirectUrl.startsWith('/') || redirectUrl.startsWith('//')) {
          console.warn('Invalid redirect URL detected:', redirectUrl);
          redirectUrl = '/'; // Default to a safe redirect
        }
      } catch (e) {
        console.warn('Error parsing redirect URL:', redirectUrl, e);
        redirectUrl = '/'; // Default to a safe redirect on error
      }
    } else {
      redirectUrl = '/'; // Default redirect if no parameter is provided
    }

    router.push(redirectUrl);
  };

  return (
    <>
      <Navbar toggleColumn={toggleColumn} isOpen={isColumnOpen} isLoggedIn={false} onLogout={function (): void {
        throw new Error('Function not implemented.');
      } } />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            {isSignUp ? 'Créer un compte' : 'Connexion'}
          </h1>

          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setIsSignUp(true)}
              className={`px-6 py-2 rounded-lg font-medium ${
                isSignUp
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 transition'
              }`}
            >
              Inscription
            </button>
            <button
              onClick={() => setIsSignUp(false)}
              className={`px-6 py-2 rounded-lg font-medium ${
                !isSignUp
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 transition'
              }`}
            >
              Connexion
            </button>
          </div>

          {isSignUp ? <SignUpForm /> : <LoginForm onSuccess={handleLoginSuccess} />}
        </div>
      </div>
    </>
  );
}