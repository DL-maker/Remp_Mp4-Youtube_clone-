"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

async function fetchVideoList() {
  try {
    const response = await fetch("/api/list-videos");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const videoFiles = await response.json();
    return videoFiles.map((name: string) => ({
      src: `/videos/${name}`,
      title: name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      key: name
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste des vidéos:", error);
    return [];
  }
}

function VideoPageContent() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [videos, setVideos] = useState<Array<{ src: string; title: string; key: string }>>([]);
  const [selectedVideo, setSelectedVideo] = useState<{ src: string; title: string; key: string } | null>(null);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [sessionNumber, setSessionNumber] = useState<string>("");

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const loadVideos = async () => {
      const videoList = await fetchVideoList();
      setVideos(videoList);

      const searchParams = new URLSearchParams(window.location.search);
      const videoId = searchParams.get("videoId");
      if (videoId) {
        const video = videoList.find((v: { key: string }) => v.key === videoId);
        setSelectedVideo(video || null);
      }
    };

    loadVideos();
  }, []);

  const handleRegister = async () => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
      setSessionNumber(data.sessionNumber);
    } else {
      console.error(data.error);
    }
  };

  const handleLogin = async () => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
      setSessionNumber(data.sessionNumber);
    } else {
      console.error(data.error);
    }
  };

  const handleVideoClick = (videoId: string) => {
    router.push(`/video_page?videoId=${videoId}`);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-6">
            {selectedVideo ? (
              <div>
                <video
                  width="100%"
                  controls
                  autoPlay
                  className="rounded-lg shadow-lg mb-6"
                >
                  <source src={selectedVideo.src} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture des vidéos.
                </video>
                <h1 className="text-3xl font-bold text-gray-800">
                  {selectedVideo.title}
                </h1>
                <p>It&apos;s a great video!</p>
              </div>
            ) : (
              <p className="text-gray-600">Chargement de la vidéo...</p>
            )}
          </div>
          <div className="w-full md:w-1/3 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Autres vidéos
            </h2>
            <div className="space-y-4">
              {videos.map((video) => (
                <div
                  key={video.key}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                  onClick={() => handleVideoClick(video.key)}
                >
                  <video width="100%" className="rounded-lg shadow">
                    <source src={video.src} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture des vidéos.
                  </video>
                  <p className="mt-2 text-gray-600 font-medium">
                    {video.title}
                  </p>
                </div>
              ))}
            </div>
            <p>Don&apos;t miss it!</p>
          </div>
        </div>
      </div>
    
  );
}

export default function VideoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoPageContent />
    </Suspense>
  );
}