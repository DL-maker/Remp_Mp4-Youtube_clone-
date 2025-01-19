"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import Image from "next/image";
import { ThumbsUp, ThumbsDown, UserPlus } from "lucide-react"; // Changed Heart to ThumbsUp

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
      key: name,
      likes: Math.floor(Math.random() * 10000),
      isLiked: false,
      isDisliked: false,
      isSubscribed: false
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
  const [videos, setVideos] = useState<Array<any>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isDislikeAnimating, setIsDislikeAnimating] = useState(false);
  const [isSubscribeAnimating, setIsSubscribeAnimating] = useState(false);
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

  const handleLike = () => {
    setIsLikeAnimating(true);
    setTimeout(() => setIsLikeAnimating(false), 500); // Reset animation after 500ms
    
    setVideos(prevVideos => {
      const newVideos = [...prevVideos];
      const video = newVideos[currentIndex];
      if (video.isDisliked) {
        video.isDisliked = false;
      }
      video.isLiked = !video.isLiked;
      video.likes = video.isLiked ? video.likes + 1 : video.likes - 1;
      return newVideos;
    });
  };

  const handleDislike = () => {
    setIsDislikeAnimating(true);
    setTimeout(() => setIsDislikeAnimating(false), 500);

    setVideos(prevVideos => {
      const newVideos = [...prevVideos];
      const video = newVideos[currentIndex];
      if (video.isLiked) {
        video.isLiked = false;
        video.likes -= 1;
      }
      video.isDisliked = !video.isDisliked;
      return newVideos;
    });
  };

  const handleSubscribe = () => {
    setIsSubscribeAnimating(true);
    setTimeout(() => setIsSubscribeAnimating(false), 800);

    setVideos(prevVideos => {
      const newVideos = [...prevVideos];
      const video = newVideos[currentIndex];
      video.isSubscribed = !video.isSubscribed;
      return newVideos;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <style jsx global>{`
        @keyframes likeAnimation {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.5);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes likePopAnimation {
          0% {
            opacity: 0;
            transform: translateY(0px) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translateY(-20px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px) scale(1);
          }
        }

        @keyframes buttonAnimation {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }

        @keyframes popAnimation {
          0% {
            opacity: 0;
            transform: translateY(0px) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translateY(-20px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px) scale(1);
          }
        }

        @keyframes subscribeAnimation {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.2) rotate(-5deg); }
          75% { transform: scale(1.2) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        @keyframes textPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .like-animation {
          animation: likeAnimation 0.5s ease;
        }

        .like-pop {
          position: absolute;
          pointer-events: none;
          animation: likePopAnimation 0.5s ease forwards;
        }

        .button-animation {
          animation: buttonAnimation 0.5s ease;
        }

        .pop-animation {
          position: absolute;
          pointer-events: none;
          animation: popAnimation 0.5s ease forwards;
        }

        .subscribe-animation {
          animation: subscribeAnimation 0.8s ease;
        }

        .text-pulse {
          animation: textPulse 0.5s ease;
        }
      `}</style>

      <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {videos.length > 0 && (
          <div className="relative w-full max-w-4xl">
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

            {/* Button Play/Pause */}
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

            {/* Social interaction buttons */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-6">
              {/* Like Button */}
              <div className="relative flex flex-col items-center">
                <button 
                  onClick={handleLike}
                  className={`p-3 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all relative overflow-visible ${
                    videos[currentIndex]?.isLiked ? 'text-blue-500' : 'text-white'
                  }`}
                >
                  <ThumbsUp 
                    size={28} 
                    fill={videos[currentIndex]?.isLiked ? "currentColor" : "none"}
                    className={isLikeAnimating ? 'like-animation' : ''}
                  />
                  {isLikeAnimating && videos[currentIndex]?.isLiked && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <ThumbsUp 
                        size={28} 
                        className="like-pop text-blue-500"
                        fill="currentColor"
                      />
                    </div>
                  )}
                </button>
                <span className={`text-white text-sm mt-1 bg-black bg-opacity-50 px-2 py-1 rounded transition-all duration-300 ${
                  isLikeAnimating ? 'scale-110' : 'scale-100'
                }`}>
                  {videos[currentIndex]?.likes?.toLocaleString()}
                </span>
              </div>

              {/* Dislike Button */}
              <div className="relative flex flex-col items-center">
                <button 
                  onClick={handleDislike}
                  className={`p-3 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all ${
                    videos[currentIndex]?.isDisliked ? 'text-blue-500' : 'text-white'
                  }`}
                >
                  <ThumbsDown 
                    size={28} 
                    fill={videos[currentIndex]?.isDisliked ? "currentColor" : "none"}
                    className={isDislikeAnimating ? 'button-animation' : ''}
                  />
                  {isDislikeAnimating && videos[currentIndex]?.isDisliked && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <ThumbsDown size={28} className="pop-animation text-blue-500" fill="currentColor" />
                    </div>
                  )}
                </button>
              </div>

              {/* Subscribe Button */}
              <div className="relative flex flex-col items-center">
                <button 
                  onClick={handleSubscribe}
                  className={`p-3 rounded-full ${
                    videos[currentIndex]?.isSubscribed 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-white hover:bg-gray-100'
                  } transition-all ${isSubscribeAnimating ? 'subscribe-animation' : ''}`}
                >
                  <UserPlus 
                    size={28} 
                    className={videos[currentIndex]?.isSubscribed ? 'text-white' : 'text-gray-900'}
                  />
                </button>
                <span className={`text-white text-sm mt-1 bg-black bg-opacity-50 px-2 py-1 rounded ${
                  isSubscribeAnimating ? 'text-pulse' : ''
                }`}>
                  {videos[currentIndex]?.isSubscribed ? 'Abonné' : 'Sabonner'}
                </span>
              </div>
            </div>

            {/* Profile photo and name */}
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

            {/* Mute button */}
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

            {/* Navigation buttons */}
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