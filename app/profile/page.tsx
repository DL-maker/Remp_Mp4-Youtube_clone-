'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProfileState {
  userId?: string;
  username?: string;
  email?: string;
  createdAt?: string;
  stats?: {
    Video: number;
    likes: number;
    Abonner: number;
  };
  error?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [state, setState] = useState<ProfileState>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch('/api/session');
      const result = await response.json();

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (response.status !== 200) {
        setState({ error: result.error });
      } else {
        setState({
          userId: result.userId,
          username: result.username,
          email: result.email,
          createdAt: result.createdAt,
          stats: { Video: 0, likes: 0, Abonner: 0 }
        });
      }
    };

    fetchProfile();
  }, [router]);

  if (state.error) {
    return <div className="text-red-500 text-center p-4">{state.error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {!state.userId ? (
          <div className="text-gray-500 text-center">Loading profile...</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
                  <img
                    src="https://thispersondoesnotexist.com"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">{state.username}</h1>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      {isEditing ? 'Close' : 'Edit Profile'}
                    </button>
                  </div>
                  <p className="text-gray-600 mb-2">{state.email}</p>
                  <p className="text-sm text-gray-500">
                    Joined {new Date(state.createdAt!).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-xl font-bold text-gray-900">0</div>
                  <div className="text-gray-600">Video</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-xl font-bold text-gray-900">0</div>
                  <div className="text-gray-600">Likes</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-xl font-bold text-gray-900">0</div>
                  <div className="text-gray-600">Abonner</div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg"
                      value={state.username}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full p-2 border rounded-lg"
                      value={state.email}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}