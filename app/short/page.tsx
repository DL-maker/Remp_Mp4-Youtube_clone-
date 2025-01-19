"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import Image from "next/image";

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
      key: name
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des vidéos:", error);
    return [];
  }
}

function generateRandomName() {
  const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"];
  const lastNames = ["Smith", "Johnson", "Brown", "Taylor", "Anderson", "Lee"];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

const ShortPage = () => {
  const [videos, setVideos] = useState<Array<{ src: string; title: string; key: string }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

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
      videoRef.current.muted = isMuted;
      setIsPlaying(true);
    }
  }, [currentIndex, isMuted]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {videos.length > 0 && (
          <div className="relative w-full max-w-4xl">
            {/* Vidéo */}
            <video
              ref={videoRef}
              className="w-full h-[80vh] object-contain bg-black rounded-lg cursor-pointer"
              autoPlay
              loop
              playsInline
              onClick={togglePlayPause}
            >
              <source src={videos[currentIndex].src} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture des vidéos.
            </video>

            {/* Bouton Play/Pause central */}
            <button
              onClick={togglePlayPause}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-4 rounded-full hover:bg-opacity-70 transition-opacity"
            >
              {!isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : null}
            </button>

            {/* Photo de profil et nom */}
            <div className="absolute bottom-2 left-2 flex items-center space-x-2">
              <Image
                src={"https://thispersondoesnotexist.com"}
                alt="Profile"
                className="rounded-full h-10 w-10 object-cover"
                width={40}
                height={40}
              />
              <span className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                {generateRandomName()}
              </span>
            </div>

            {/* Bouton pour activer/couper le son */}
            <button
              onClick={toggleMute}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              {isMuted ? (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
              )}
            </button>

            {/* Navigation verticale */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col space-y-4">
              <button 
                onClick={handlePrev} 
                className="bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-opacity"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
              <button 
                onClick={handleNext} 
                className="bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-opacity"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
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