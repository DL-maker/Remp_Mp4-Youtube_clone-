'use client';
import { useEffect, useState } from 'react';

interface ProfileState {
  userId?: string;
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
        setState({ userId: result.userId });
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
          <div>
            <p>Welcome, user {state.userId}!</p>
            {/* Add more user information here */}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}