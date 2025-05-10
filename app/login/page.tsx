'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar';
import { SignUpForm } from './form';

interface LoginState {
  error?: string;
}

function LoginForm() {
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
        window.location.href = '/profile';
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

  const toggleColumn = () => {
    setIsColumnOpen((prev) => !prev);
  };

  return (
    <>
      <Navbar toggleColumn={toggleColumn} isOpen={isColumnOpen} />
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

          {isSignUp ? <SignUpForm /> : <LoginForm />}
        </div>
      </div>
    </>
  );
}