"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Image from "next/image";

async function fetchSubscribers() {
  // Simule une requête API pour obtenir les abonnés
  return [
    { 
      name: "Alice Dupont", 
      videoKey: "L'evenement du numerique en sante Damien Bancal.mp4", 
      videoTitle: "Introduction to React" 
    },
    { 
      name: "Bob Martin", 
      videoKey: "RECYCLER votre VIEUX PC en SERVEUR MULTI-TÂCHES.mp4", 
      videoTitle: "Next.js Basics" 
    },
    { 
      name: "Clara Smith", 
      videoKey: "ThePour.mp4", 
      videoTitle: "Advanced TypeScript" 
    },
  ];
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
    const loadSubscribers = async () => {  // Fonction asynchrone pour charger les abonnés
      const data = await fetchSubscribers(); // Appel de la fonction fetchSubscribers
      setSubscribers(data); // Mise à jour de l'état subscribers avec les données obtenues
    };
    loadSubscribers();
  }, []);

  const handleVideoClick = (videoKey: string) => { // Fonction pour gérer le clic sur une vidéo
    router.push(`/video_page?videoId=${videoKey}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleColumn={toggleColumn} isOpen={isOpen} isLoggedIn={false} onLogout={function (): void {
        throw new Error("Function not implemented.");
      } } />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Liste des Abonnés</h1>
        <div className="space-y-4">
          {subscribers.map((subscriber) => (
            <div 
              key={subscriber.videoKey} 
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
              <div 
                className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                onClick={() => handleVideoClick(subscriber.videoKey)}
              >
                <video 
                  src={`/videos/${subscriber.videoKey}`} 
                  width="200" 
                  className="rounded-lg shadow-md"
                >
                  Votre navigateur ne supporte pas la lecture des vidéos.
                </video>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}