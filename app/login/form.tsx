'use client';

import { useState } from 'react';

interface SignUpState {
  error?: string;
  success?: boolean;
}

export function SignUpForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState<SignUpState>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({}); // Reset previous states
    
    try {
      // Créer correctement un objet FormData à partir du formulaire
      const formData = new FormData(event.currentTarget);
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        // Pas besoin de spécifier Content-Type pour FormData,
        // le navigateur le définit automatiquement avec la boundary
        body: formData
      });
      
      // Check if the response is ok before parsing
      if (!response.ok) {
        // Try to parse the error message from the response
        try {
          const errorData = await response.json();
          setState({ error: errorData.error || 'Failed to sign up' });
        } catch {
          // If parsing fails, provide a generic error message
          setState({ error: 'Failed to sign up' });
        }
        return;
      }
      
      // Parse the response data
      const data = await response.json();
      
      // Check if data is defined before accessing its properties
      if (data && data.message === 'User created successfully') {
        setState({ success: true });
      } else {
        setState({ error: data?.error || 'Failed to sign up' });
      }
      
      // Optionnel: rediriger ou afficher un message de succès
    } catch (error: unknown) {
      console.error('Signup error:', error);
      setState({ error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      {state.success ? (
        <div className="text-green-600 text-sm p-2 bg-green-100 rounded mb-4">
          Account created successfully! You can now sign in.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            Create Account
          </button>
        </form>
      )}
    </div>
  );
}