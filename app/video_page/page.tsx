"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();

  const [videos, setVideos] = useState<Array<{ src: string; title: string; key: string }>>([]);
  const [selectedVideo, setSelectedVideo] = useState<{ src: string; title: string; key: string } | null>(null);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [sessionNumber, setSessionNumber] = useState<string>("");

  useEffect(() => {
    const loadVideos = async () => {
      const videoList = await fetchVideoList();
      setVideos(videoList);

      const searchParams = new URLSearchParams(window.location.search);
      const videoId = searchParams.get('videoId');
      if (videoId) {
        const video = videoList.find((v: { key: string }) => v.key === videoId);
        setSelectedVideo(video || null);
      }
    };

    loadVideos();
  }, []);

  function toggleColumn(): void {
    throw new Error("Function not implemented.");
  }

  const handleRegister = async () => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      setSessionNumber(data.sessionNumber);
    } else {
      console.error(data.error);
    }
  };

  const handleLogin = async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      setSessionNumber(data.sessionNumber);
    } else {
      console.error(data.error);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <Navbar toggleColumn={toggleColumn} />
        <div className="flex">
          <div className="flex-1 p-4">
            {selectedVideo ? (
              <div>
                <video width="100%" controls autoPlay className="rounded-lg">
                  <source src={selectedVideo.src} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture des vidéos.
                </video>
                <h1 className="text-2xl font-bold mt-4">{selectedVideo.title}</h1>
              </div>
            ) : (
              <p>Chargement de la vidéo...</p>
            )}
          </div>
          <div className="w-1/3 p-4">
            <h2 className="text-xl font-bold mb-4">Autres vidéos</h2>
            <div className="space-y-4">
              {videos.map((video) => (
                <div key={video.key} className="cursor-pointer" onClick={() => router.push(`/video_page?videoId=${video.key}`)}>
                  <video width="100%" className="rounded-lg">
                    <source src={video.src} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture des vidéos.
                  </video>
                  <p className="mt-2">{video.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleRegister}>Register</button>
        </div>
        <div className="mt-4">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
        {sessionNumber && <p>Your session number: {sessionNumber}</p>}
      </div>
    </Suspense>
  );
}

export default function VideoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoPageContent />
    </Suspense>
  );
}
