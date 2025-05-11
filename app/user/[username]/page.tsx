'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/navbar';

interface UserProfile {
  id: string;
  username: string;
  createdAt: string;
  videos: Array<{
    id: string;
    key: string;
    title: string;
    src: string;
    date: string;
  }>;
}

export default function UserProfilePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Récupérer les informations de l'utilisateur
        const userResponse = await fetch(`/api/users/${encodeURIComponent(username)}`);
        
        if (userResponse.status === 403) {
          setError('Ce profil est privé');
          setIsLoading(false);
          return;
        }
        
        if (userResponse.status === 404) {
          setError('Utilisateur non trouvé');
          setIsLoading(false);
          return;
        }
        
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(errorData.error || 'Erreur lors du chargement du profil');
        }
        
        const userData = await userResponse.json();

        // Récupérer les vidéos de l'utilisateur
        const videosResponse = await fetch(`/api/users/${encodeURIComponent(username)}/videos`);
        if (!videosResponse.ok) {
          const errorData = await videosResponse.json();
          throw new Error(errorData.error || 'Erreur lors du chargement des vidéos');
        }
        const videosData = await videosResponse.json();

        // Combiner les données
        setProfile({
          ...userData,
          videos: videosData.videos
        });
      } catch (err) {
        const error = err as Error;
        setError(error.message || 'Une erreur est survenue lors du chargement du profil');
        console.error('Erreur:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
        <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
          <div className="bg-red-100 text-red-800 p-6 rounded-lg text-center max-w-md">
            <h2 className="text-xl font-semibold mb-2">Profil non accessible</h2>
            <p>{error}</p>
            {error === 'Ce profil est privé' && (
              <p className="mt-2 text-sm text-red-600">
                L&apos;utilisateur a choisi de rendre son profil privé.
              </p>
            )}
          </div>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
                <Image
                  src="/Photo_profile_light_mode.png"
                  alt={`Photo de profil de ${profile?.username}`}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">{profile?.username}</h1>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                    S&apos;abonner
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Membre depuis {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '...'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-xl font-bold text-gray-900">{profile?.videos?.length || 0}</div>
                <div className="text-gray-600">Vidéos</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-xl font-bold text-gray-900">0</div>
                <div className="text-gray-600">Abonnés</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-xl font-bold text-gray-900">0</div>
                <div className="text-gray-600">Likes</div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vidéos publiées</h2>
          {profile?.videos && profile.videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.videos.map((video) => (
                <div
                  key={video.id}
                  className="cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/video_page?videoId=${encodeURIComponent(video.key)}`)}
                >
                  <div className="aspect-video relative">
                    <video
                      className="w-full h-full object-cover"
                      src={video.src}
                      preload="metadata"
                      muted
                      playsInline
                      onMouseEnter={(e) => {
                        const videoElement = e.currentTarget;
                        if (videoElement.paused) {
                          videoElement.play()
                            .catch(err => {
                              // Si la vidéo ne peut pas être lue, on ne fait rien
                              console.log('Lecture impossible:', err);
                            });
                        }
                      }}
                      onMouseLeave={(e) => {
                        const videoElement = e.currentTarget;
                        if (!videoElement.paused) {
                          videoElement.pause();
                        }
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-gray-500">{new Date(video.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Aucune vidéo publiée
            </div>
          )}
        </div>
      </div>
    </div>
  );
}