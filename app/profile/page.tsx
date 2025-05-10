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
    Video: number;
    likes: number;
    Abonner: number;
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
    const fetchProfile = async () => {
      try {
        const [profileResponse, videosResponse] = await Promise.all([
          fetch('/api/session'),
          fetch('/api/users/videos')
        ]);

        if (profileResponse.status === 401 || videosResponse.status === 401) {
          router.push('/login');
          return;
        }

        const profileData = await profileResponse.json();
        const videosData = await videosResponse.json();

        setState(prevState => ({
          ...prevState,
          ...profileData,
          videos: videosData.videos
        }));
      } catch (error) {
        setState(prevState => ({
          ...prevState,
          error: "Erreur lors du chargement du profil"
        }));
      }
    };

    fetchProfile();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.includes("video/")) {
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

  if (state.error) {
    return (
      <>

        <div className="text-red-500 text-center p-4">{state.error}</div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />

      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          {!state.userId ? (
            <div className="text-gray-500 text-center">Loading profile...</div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
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
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        {isEditing ? 'Close' : 'Edit Profile'}
                      </button>
                    </div>
                    <p className="text-gray-600 mb-2">{state.email}</p>
                    <p className="text-sm text-gray-500">
                      Joined {new Date(state.createdAt!).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-gray-900">0</div>
                    <div className="text-gray-600">Video</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-gray-900">0</div>
                    <div className="text-gray-600">Likes</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-gray-900">0</div>
                    <div className="text-gray-600">Abonner</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Mes Vidéos</h2>
                {state.videos && state.videos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {state.videos.map((video, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                        <video
                          className="w-full aspect-video object-cover"
                          src={video.url}
                          controls
                        />
                        <div className="p-4">
                          <p className="text-sm text-gray-600">
                            Publié le {new Date(video.lastModified).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">Aucune vidéo publiée</p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Upload une nouvelle vidéo</h2>
                <div>
                  <label htmlFor="videoInput" className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionner un fichier vidéo
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
                  className="mt-6 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUploading ? "Téléchargement..." : "Publier la vidéo"}
                </button>

                {uploadProgress > 0 && <p className="mt-2">Progression de l'upload: {uploadProgress}%</p>}
                {uploadError && <p className="mt-2 text-red-500">Erreur d'upload: {uploadError}</p>}
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