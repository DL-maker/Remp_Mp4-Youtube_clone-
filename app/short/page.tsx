"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";

// Fonction pour récupérer la liste des vidéos depuis le dossier /public/shorts
async function fetchShortVideoList() {
  try {
    const response = await fetch("/api/list-shorts");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const videoFiles = await response.json();
    return videoFiles.map((name: string) => ({
      src: `/shorts/${name}`,
      title: name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      key: name // Utilisation du nom du fichier comme clé unique
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste des vidéos:", error);
    return [];
  }
}

const ShortPage = () => {
  const [videos, setVideos] = useState<Array<{ src: string; title: string; key: string }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadVideos = async () => {
      const videoList = await fetchShortVideoList();
      setVideos(videoList);
    };

    loadVideos();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.autoplay = true;
    }
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brown-200">
      <Navbar toggleColumn={() => {}} />
      <div className="flex-1 flex flex-col items-center justify-center">
        {videos.length > 0 && (
          <div className="relative w-full h-full flex flex-col items-center">
            <video ref={videoRef} width="270" height="480" controls autoPlay className="rounded-lg">
              <source src={videos[currentIndex].src} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture des vidéos.
            </video>
            <div className="absolute inset-y-0 right-0 flex flex-col justify-center space-y-4 pr-4">
              <button onClick={handlePrev} className="bg-gray-500 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 15l-7-7-7 7" />
                </svg>
              </button>
              <button onClick={handleNext} className="bg-gray-500 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 9l7 7 7-7" />
                </svg>
              </button>
            </div>
          </div>
        )}
        {videos.length === 0 && (
          <div className="text-center">
            <p>Aucune vidéo disponible.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortPage;
