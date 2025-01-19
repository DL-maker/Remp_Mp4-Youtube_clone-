'use client';

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from 'react';
import Navbar from "@/components/navbar";
// Exemple de vidéos likées (Remplacez par des données réelles ou connectez une API)
const likedVideos = [
  {
    src: "/videos/Cannot Believe They Built This.mp4",
    title: "Amazing Landscape",
    key: "example1",
  },
  {
    src: "/videos/RECYCLER votre VIEUX PC en SERVEUR MULTI-TÂCHES.mp4",
    title: "Incredible Science",
    key: "example2",
  },
  {
    src: "/videos/ThePour.mp4",
    title: "Nature Wonders",
    key: "example3",
  },
];

const DisLikedVideosPage = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="p-4">
        <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
      <h1 className="text-2xl font-bold mb-4 r">Vidéos Dis-Likées</h1>
      
      {likedVideos.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>Aucune vidéo n&apos;a été likée pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {likedVideos.map((video) => (
            <div
              key={video.key}
              className="group relative cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              onClick={() => router.push(`/video_page?videoId=${video.key}`)}
              role="button"
              tabIndex={0}
              aria-label={`Lire la vidéo ${video.title}`}
              onKeyDown={(e) =>
                e.key === "Enter" && router.push(`/video_page?videoId=${video.key}`)
              }
            >
              {/* Vidéo */}
              <video
                width="100%"
                className="rounded-lg group-hover:opacity-75 transition-opacity aspect-video"
                controls={false}
                muted
                loop
                onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()}
              >
                <source src={video.src} type="video/mp4" />
                Votre navigateur ne supporte pas la lecture des vidéos.
              </video>

              {/* Profil en dessous */}
              <div className="flex items-center mt-4 space-x-2">
                <Image
                  src={"https://thispersondoesnotexist.com"}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full h-10 w-10 object-cover cursor-pointer"
                />
                <span className="text-sm font-medium">{video.title}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisLikedVideosPage;
