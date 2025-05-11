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
    <div className="bg-gray-50 min-h-screen">
      <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />

      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-16">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">Paramètres du Compte</h1>

        {message && (
          <div className={`mb-4 p-4 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Mode Invisible */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xl font-medium text-gray-700">
                Mode Invisible
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Lorsque activé, votre profil et vos vidéos ne seront pas visibles sur la page d&apos;accueil
              </p>
            </div>
            <div className="relative inline-block w-14 h-8">
              <input
                type="checkbox"
                className="sr-only"
                checked={isInvisibleMode}
                onChange={handleInvisibleModeChange}
                id="invisibleMode"
              />
              <label
                htmlFor="invisibleMode"
                className={`absolute cursor-pointer inset-0 rounded-full transition-colors duration-300 ${
                  isInvisibleMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute inset-y-0 left-0 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                    isInvisibleMode ? 'translate-x-8' : 'translate-x-1'
                  } flex items-center justify-center mt-1 ml-1`}
                />
              </label>
            </div>
          </div>

          {/* Section de partage du lien d'accès */}
          {isInvisibleMode && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Lien d&apos;accès à votre profil</h3>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  readOnly
                  value={accessToken}
                  className="flex-1 p-2 border rounded bg-white"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(accessToken);
                    setMessage({
                      text: "Lien d'accès copié !",
                      type: 'success'
                    });
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Copier
                </button>
                <button
                  onClick={handleGenerateNewToken}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Générer nouveau
                </button>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Utiliser un lien d&apos;accès</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inputAccessToken}
                    onChange={(e) => setInputAccessToken(e.target.value)}
                    placeholder="Collez le lien d'accès ici"
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    onClick={handleSubmitAccessToken}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Utiliser
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sélecteur de Langue */}
        <div className="mb-8">
          <label htmlFor="language" className="block text-xl font-medium text-gray-700 mb-2">
            Choisissez la langue
          </label>
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
            className="p-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="fr">Français</option>
            <option value="en">Anglais</option>
            <option value="ar">Arabe</option>
            <option value="ru">Russe</option>
            <option value="es">Espagnol</option>
            <option value="zh">Mandarien</option>
          </select>
        </div>

        {/* Switch pour activer/désactiver MUX */}
        <div className="mb-8 flex items-center">
          <label htmlFor="mux" className="text-xl font-medium text-gray-700 mr-4">
            Activer MUX or a link to another invisible mode
          </label>
          <input
            type="checkbox"
            id="mux"
            checked={isMuxEnabled}
            onChange={handleMuxChange}
            className="h-6 w-6 rounded-full bg-blue-600 checked:bg-blue-700 transition-colors"
          />
        </div>

        {/* Input pour entrer l'URL de l'API */}
        <div className="mb-8">
          <label htmlFor="api-url" className="block text-xl font-medium text-gray-700 mb-2">
            URL de l&apos;API or link to another invisible mode
          </label>
          <input
            type="text"
            id="api-url"
            value={apiUrl}
            onChange={handleApiChange}
            className={`p-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 ${
              isMuxEnabled ? "text-black bg-white focus:ring-blue-600" : "text-gray-500 bg-gray-200 focus:ring-gray-400"
            }`}
            placeholder="Entrez l'URL de l'API"
            disabled={!isMuxEnabled}  // Désactive l'input si MUX n'est pas activé
          />
        </div>

        {/* Bouton de suppression de compte */}
        <div className="mb-8 text-center">
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-red-700 transition-colors"
          >
            Supprimer mon compte
          </button>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="text-center">
          <button
            onClick={() => alert("Paramètres sauvegardés")}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            Sauvegarder les Paramètres
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
