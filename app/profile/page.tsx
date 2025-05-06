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
}

export default function ProfilePage() {
  const router = useRouter();
  const [state, setState] = useState<ProfileState>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch('/api/session');
      const result = await response.json();

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (response.status !== 200) {
        setState({ error: result.error });
      } else {
        setState({
          userId: result.userId,
          username: result.username,
          email: result.email,
          createdAt: result.createdAt,
          stats: { Video: 0, likes: 0, Abonner: 0 },
        });
      }
    };

    fetchProfile();
  }, [router]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Veuillez sélectionner un fichier vidéo.');
      return;
    }

    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('video', selectedFile);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload-video');

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            setUploadSuccess(true);
            console.log('Upload réussi:', data);
            resolve(data);
          } catch (error) {
            setUploadError('Erreur lors de la lecture de la réponse du serveur.');
            reject(error);
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            setUploadError(errorData?.error || 'Erreur lors de l\'upload.');
            console.error('Erreur d\'upload:', errorData);
            reject(errorData);
          } catch (error) {
            setUploadError('Erreur lors de la lecture de la réponse d\'erreur du serveur.');
            reject(error);
          }
        }
      };

      xhr.onerror = () => {
        setUploadError('Erreur réseau lors de l\'upload.');
        reject(new Error('Network error during upload.'));
      };

      xhr.send(formData);
    });
  };

  if (state.error) {
    return (
      <>
        <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
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
              {/* ... le reste de ton code de profil ... */}
              <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Uploader une Vidéo</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="video-upload" className="block text-sm font-medium text-gray-700 mb-1">
                      Sélectionner un fichier vidéo
                    </label>
                    <input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Uploader la Vidéo
                  </button>

                  {uploadProgress > 0 && <p>Progression de l'upload: {uploadProgress}%</p>}
                  {uploadError && <p className="text-red-500">Erreur: {uploadError}</p>}
                  {uploadSuccess && <p className="text-green-500">Upload réussi!</p>}
                </div>
              </div>
              {/* ... le reste de ton code de profil ... */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}