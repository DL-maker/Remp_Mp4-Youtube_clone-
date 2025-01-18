"use client";
import React, { useState } from 'react';
import Navbar from "@/components/navbar";

export default function TermsOfService() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* En-tête */}
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Conditions d'utilisation
            </h1>
            <p className="text-gray-600 mb-8">
              Ces conditions d'utilisation régissent votre utilisation de notre
              service. Veuillez les lire attentivement.
            </p>

            {/* Sections des conditions */}
            <div className="divide-y divide-gray-200">
              {/* Section : Votre contenu et votre conduite */}
              <div className="py-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Votre contenu et votre conduite
                </h2>
                <div className="space-y-4">
                  <h4 className="font-semibold">Mise en ligne de Contenu</h4>
                  <p>
                    Si vous avez une chaîne Remp Mp4, vous pouvez mettre du
                    Contenu en ligne via le Service. Vous pouvez utiliser ledit
                    Contenu pour faire la promotion de votre entreprise ou
                    activité artistique.
                  </p>
                  <div className="pl-4 space-y-2">
                    <p>Contenus interdits :</p>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Incitation à la haine ou discrimination</li>
                      <li>Harcèlement sexuel</li>
                      <li>Atteinte à la dignité humaine</li>
                      <li>Apologie de crimes contre l'humanité</li>
                      <li>Promotion du terrorisme</li>
                      <li>Apologie de crimes graves</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section : Les droits que vous concédez */}
              <div className="py-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Les droits que vous concédez
                </h2>
                <div className="space-y-4">
                  <p>
                    Vous conservez tous les droits de propriété sur votre
                    Contenu. Cependant, nous requérons certains droits :
                  </p>
                  <ul className="list-disc pl-4 space-y-2">
                    <li>Licence mondiale non exclusive</li>
                    <li>Droit de reproduction et modification</li>
                    <li>Droit de diffusion publique</li>
                    <li>Droit de monétisation</li>
                  </ul>
                </div>
              </div>

              {/* Section : Suppression de Contenu */}
              <div className="py-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Suppression de Contenu
                </h2>
                <div className="space-y-4">
                  <p>
                    Vous pouvez supprimer votre Contenu à tout moment. Remp Mp4
                    peut également supprimer du contenu qui :
                  </p>
                  <ul className="list-disc pl-4 space-y-2">
                    <li>Viole les conditions du présent Contrat</li>
                    <li>Est illégal ou préjudiciable</li>
                    <li>Ne respecte pas les règles de la communauté</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Pied de page du document */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
            <p className="text-sm text-gray-500 text-center">
              Dernière mise à jour : 19 janvier 2025
            </p>
          </div>
        </div>
      </main>

      {/* Pied de page */}
      <footer className="bg-white mt-8 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-600">
          <p>© 2025 Re-Mp4. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
