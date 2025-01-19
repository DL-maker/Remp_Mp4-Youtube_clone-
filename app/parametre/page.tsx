'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

const SettingsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<string>("fr"); // Valeur par défaut : Français
  const [isMuxEnabled, setIsMuxEnabled] = useState<boolean>(false);
  const [apiUrl, setApiUrl] = useState<string>("");
  const [hasAccount, setHasAccount] = useState<boolean>(true); // Simuler l'existence d'un compte
  const router = useRouter();

  // Gérer la modification de la langue
  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  // Gérer le changement de l'activation du MUX
  const handleMuxChange = () => {
    setIsMuxEnabled((prev) => !prev);
  };

  // Gérer l'input de l'API
  const handleApiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiUrl(event.target.value);
  };

  // Fonction pour supprimer le compte (simulation)
  const handleDeleteAccount = () => {
    if (hasAccount) {
      // Simuler la suppression du compte
      alert("Votre compte a été supprimé !");
      setHasAccount(false); // Mise à jour de l'état pour simuler la suppression du compte
      router.push("/"); // Rediriger l'utilisateur après la suppression
    } else {
      // Afficher un message indiquant qu'il n'y a pas de compte
      alert("Il n&apos;y a pas de compte à supprimer.");
    }
  };

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar avec un background sombre et un layout flexible */}
      <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />

      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-16">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">Paramètres du Compte</h1>

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
            Activer MUX
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
            URL de l&apos;API
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
