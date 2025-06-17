'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Image from 'next/image';

interface ProfileState {
  userId?: string;
  username?: string;
  email?: string;
  createdAt?: string;
  stats?: {
    videosCount: number;
    subscribersCount: number;
    subscriptionsCount: number;
    likesCount: number;
  };
  error?: string;
  videos?: Array<{
    key: string;
    url: string;
    lastModified: string;
    size: number;
  }>;
}

export default function ProfilePage() {
  const router = useRouter();
  const [state, setState] = useState<ProfileState>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [videoFileToUpload, setVideoFileToUpload] = useState<File | null>(null);
  const [videoType, setVideoType] = useState("normale");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Ajouter le style CSS pour l'animation seulement côté client
    const style = document.createElement('style');
    style.textContent = `
      @keyframes highlight-pulse {
        0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7); }
        70% { box-shadow: 0 0 0 15px rgba(79, 70, 229, 0); }
        100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
      }
      
      .highlight-section {
        animation: highlight-pulse 2s ease-out;
        background-color: rgba(238, 242, 255, 0.8); /* Couleur de fond légère */
        transition: background-color 2s ease;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      // Nettoyage en cas de démontage du composant
      document.head.removeChild(style);
    };
  }, []);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileResponse = await fetch('/api/profile');

        if (profileResponse.status === 401) {
          router.push('/login');
          return;
        }

        if (!profileResponse.ok) {
          throw new Error('Erreur lors du chargement du profil');
        }

        const profileData = await profileResponse.json();

        setState({
          userId: profileData.userId,
          username: profileData.username,
          email: profileData.email,
          createdAt: profileData.createdAt,
          stats: profileData.stats,
          videos: profileData.videos,
        });

        if (profileData.username) {
          localStorage.setItem('username', profileData.username);
          localStorage.setItem('isLoggedIn', 'true');
        }
      } catch (error: unknown) {
        console.error('Error fetching profile:', error);
        setState({ error: error instanceof Error ? error.message : 'Failed to fetch profile' });
      }
    };

    fetchProfile();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérification du type de fichier
      if (!file.type.includes("video/")) {
        setUploadError('Le fichier sélectionné n\'est pas une vidéo.');
        setVideoFileToUpload(null);
        return;
      }
      
      // Vérification de la taille (85 Mo en octets = 85 * 1024 * 1024)
      const MAX_FILE_SIZE = 85 * 1024 * 1024; // 85 Mo en octets
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`La taille du fichier dépasse la limite de 85 Mo. Taille actuelle: ${(file.size / (1024 * 1024)).toFixed(2)} Mo`);
        setVideoFileToUpload(null);
        return;
      }
      
      // Le fichier est valide, on le stocke
      setUploadError(null);
      setVideoFileToUpload(file);
    }
  };

  const handleUpload = async () => {
    if (!videoFileToUpload) {
      setUploadError('Veuillez sélectionner un fichier vidéo.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('video', videoFileToUpload);
    formData.append('type', videoType); // Si ton API route /api/videos/upload attend le type

    try {
      const response = await fetch('/api/upload-video', { // Assure-toi que c'est la bonne URL
        method: 'POST',
        body: formData,
        // Ne pas inclure de headers Content-Type, fetch s'en occupe pour FormData
      });

      const result = await response.json();

      setIsUploading(false);

      if (response.ok) {
        setUploadSuccess(true);
        console.log('Upload réussi:', result);
        // Réinitialiser la sélection de fichier après l'upload
        setVideoFileToUpload(null);
        if (document.getElementById("videoInput") instanceof HTMLInputElement) {
          (document.getElementById("videoInput") as HTMLInputElement).value = "";
        }
      } else {
        setUploadError(result?.error || 'Erreur lors de l\'upload de la vidéo.');
        console.error('Erreur d\'upload:', result);
      }
    } catch (error) {
      setIsUploading(false);
      setUploadError('Erreur réseau lors de l\'upload.');
      console.error('Erreur lors de l\'upload:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // Clear any user data from localStorage
        localStorage.removeItem('username');
        localStorage.removeItem('isLoggedIn');
        
        // Redirect to home page after successful logout
        router.push('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (state.error) {
    return (
      <>

        <div className="text-red-500 text-center p-4">{state.error}</div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-50">
      <Navbar 
        toggleColumn={toggleColumn} // Replace with your actual toggleColumn function
        isOpen={isOpen}          // Replace with your actual isOpen state
        isLoggedIn={true}       // Replace with your actual isLoggedIn state
        onLogout={handleLogout} // Pass the handleLogout function
      />

      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          {!state.userId ? (
            <div className="text-gray-500 text-center">Loading profile...</div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-blue-500">
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
                    <Image
                      src="https://thispersondoesnotexist.com"
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                      <h1 className="text-2xl font-bold text-gray-900">{state.username}</h1>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        {isEditing ? 'Close' : 'Edit Profile'}
                      </button>
                    </div>
                    <p className="text-gray-600 mb-2">{state.email}</p>
                    <p className="text-sm text-gray-500">
                      Joined {new Date(state.createdAt!).toLocaleDateString()}
                    </p>
                  </div>
                </div>                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg text-center shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
                    <div className="text-xl font-bold text-gray-900">{state.stats?.videosCount || 0}</div>
                    <div className="text-gray-600">Vidéos</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg text-center shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
                    <div className="text-xl font-bold text-gray-900">{state.stats?.likesCount || 0}</div>
                    <div className="text-gray-600">Likes</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg text-center shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
                    <div className="text-xl font-bold text-gray-900">{state.stats?.subscribersCount || 0}</div>
                    <div className="text-gray-600">Abonnés</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-5 mt-6 border-t-2 border-indigo-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Mes Vidéos</h2>
                  <button 
                    onClick={() => router.push('/vos_videos')}
                    className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
                  >
                    Voir tout
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {state.videos && state.videos.length > 0 ? (
                    // Affiche les 2 premières vidéos sur la page profile
                    state.videos.slice(0, 2).map((video, index) => (
                      <div 
                        key={index} 
                        className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
                        onClick={() => {
                          // Extraire uniquement le nom du fichier vidéo (dernière partie après le dernier '/')
                          const fileName = video.key.split('/').pop() || '';
                          router.push(`/video_page?videoId=${encodeURIComponent(fileName)}`);
                        }}
                      >
                        <div className="aspect-video relative">
                          <video 
                            className="w-full h-full object-cover" 
                            src={`/api/video-stream?key=${encodeURIComponent(video.key)}`}
                            preload="metadata" 
                            playsInline
                            muted
                            onMouseOver={e => e.currentTarget.play()}
                            onMouseOut={e => {e.currentTarget.pause(); e.currentTarget.currentTime = 0;}}
                          ></video>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="p-2">
                          <h3 className="font-medium text-sm text-gray-900 truncate">
                            {video.key.split('/').pop() || `Vidéo ${index + 1}`}
                          </h3>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{new Date(video.lastModified).toLocaleDateString()}</span>
                            <span>{(video.size / (1024 * 1024)).toFixed(1)} Mo</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Message si aucune vidéo n'est disponible
                    <div className="col-span-2 text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Vous n&apos;avez pas encore de vidéos</p>
                    </div>
                  )}
                  
                  {/* Bouton "Ajouter une vidéo" avec texte et scroll vers la section upload */}
                  {(!state.videos || state.videos.length < 2) && (
                    <div 
                      className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition bg-gray-50 cursor-pointer"
                      onClick={() => {
                        // Trouver la section d'upload
                        const uploadSection = document.getElementById('upload-section');
                        if (uploadSection) {
                          // Faire défiler vers cette section
                          uploadSection.scrollIntoView({ behavior: 'smooth' });
                          
                          // Ajouter un effet de phare (highlight)
                          uploadSection.classList.add('highlight-section');
                          
                          // Retirer l'effet après 2 secondes
                          setTimeout(() => {
                            uploadSection.classList.remove('highlight-section');
                          }, 2000);
                        }
                      }}
                    >
                      <div className="aspect-video flex items-center justify-center">
                        <div className="p-4 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-all duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                      </div>
                      <div className="p-2 text-center">
                        <h3 className="font-medium text-sm text-gray-900">Ajouter une vidéo</h3>
                        <p className="text-xs text-gray-500">Commencez à publier dès maintenant</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div id="upload-section" className="bg-white rounded-lg shadow-lg p-6 mt-8 border-t-2 border-indigo-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Upload une nouvelle vidéo</h2>
                <div>
                  <label htmlFor="videoInput" className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionner un fichier vidéo (max. 85 Mo)
                  </label>
                  <input
                    id="videoInput"
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-lg file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de vidéo
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="normale"
                        checked={videoType === "normale"}
                        onChange={(e) => setVideoType(e.target.value)}
                        className="form-radio text-indigo-600"
                      />
                      <span className="ml-2 pl-2">Normale</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="short"
                        checked={videoType === "short"}
                        onChange={(e) => setVideoType(e.target.value)}
                        className="form-radio text-indigo-600"
                      />
                      <span className="ml-2">Short</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={isUploading || !videoFileToUpload}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {isUploading ? "Téléchargement..." : "Publier la vidéo"}
                </button>

                {uploadProgress > 0 && <p className="mt-2">Progression de l&apos;upload: {uploadProgress}%</p>}
                {uploadError && <p className="mt-2 text-red-500">Erreur d&apos;upload: {uploadError}</p>}
                {uploadSuccess && <p className="mt-2 text-green-500">Upload réussi!</p>}
              </div>

              {isEditing && (
                <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-lg"
                        value={state.username}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full p-2 border rounded-lg"
                        value={state.email}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}