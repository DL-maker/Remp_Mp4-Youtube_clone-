'use client';

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineLike, AiFillLike, AiOutlineDislike, AiFillDislike } from "react-icons/ai";
import Navbar from "@/components/navbar";
import Image from 'next/image';
import SubscribeButton from '@/components/SubscribeButton';

interface Video {
  id: string;
  key: string;
  filename: string;
  title: string;
  date: string;
  type: string;
  src: string;
  size: number;
  username: string;
}

async function fetchVideoList() {
  try {
    const response = await fetch("/api/list-videos");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const videos: Video[] = await response.json();
    return videos;
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste des vidéos:", error);
    return [];
  }
}

function VideoPageContent() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

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
        const video = videoList.find((v) => v.key === videoId);
        setSelectedVideo(video || null);
      }
    };

    loadVideos();
  }, []);

  const handleVideoClick = (videoId: string) => {
    router.push(`/video_page?videoId=${videoId}`);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
      if (isDisliked) {
        setIsDisliked(false);
        setDislikes(dislikes - 1);
      }
    }
    setIsLiked(!isLiked);
  };

  const handleDislike = () => {
    if (isDisliked) {
      setDislikes(dislikes - 1);
    } else {
      setDislikes(dislikes + 1);
      if (isLiked) {
        setIsLiked(false);
        setLikes(likes - 1);
      }
    }
    setIsDisliked(!isDisliked);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleColumn={toggleColumn} isOpen={isOpen} isLoggedIn={false} onLogout={function (): void {
        throw new Error("Function not implemented.");
      } } />
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-6">
          {selectedVideo ? (
            <div>
              <video width="100%" controls autoPlay className="rounded-lg shadow-lg mb-6">
                <source src={selectedVideo.src} type="video/mp4" />
                Votre navigateur ne supporte pas la lecture des vidéos.
              </video>
              <h1 className="text-3xl font-bold text-gray-800">{selectedVideo.title}</h1>

              <div className="flex items-center mt-4 mb-6">
                <div className="flex items-center">
                  <Image
                    src="/Photo_profile_light_mode.png"
                    alt="Profile"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full mr-4 cursor-pointer"
                    onClick={() => router.push(`/user/${encodeURIComponent(selectedVideo.username)}`)}
                  />
                  <div>
                    <p 
                      className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
                      onClick={() => router.push(`/user/${encodeURIComponent(selectedVideo.username)}`)}
                    >
                      {selectedVideo.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedVideo.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-4 items-center">
                  <button
                    className="flex items-center text-gray-600 hover:text-blue-600 transition"
                    onClick={handleLike}
                  >
                    {isLiked ? (
                      <AiFillLike className="text-2xl mr-1" />
                    ) : (
                      <AiOutlineLike className="text-2xl mr-1" />
                    )}
                    <span>{likes}</span>
                  </button>

                  <button
                    className="flex items-center text-gray-600 hover:text-red-600 transition"
                    onClick={handleDislike}
                  >
                    {isDisliked ? (
                      <AiFillDislike className="text-2xl mr-1" />
                    ) : (
                      <AiOutlineDislike className="text-2xl mr-1" />
                    )}
                    <span>{dislikes}</span>
                  </button>
                </div>

                <SubscribeButton username={selectedVideo.username} />
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Chargement de la vidéo...</p>
          )}
        </div>

        {/* Section pour les autres vidéos */}
        <div className="w-full md:w-1/3 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Autres vidéos</h2>
          <div className="space-y-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                onClick={() => handleVideoClick(video.key)}
              >
                <video width="100%" className="rounded-lg shadow">
                  <source src={video.src} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture des vidéos.
                </video>
                <div className="mt-2">
                  <p className="text-gray-800 font-medium">{video.title}</p>
                  <p className="text-sm text-gray-600">{video.username}</p>
                </div>
              </div>
            ))}
          </div>
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
