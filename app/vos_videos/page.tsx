'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; // Importe le routeur

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Navbar from "@/components/navbar";

function generateRandomData() {
  return Array.from({ length: 7 }, () => ({
    date: `Day ${Math.floor(Math.random() * 30) + 1}`,
    abonnés: Math.floor(Math.random() * 100),
    vues: Math.floor(Math.random() * 100),
    likes: Math.floor(Math.random() * 100),
    dislikes: Math.floor(Math.random() * 100),
  }));
}

const VosVideosPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(generateRandomData());
  const [videos, setVideos] = useState<
    Array<{ id: number; filename: string; date: string; type: string; url: string; size?: number }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialise le routeur

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const checkSessionAndFetchVideos = async () => {
      const sessionResponse = await fetch('/api/session');
      if (sessionResponse.status === 401) {
        router.push('/login'); // Redirige vers la page de login si la session n'est pas valide
        return;
      } else if (!sessionResponse.ok) {
        setError('Erreur lors de la vérification de la session.');
        setLoading(false);
        return;
      }

      // La session est valide, on peut charger les vidéos de l'utilisateur
      try {
        const videosResponse = await fetch("/api/list-videos");
        if (!videosResponse.ok) {
          const errorData = await videosResponse.json();
          throw new Error(errorData.error || `Erreur HTTP: ${videosResponse.status}`);
        }
        const data = await videosResponse.json();
        
        // Si nous avons des données, on les affiche
        if (Array.isArray(data) && data.length > 0) {
          setVideos(data);
        } else {
          // Si pas de vidéos, on affiche un message spécifique
          setError("Aucune vidéo trouvée. Uploadez votre première vidéo!");
        }
      } catch (err) {
        console.error("Erreur lors du chargement des vidéos:", err);
        setError(err instanceof Error ? err.message : "Une erreur inconnue s'est produite");
      } finally {
        setLoading(false);
      }
    };

    checkSessionAndFetchVideos();
  }, [router]); // Le router dans les dépendances pour réagir aux changements de route

  if (loading) {
    return (
      <div>
        <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
        <div className="text-center text-gray-600">Chargement de vos vidéos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
        <div className="text-center text-red-500">Erreur : {error}</div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-100 min-h-screen">
      <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Vos Vidéos</h1>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="abonnés" stroke="#7c3aed" />
          <Line type="monotone" dataKey="vues" stroke="#3b82f6" />
          <Line type="monotone" dataKey="likes" stroke="#10b981" />
          <Line type="monotone" dataKey="dislikes" stroke="#ef4444" />
        </LineChart>
      </ResponsiveContainer>

      <table className="mt-8 bg-white rounded-lg shadow-md w-full text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-6 py-3">#</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Vidéo</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video.id} className="border-b">
              <td className="px-6 py-4">{video.id}</td>
              <td className="px-6 py-4">{video.date}</td>
              <td className="px-6 py-4">{video.type}</td>
              <td className="px-6 py-4">
                <video width="200" controls className="rounded-lg">
                  <source src={video.url} type="video/mp4" />
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