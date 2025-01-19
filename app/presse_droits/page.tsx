'use client';

import React, { useState } from 'react';
import Navbar from "@/components/navbar";

export default function PresseDroits() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Presse - Droits d&apos;auteur de Remp-mp4
          </h1>
        </header>

        <main className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Chez Remp-mp4, nous prenons les droits d&apos;auteur très au sérieux. Cette page vise à informer la presse, les créateurs de contenu et le grand public sur nos politiques et initiatives en matière de droits d&apos;auteur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Politique de droits d&apos;auteur
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Remp-mp4 respecte et applique la loi sur les droits d&apos;auteur, y compris le Digital Millennium Copyright Act (DMCA) aux États-Unis et les réglementations similaires dans d&apos;autres pays. Nous fournissons des outils pour :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
              <li className="leading-relaxed">
                Identifier les violations potentielles des droits d&apos;auteur
              </li>
              <li className="leading-relaxed">
                Permettre aux détenteurs de droits de signaler les contenus concernés
              </li>
              <li className="leading-relaxed">
                Assurer un processus d&apos;appel équitable pour les créateurs accusés à tort
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Outils pour les créateurs et détenteurs de droits
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Pour protéger les œuvres originales et favoriser l&apos;innovation, Remp-mp4 offre des solutions telles que :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
              <li className="leading-relaxed">
                <span className="font-semibold">Content ID :</span> un outil avancé qui permet aux détenteurs de droits d&apos;identifier et de gérer leurs contenus protégés
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold">Formulaire de retrait :</span> un moyen simple de signaler les violations de droits d&apos;auteur
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold">Bibliothèque audio :</span> une collection de musiques libres de droits pour les créateurs
              </li>
            </ul>
          </section>
        </main>

        <footer className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">
            © 2025 LD-Makeur
          </p>
        </footer>
      </div>
    </div>
  );
}