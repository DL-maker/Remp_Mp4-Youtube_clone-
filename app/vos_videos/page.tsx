// app/vos_videos/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const generateRandomData = () => {
  return Array.from({ length: 7 }, () => ({
    date: `Day ${Math.floor(Math.random() * 30) + 1}`,
    abonnés: Math.floor(Math.random() * 100),
    vues: Math.floor(Math.random() * 100),
    likes: Math.floor(Math.random() * 100),
    dislikes: Math.floor(Math.random() * 100),
  }));
};

const VosVideosPage = () => {
  const [data, setData] = useState(generateRandomData());
  const [videos, setVideos] = useState<Array<{
    id: number;
    date: string;
    type: string;
    url: string;
  }>>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoType, setVideoType] = useState('normale');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVideos(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier si c'est une vidéo
      if (!file.type.includes('video/')) {
        return;
      }
      setVideoFile(file);
    }
  };

  const handlePublish = async () => {
    if (!videoFile) {
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('type', videoType);

    try {
      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${await response.text()}`);
      }

      const result = await response.json();

      setVideos(prevVideos => [...prevVideos, {
        id: prevVideos.length + 1,
        date: new Date().toLocaleDateString(),
        type: videoType,
        url: result.url
      }]);

      // Réinitialiser le formulaire
      setVideoFile(null);
      setVideoType('normale');
      setData(generateRandomData());
      
      if (document.getElementById('videoInput') instanceof HTMLInputElement) {
        (document.getElementById('videoInput') as HTMLInputElement).value = '';
      }

    } catch (err) {
      console.error('Erreur lors du téléchargement:', err);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Tableau de Bord</h1>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="abonnés" stroke="violet" />
          <Line type="monotone" dataKey="vues" stroke="blue" />
          <Line type="monotone" dataKey="likes" stroke="green" />
          <Line type="monotone" dataKey="dislikes" stroke="red" />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Importer une vidéo
          </label>
          <input
            id="videoInput"
            type="file"
            accept="video/mp4,video/webm"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Type de vidéo
          </label>
          <select
            value={videoType}
            onChange={(e) => setVideoType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="normale">Normale</option>
            <option value="short">Short</option>
          </select>
        </div>

        <button
          onClick={handlePublish}
          disabled={isUploading || !videoFile}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isUploading ? 'Téléchargement...' : 'Publier la vidéo'}
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200 mt-6">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vidéo</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {videos.map(video => (
            <tr key={video.id}>
              <td className="px-6 py-4 whitespace-nowrap">{video.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{video.date}</td>
              <td className="px-6 py-4 whitespace-nowrap">{video.type}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <video width="200" controls>
                  <source src={video.url} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default VosVideosPage;