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
  AreaChart,
  Area
} from "recharts";
import Navbar from "@/components/navbar";
import Image from "next/image";
import videoPlaceholder from '@/public/video-placeholder.jpg'; // Ajoutez cette image à votre dossier public

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
  return Array.from({ length: 7 }, (_, i) => ({
    date: `Jour ${i + 1}`,
    abonnés: Math.floor(Math.random() * 100) + 20,
    vues: Math.floor(Math.random() * 500) + 100,
    likes: Math.floor(Math.random() * 100) + 10,
    dislikes: Math.floor(Math.random() * 20),
  }));
}

const VosVideosPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data] = useState(generateRandomData());
  const [videos, setVideos] = useState<
    Array<{ id: number; filename: string; date: string; type: string; url: string; size?: number; thumbnail?: string; views?: number; likes?: number }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [grantedAccesses, setGrantedAccesses] = useState<Access[]>([]);
  const [receivedAccesses, setReceivedAccesses] = useState<ReceivedAccess[]>([]);
  const [activeTab, setActiveTab] = useState<'videos' | 'analytics' | 'permissions'>('videos');
  const [searchTerm, setSearchTerm] = useState('');
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
          router.push('/login');
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
            filename: video.title || `Video ${index + 1}`,
            date: new Date(video.date).toLocaleDateString(),
            type: video.type || 'Standard',
            url: video.src,
            views: Math.floor(Math.random() * 1000) + 50,
            likes: Math.floor(Math.random() * 200) + 10
          })));
        } else {
          setError("Aucune vidéo trouvée. Uploadez votre première vidéo!");
        }

        // Charger les accès
        const accessResponse = await fetch('/api/user-settings/access');
        if (accessResponse.ok) {
          const accessData = await accessResponse.json();
          setGrantedAccesses(accessData.grantedAccesses || []);
          setReceivedAccesses(accessData.receivedAccesses || []);
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

  const filteredVideos = videos.filter(video => 
    video.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTotalViews = () => {
    return videos.reduce((sum, video) => sum + (video.views || 0), 0);
  };

  const getTotalLikes = () => {
    return videos.reduce((sum, video) => sum + (video.likes || 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
        <Navbar toggleColumn={toggleColumn} isOpen={isOpen} isLoggedIn={true} onLogout={() => router.push('/login')} />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <Navbar toggleColumn={toggleColumn} isOpen={isOpen} isLoggedIn={true} onLogout={() => router.push('/login')} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Mes Vidéos & Statistiques
            </span>
          </h1>
          <button 
            onClick={() => {
              try {
                // Préférer useRouter().push() à window.location pour une navigation côté client
                router.push('/profile');
              } catch (error) {
                console.error("Erreur de redirection:", error);
                // Fallback en cas d'erreur
                window.location.href = '/profile';
              }
            }} 
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter une vidéo
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 transform transition-transform hover:scale-105 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Videos</p>
                <p className="text-3xl font-bold text-gray-800">{videos.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-green-600 flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {videos.length > 0 ? '+1 cette semaine' : 'Aucune vidéo'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500 transform transition-transform hover:scale-105 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Vues Totales</p>
                <p className="text-3xl font-bold text-gray-800">{getTotalViews().toLocaleString()}</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-green-600 flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                +{Math.floor(getTotalViews() * 0.12).toLocaleString()} cette semaine
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 transform transition-transform hover:scale-105 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">J'aime Totaux</p>
                <p className="text-3xl font-bold text-gray-800">{getTotalLikes().toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-green-600 flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                +{Math.floor(getTotalLikes() * 0.08).toLocaleString()} cette semaine
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-4 border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('videos')}
              className={`px-3 py-2 font-medium text-sm rounded-t-lg ${
                activeTab === 'videos' 
                  ? 'border-b-2 border-indigo-500 text-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mes Vidéos
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-2 font-medium text-sm rounded-t-lg ${
                activeTab === 'analytics' 
                  ? 'border-b-2 border-indigo-500 text-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analyses & Statistiques
            </button>
            <button 
              onClick={() => setActiveTab('permissions')}
              className={`px-3 py-2 font-medium text-sm rounded-t-lg ${
                activeTab === 'permissions' 
                  ? 'border-b-2 border-indigo-500 text-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Permissions d'Accès
            </button>
          </nav>
        </div>

        {activeTab === 'videos' && (
          <>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="search"
                  id="search"
                  className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Rechercher une vidéo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredVideos.length > 0 ? (
                filteredVideos.map((video) => (
                  <div key={video.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="relative pt-[56.25%]">
                      {video.thumbnail ? (
                        <video 
                          className="absolute inset-0 w-full h-full object-cover" 
                          poster={video.thumbnail}
                        >
                          <source src={video.url} type="video/mp4" />
                        </video>
                      ) : (
                        <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-4 w-full">
                          <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                            Lire la vidéo
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">{video.filename}</h3>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>{video.date}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {video.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-gray-500 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {video.views?.toLocaleString() || '0'} vues
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          {video.likes?.toLocaleString() || '0'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune vidéo trouvée</h3>
                  <p className="mt-1 text-sm text-gray-500">Commencez par importer votre première vidéo.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => router.push('/profile')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Ajouter une vidéo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistiques d'audience</h2>
            
            {/* Graphiques */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-md font-medium text-gray-700 mb-4">Évolution des statistiques</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" stroke="#4b5563" />
                    <YAxis stroke="#4b5563" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        border: 'none'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="abonnés" stroke="#7c3aed" strokeWidth={2} dot={{ stroke: '#7c3aed', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="vues" stroke="#3b82f6" strokeWidth={2} dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="likes" stroke="#10b981" strokeWidth={2} dot={{ stroke: '#10b981', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="dislikes" stroke="#ef4444" strokeWidth={2} dot={{ stroke: '#ef4444', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-md font-medium text-gray-700 mb-4">Tendance des vues</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" stroke="#4b5563" />
                    <YAxis stroke="#4b5563" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        border: 'none'
                      }}
                    />
                    <Area type="monotone" dataKey="vues" stroke="#3b82f6" fill="url(#colorView)" fillOpacity={0.3} />
                    <defs>
                      <linearGradient id="colorView" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Top Vidéos */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-md font-medium text-gray-700 mb-4">Top Vidéos</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vidéo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vues
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Likes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {videos.slice(0, 5).map((video) => (
                      <tr key={video.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-16 bg-gray-200 rounded-md overflow-hidden mr-3">
                              <video className="h-full w-full object-cover">
                                <source src={video.url} type="video/mp4" />
                              </video>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{video.filename}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {video.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {video.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {video.views?.toLocaleString() || '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {video.likes?.toLocaleString() || '0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'permissions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Accès Accordés</h2>
                <button 
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter
                </button>
              </div>
              
              <div className="space-y-4">
                {grantedAccesses.length > 0 ? (
                  grantedAccesses.map((access) => (
                    <div key={access.id} className="p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{access.receiver.username}</p>
                          <p className="text-sm text-gray-500">{access.receiver.email}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Accès accordé le {new Date(access.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRevokeAccess(access.id)}
                          className="h-fit px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Révoquer
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-gray-500">Aucun accès accordé</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Accès Reçus</h2>
              <div className="space-y-4">
                {receivedAccesses.length > 0 ? (
                  receivedAccesses.map((access) => (
                    <div key={access.id} className="p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100">
                      <p className="font-medium text-gray-800">{access.granter.username}</p>
                      <p className="text-sm text-gray-500">{access.granter.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Accès reçu le {new Date(access.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <p className="text-gray-500">Aucun accès reçu</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VosVideosPage;