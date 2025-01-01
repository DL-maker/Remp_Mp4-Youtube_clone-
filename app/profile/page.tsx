'use client';
import { useEffect, useState } from 'react';

interface ProfileState {
  userId?: string;
  username?: string;
  email?: string;
  createdAt?: string;
  error?: string;
}

export default function ProfilePage() {
  const [state, setState] = useState<ProfileState>({});

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch('/api/session');
      const result = await response.json();

      if (response.status !== 200) {
        setState({ error: result.error });
      } else {
        setState({
          userId: result.userId,
          username: result.username,
          email: result.email,
          createdAt: result.createdAt,
        });
      }
    };

    checkSession();
  }, []);

  if (state.error) {
    return <div>{state.error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-2xl font-bold text-center mb-8">Profile</h1>
        {state.userId ? (
          <div className="text-center">
            <img
              src="https://thispersondoesnotexist.com"
              alt="Profile Picture"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <p>Welcome, {state.username}!</p>
            <p>Email: {state.email}</p>
            <p>Account created on: {new Date(state.createdAt!).toLocaleDateString()}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}