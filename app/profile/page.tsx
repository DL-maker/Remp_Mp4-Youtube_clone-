'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface ProfileData {
  bio: string;
  connectedAccounts: any;
  username: string;
  tag: string;
  avatar: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  customStatus?: string;
  badges: string[];
  roles: {
    name: string;
    color: string;
  }[];
}

interface AuthUser {
  id: string;
  accessToken: string;
}

const ProfileStatus = ({ status }: { status: ProfileData['status'] }) => {
  const statusColors = {
    online: 'bg-emerald-500',
    idle: 'bg-amber-400',
    dnd: 'bg-rose-500',
    offline: 'bg-gray-400'
  };

  return (
    <div className={`w-4 h-4 rounded-full ${statusColors[status]} absolute bottom-0 right-0 border-2 border-gray-800 shadow-sm`} />
  );
};

const Badge = ({ name }: { name: string }) => (
  <div className="px-3 py-1 bg-gray-700 rounded-full shadow-sm border border-gray-600 hover:shadow-md transition-shadow">
    <span className="text-xs text-gray-200 font-medium">{name}</span>
  </div>
);

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // Récupérer le token d'accès du localStorage ou d'un gestionnaire d'état
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Non authentifié');
      }

      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil');
      }

      const profileData = await response.json();
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-100">Chargement du profil...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-rose-500">
          {error}
          <button 
            onClick={() => window.location.href = '/login'}
            className="mt-4 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-100">Aucun profil trouvé</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-6">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-700">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar with Status */}
            <div className="relative">
              <div className="rounded-full overflow-hidden shadow-md">
                <Image
                  src={profile.avatar}
                  alt={profile.username}
                  width={100}
                  height={100}
                  className="rounded-full hover:scale-105 transition-transform"
                />
              </div>
              <ProfileStatus status={profile.status} />
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-100">{profile.username}</h1>
                  <span className="text-gray-400 text-lg">{profile.tag}</span>
                </div>
                {profile.customStatus && (
                  <p className="text-gray-400 text-sm">{profile.customStatus}</p>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {profile.badges.map((badge, index) => (
                  <Badge key={index} name={badge} />
                ))}
              </div>

              {/* Roles */}
              <div className="flex flex-wrap gap-2">
                {profile.roles.map((role, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                    style={{ 
                      backgroundColor: `${role.color}20`, 
                      color: role.color,
                      borderWidth: '1px',
                      borderColor: `${role.color}40`
                    }}
                  >
                    {role.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* About Me Section */}
        <div className="bg-gray-800 rounded-2xl p-8 mt-6 shadow-lg border border-gray-700">
          <h2 className="text-xl font-bold text-gray-100 mb-4">À propos de moi</h2>
          <p className="text-gray-300 leading-relaxed">
            {profile.bio || "Aucune bio n'a été ajoutée."}
          </p>
        </div>

        {/* Connected Accounts */}
        <div className="bg-gray-800 rounded-2xl p-8 mt-6 shadow-lg border border-gray-700">
          <h2 className="text-xl font-bold text-gray-100 mb-6">Comptes connectés</h2>
          <div className="space-y-4">
            {profile.connectedAccounts?.map((account: { icon: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; connectedSince: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: React.Key | null | undefined) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-700 transition-colors">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-2xl">{account.icon}</span>
                </div>
                <div>
                  <span className="text-gray-200 font-medium">{account.name}</span>
                  <p className="text-gray-400 text-sm">Connecté depuis {account.connectedSince}</p>
                </div>
              </div>
            )) || (
              <div className="text-gray-400">Aucun compte connecté</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}