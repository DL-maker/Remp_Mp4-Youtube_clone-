"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";

async function fetchHistories() {
  // Simule une requête API pour récupérer les historiques
  return [
    {
      id: 1,
      user: "Alice Dupont",
      action: "A regardé la vidéo 'Introduction to React'",
      videoSrc: "/videos/RECYCLER votre VIEUX PC en SERVEUR MULTI-TÂCHES.mp4",
      date: "2025-01-15",
    },
    {
      id: 2,
      user: "Bob Martin",
      action: "A regardé la vidéo 'Next.js Basics'",
      videoSrc: "/videos/Cannot Believe They Built This.mp4",
      date: "2025-01-16",
    },
    {
      id: 3,
      user: "Clara Smith",
      action: "A regardé la vidéo 'Advanced TypeScript'",
      videoSrc: "/videos/L'evenement du numerique en sante Damien Bancal.mp4",
      date: "2025-01-17",
    },
  ];
}

export default function HistoryPage() {
  const [histories, setHistories] = useState<{ id: number; user: string; action: string; videoSrc: string; date: string; }[]>([]); // Initialisation de l'état histories
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  const handleVideoClick = (videoId: string) => {
    router.push(`/video_page?videoId=${videoId}`);
  };

  useEffect(() => {
    const loadHistories = async () => {
      const data = await fetchHistories();
      setHistories(data);
    };
    loadHistories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleColumn={toggleColumn} isOpen={isOpen} isLoggedIn={false} onLogout={function (): void {
        throw new Error("Function not implemented.");
      } } />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Historiques</h1>
        <div className="space-y-6">
          {histories.map((history) => (
            <div 
              key={history.id} 
              className="flex items-center bg-white shadow-md rounded-lg p-4 space-x-4"
            >
              {/* Photo de profil */}
              <Image
                src="https://thispersondoesnotexist.com"
                alt="Profile"
                width={50}
                height={50}
                className="rounded-full h-12 w-12 object-cover"
              />

              {/* Informations de l'utilisateur et de l'historique */}
              <div className="flex-grow">
                <h2 className="text-lg font-bold text-gray-700">{history.user}</h2>
                <p className="text-gray-500 text-sm">{history.action}</p>
                <p className="text-gray-400 text-xs mt-1">{history.date}</p>
              </div>

              {/* Vidéo cliquable */}
              <div className="cursor-pointer">
                <video
                  src={history.videoSrc}
                  width={120}
                  height={80}
                  className="rounded-lg shadow-sm hover:opacity-90"
                  onClick={() => handleVideoClick(history.id.toString())}
                ></video>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
