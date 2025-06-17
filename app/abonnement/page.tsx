"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Image from "next/image";

async function fetchSubscriptions() {
  try {
    const response = await fetch('/api/subscriptions');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.subscriptions || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des abonnements:', error);
    return [];
  }
}

export default function SubscriptionsPage() {
  const router = useRouter();
  interface Subscriber {
    name: string;
    videoKey: string;
    videoTitle: string;
  }

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]); // Initialisation de l'état subscribers
  const [isOpen, setIsOpen] = useState(false);

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const loadSubscriptions = async () => {
      const data = await fetchSubscriptions();
      setSubscribers(data);
    };
    loadSubscriptions();
  }, []);
  const handleVideoClick = (videoKey: string) => {
    if (videoKey) {
      // Extraire uniquement le nom du fichier vidéo
      const fileName = videoKey.split('/').pop() || '';
      router.push(`/video_page?videoId=${encodeURIComponent(fileName)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">      <Navbar toggleColumn={toggleColumn} isOpen={isOpen} isLoggedIn={true} onLogout={() => {
        // Rediriger vers la page de connexion
        router.push('/login');
      }} />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Mes Abonnements</h1>        <div className="space-y-4">
          {subscribers.length > 0 ? (
            subscribers.map((subscriber) => (
              <div 
                key={subscriber.videoKey || subscriber.name} 
                className="flex items-center space-x-4 bg-white shadow-md rounded-lg p-4"
              >
                {/* Photo de profil */}
                <Image
                  src={"https://thispersondoesnotexist.com"}
                  alt={`Photo de ${subscriber.name}`}
                  width={40}
                  height={40}
                  className="rounded-full h-10 w-10 object-cover"
                />
                {/* Nom et vidéo */}
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-700">{subscriber.name}</h2>
                  <p className="text-gray-500 text-sm">{subscriber.videoTitle}</p>
                </div>
                {/* Vidéo */}
                {subscriber.videoKey ? (
                  <div 
                    className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                    onClick={() => handleVideoClick(subscriber.videoKey)}
                  >
                    <video 
                      src={`/api/video-stream?key=${encodeURIComponent(subscriber.videoKey)}`}
                      width="200" 
                      className="rounded-lg shadow-md"
                      preload="metadata"
                      muted
                      playsInline
                      onMouseEnter={(e) => {
                        const videoElement = e.currentTarget;
                        if (videoElement.paused) {
                          videoElement.play()
                            .catch(err => {
                              console.log('Lecture impossible:', err);
                            });
                        }
                      }}
                      onMouseLeave={(e) => {
                        const videoElement = e.currentTarget;
                        if (!videoElement.paused) {
                          videoElement.pause();
                          videoElement.currentTime = 0;
                        }
                      }}
                    >
                      Votre navigateur ne supporte pas la lecture des vidéos.
                    </video>
                  </div>
                ) : (
                  <div className="w-[200px] h-[112px] bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Aucune vidéo</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun abonnement</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Vous n&apos;êtes abonné à aucune chaîne pour le moment.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Découvrir des chaînes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}