'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

const SettingsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<string>("fr");
  const [isMuxEnabled, setIsMuxEnabled] = useState<boolean>(false);
  const [isInvisibleMode, setIsInvisibleMode] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [inputAccessToken, setInputAccessToken] = useState<string>("");
  const [apiUrl, setApiUrl] = useState<string>("");
  const [hasAccount, setHasAccount] = useState<boolean>(true);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const response = await fetch('/api/user-settings');
        if (response.ok) {
          const settings = await response.json();
          setIsInvisibleMode(settings.isInvisible || false);
          setAccessToken(settings.accessToken || "");
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      }
    };

    loadUserSettings();
  }, []);

  // Ajouter dans le useEffect pour créer l'effet de phare
  useEffect(() => {
    // Vérifier si on doit mettre en surbrillance la section
    const shouldHighlight = localStorage.getItem('highlightAccessSection') === 'true';
    
    if (shouldHighlight) {
      // Supprimer l'indicateur pour ne pas répéter l'effet lors des visites ultérieures
      localStorage.removeItem('highlightAccessSection');
      
      // Attendre que le DOM soit chargé
      setTimeout(() => {
        // Trouver la section à mettre en évidence
        const accessSection = document.getElementById('access-section');
        if (accessSection) {
          // Faire défiler jusqu'à cette section
          accessSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Ajouter la classe pour l'effet de phare
          accessSection.classList.add('highlight-section');
          
          // Retirer l'effet après 2 secondes
          setTimeout(() => {
            accessSection.classList.remove('highlight-section');
          }, 2000);
        }
      }, 300); // Petit délai pour s'assurer que le DOM est bien chargé
    }
  }, []);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  const handleMuxChange = () => {
    setIsMuxEnabled((prev) => !prev);
  };

  const handleInvisibleModeChange = async () => {
    try {
      const response = await fetch('/api/user-settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isInvisible: !isInvisibleMode
        })
      });

      if (response.ok) {
        setIsInvisibleMode(!isInvisibleMode);
        
        // Générer un nouveau token d'accès si le mode invisible est activé
        if (!isInvisibleMode) {
          const tokenResponse = await fetch('/api/user-settings/access', {
            method: 'POST'
          });
          if (tokenResponse.ok) {
            const data = await tokenResponse.json();
            setAccessToken(data.accessToken);
            setMessage({
              text: "Mode invisible activé et lien d'accès généré",
              type: 'success'
            });
          }
        } else {
          setAccessToken("");
          setMessage({
            text: "Mode visible activé",
            type: 'success'
          });
        }
      } else {
        setMessage({
          text: "Erreur lors de la modification du mode",
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Erreur lors du changement de mode:', error);
      setMessage({
        text: "Erreur lors de la modification du mode",
        type: 'error'
      });
    }
  };

  const handleGenerateNewToken = async () => {
    try {
      const response = await fetch('/api/user-settings/access', {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        setMessage({
          text: "Nouveau lien d'accès généré avec succès",
          type: 'success'
        });
      } else {
        setMessage({
          text: "Erreur lors de la génération du lien d'accès",
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la génération du token:', error);
      setMessage({
        text: "Erreur lors de la génération du lien d'accès",
        type: 'error'
      });
    }
  };

  const handleSubmitAccessToken = async () => {
    try {
      const response = await fetch('/api/user-settings/access', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: inputAccessToken
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage({
          text: `Accès accordé au profil de ${data.granterUsername}`,
          type: 'success'
        });
        setInputAccessToken('');
      } else {
        setMessage({
          text: data.error || "Erreur lors de l'utilisation du lien d'accès",
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'utilisation du token:', error);
      setMessage({
        text: "Erreur lors de l'utilisation du lien d'accès",
        type: 'error'
      });
    }
  };

  const handleApiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiUrl(event.target.value);
  };

  const handleDeleteAccount = () => {
    if (hasAccount) {
      alert("Votre compte a été supprimé !");
      setHasAccount(false);
      router.push("/");
    } else {
      alert("Il n'y a pas de compte à supprimer.");
    }
  };

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-50">
      <Navbar 
        toggleColumn={toggleColumn} 
        isOpen={isOpen} 
        isLoggedIn={true} 
        onLogout={() => router.push('/login')} 
      />

      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-16 border-t-4 border-blue-500">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Paramètres du Compte
          </span>
        </h1>

        {message && (
          <div className={`mb-8 p-4 rounded-lg shadow-sm ${
            message.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 'bg-red-100 text-red-800 border-l-4 border-red-500'
          } flex items-center`}>
            <span className={`mr-2 text-xl ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.type === 'success' ? '✓' : '✗'}
            </span>
            {message.text}
          </div>
        )}

        {/* Mode Invisible */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xl font-medium text-gray-700 flex items-center">
                <span className="mr-2">
                  {isInvisibleMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </span>
                Mode Invisible
              </label>
              <p className="text-sm text-gray-500 mt-1 ml-8">
                Lorsque activé, votre profil et vos vidéos ne seront pas visibles sur la page d&apos;accueil
              </p>
            </div>
            {/* Remplacer le bouton switch actuel par celui-ci */}
            <div className="relative inline-block w-16 h-8">
              <input
                type="checkbox"
                className="sr-only"
                checked={isInvisibleMode}
                onChange={handleInvisibleModeChange}
                id="invisibleMode"
              />
              <label
                htmlFor="invisibleMode"
                className={`absolute cursor-pointer inset-0 rounded-full transition-all duration-300 ${
                  isInvisibleMode 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                    : 'bg-gray-200'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 right-1 bottom-1 flex items-center transition-all duration-300 ${
                    isInvisibleMode ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span 
                    className="h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center"
                  >
                    {isInvisibleMode ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    )}
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Section de partage du lien d'accès */}
        {isInvisibleMode && (
          <div className="mt-6 p-5 bg-blue-50 rounded-lg border border-blue-100 transform transition-all duration-300 ease-in-out">
            <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Lien d&apos;accès à votre profil
            </h3>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                readOnly
                value={accessToken}
                className="flex-1 p-2 border rounded bg-white shadow-inner text-blue-800 font-mono text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(accessToken);
                  setMessage({
                    text: "Lien d'accès copié !",
                    type: 'success'
                  });
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow transition-all duration-300"
              >
                Copier
              </button>
              <button
                onClick={handleGenerateNewToken}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 shadow-sm hover:shadow transition-all duration-300"
              >
                Générer nouveau
              </button>
            </div>
          </div>
        )}

        {/* Section séparée pour utiliser un lien d'accès */}
        <div id="access-section" className="mb-8 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
          <h3 className="text-xl font-medium text-gray-700 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1" />
            </svg>
            Utiliser un lien d&apos;accès
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Entrez un lien d&apos;accès partagé avec vous pour accéder à un profil invisible
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputAccessToken}
              onChange={(e) => setInputAccessToken(e.target.value)}
              placeholder="Collez le lien d'accès ici"
              className="flex-1 p-3 border-2 border-gray-300 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-200"
            />
            <button
              onClick={handleSubmitAccessToken}
              disabled={!inputAccessToken}
              className={`px-5 py-3 rounded-lg shadow-sm hover:shadow transition-all duration-300 ${!inputAccessToken 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'}`}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Accéder
              </span>
            </button>
          </div>
        </div>

        {/* Autres sections avec style amélioré */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Sélecteur de Langue */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <label htmlFor="language" className="block text-xl font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              Choisissez la langue
            </label>
            <select
              id="language"
              value={language}
              onChange={handleLanguageChange}
              className="p-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white shadow-sm"
            >
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
              <option value="ar">Arabe</option>
              <option value="ru">Russe</option>
              <option value="es">Espagnol</option>
              <option value="zh">Mandarien</option>
            </select>
          </div>

          {/* Switch pour MUX */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="mux" className="text-xl font-medium text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Activer MUX
              </label>
              <div className="relative inline-block w-16 h-8">
                <input
                  type="checkbox"
                  id="mux"
                  checked={isMuxEnabled}
                  onChange={handleMuxChange}
                  className="sr-only"
                />
                <label
                  htmlFor="mux"
                  className={`absolute cursor-pointer inset-0 rounded-full transition-all duration-300 ${
                    isMuxEnabled 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                      : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 right-1 bottom-1 flex items-center transition-all duration-300 ${
                      isMuxEnabled ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span 
                      className="h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center"
                    >
                      {isMuxEnabled ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </span>
                  </span>
                </label>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Active les fonctionnalités avancées de streaming
            </p>
          </div>
        </div>

        {/* Input pour entrer l'URL de l'API */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
          <label htmlFor="api-url" className="block text-xl font-medium text-gray-700 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            URL de l&apos;API
          </label>
          <input
            type="text"
            id="api-url"
            value={apiUrl}
            onChange={handleApiChange}
            className={`p-3 border-2 rounded-lg w-full focus:outline-none focus:ring-2 transition-all duration-200 ${
              isMuxEnabled 
              ? "text-black bg-white border-gray-300 focus:ring-blue-600 focus:border-blue-500" 
              : "text-gray-500 bg-gray-100 border-gray-200 cursor-not-allowed"
            }`}
            placeholder="Entrez l'URL de l'API"
            disabled={!isMuxEnabled}
          />
          <p className="text-xs text-gray-500 mt-2 ml-1">
            {isMuxEnabled 
              ? "Format attendu: https://api.exemple.com/v1" 
              : "Activez MUX pour configurer l'API"}
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
          <button
            onClick={handleDeleteAccount}
            className="w-full md:w-auto bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-full shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Supprimer mon compte
          </button>
          
          <button
            onClick={() => {
              alert("Paramètres sauvegardés");
              setMessage({
                text: "Vos paramètres ont été sauvegardés avec succès",
                type: 'success'
              });
            }}
            className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-8 rounded-full shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Sauvegarder les Paramètres
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
