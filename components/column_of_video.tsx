"use client"
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';


const ColumnOfVideo = () => {   // Pour chaque video existe un id unique
  const [videos, setVideos] = useState<Array<{ id: number }>>([]);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef(null);

  useEffect(() => { // Pour dectecter le changement de la taille de la page
    const loadMoreVideos = () => {
      setLoading(true);
      const newVideos = [...Array(6)].map((_, index) => ({
        id: videos.length + index
      }));
      setVideos(prev => [...prev, ...newVideos]);
      setLoading(false);
    };

    const observer = new IntersectionObserver( // e
      entries => { 
        if (entries[0].isIntersecting && !loading) {
          loadMoreVideos();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, videos.length]);

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {videos.map((video) => (
        <div key={video.id} className='px-2'> 
          <Image 
            className="rounded-lg" 
            src="/Video_indisponible.png" 
            alt="Photo video" 
            width={475} 
            height={650} 
          />
          <p>shif ... shif ...</p>
        </div>
      ))}
      <div ref={observerTarget} className="" />
    </div>
  );
};

export default ColumnOfVideo;