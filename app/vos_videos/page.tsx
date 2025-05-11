'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
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

interface AccessUser {
  username: string;
  email: string;
}

interface Access {
  id: string;
  createdAt: string;
  receiver: AccessUser;
}

interface ReceivedAccess {
  id: string;
  createdAt: string;
  granter: AccessUser;
}

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
  const [grantedAccesses, setGrantedAccesses] = useState<Access[]>([]);
  const [receivedAccesses, setReceivedAccesses] = useState<ReceivedAccess[]>([]);
  const router = useRouter();

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Vérifier d'abord la session
        const sessionResponse = await fetch('/api/session');
        if (sessionResponse.status === 401) {
          router.push('/login'); // Redirection vers la page de connexion
          return;
        }

        // Si la session est valide, charger les vidéos
        const videosResponse = await fetch("/api/list-videos?userOnly=true");
        if (!videosResponse.ok) {
          throw new Error(await videosResponse.text());
        }

        const data = await videosResponse.json();
        if (Array.isArray(data) && data.length > 0) {
          setVideos(data.map((video, index) => ({
            id: index + 1,
            filename: video.title,
            date: new Date(video.date).toLocaleDateString(),
            type: video.type,
            url: video.src
          })));
        } else {
          setError("Aucune vidéo trouvée. Uploadez votre première vidéo!");
        }

        // Charger les accès
        const accessResponse = await fetch('/api/user-settings/access');
        if (accessResponse.ok) {
          const accessData = await accessResponse.json();
          setGrantedAccesses(accessData.grantedAccesses);
          setReceivedAccesses(accessData.receivedAccesses);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError(err instanceof Error ? err.message : "Une erreur inconnue s'est produite");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleRevokeAccess = async (accessId: string) => {
    try {
      const response = await fetch('/api/user-settings/access', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessId })
      });

      if (response.ok) {
        // Mettre à jour la liste des accès
        setGrantedAccesses(prev => prev.filter(access => access.id !== accessId));
        alert('Accès révoqué avec succès');
      } else {
        alert('Erreur lors de la révocation de l\'accès');
      }
    } catch (error) {
      console.error('Erreur lors de la révocation de l\'accès:', error);
      alert('Erreur lors de la révocation de l\'accès');
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
        <div className="text-center text-gray-600">Chargement...</div>
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
    <div className="bg-gray-100 min-h-screen">
      <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Vos Vidéos</h1>

        {/* Sections d'accès */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Accepting People */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Accepting People</h2>
            <div className="space-y-4">
              {grantedAccesses.length > 0 ? (
                grantedAccesses.map((access) => (
                  <div key={access.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{access.receiver.username}</p>
                      <p className="text-sm text-gray-500">{access.receiver.email}</p>
                      <p className="text-xs text-gray-400">
                        Accès accordé le {new Date(access.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRevokeAccess(access.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Révoquer
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">Aucun accès accordé</p>
              )}
            </div>
          </div>

          {/* Access People */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Access People</h2>
            <div className="space-y-4">
              {receivedAccesses.length > 0 ? (
                receivedAccesses.map((access) => (
                  <div key={access.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-800">{access.granter.username}</p>
                    <p className="text-sm text-gray-500">{access.granter.email}</p>
                    <p className="text-xs text-gray-400">
                      Accès reçu le {new Date(access.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">Aucun accès reçu</p>
              )}
            </div>
          </div>
        </div>

        {/* Graphique et tableau existants */}
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
    </div>
  );
};

export default VosVideosPage;