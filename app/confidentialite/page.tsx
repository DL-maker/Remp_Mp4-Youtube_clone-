"use client";
import React, { useState } from 'react';
import Navbar from "@/components/navbar";
export default function TermsOfService() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
        <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
      <header className="bg-gray-200 text-black py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Politique de Confidentialité</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Utilisation de Mux pour la Gestion Vidéo</h2>
          <p>
            Remp Mp4 utilise les services de <strong>Mux</strong>, une plateforme professionnelle de gestion et de diffusion vidéo, pour vous offrir une expérience fluide et de qualité. Cependant :
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Nous collectons uniquement les informations nécessaires à la diffusion des vidéos.</li>
            <li>Aucun profilage détaillé ou traçage des comportements n'est réalisé.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Recommandations Vidéo</h2>
          <p>
            Contrairement à YouTube, Remp Mp4 ne collecte pas de données personnelles massives pour vous proposer des recommandations sophistiquées.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              Les suggestions de vidéos sont <strong>aléatoires</strong> ou basées sur des critères simples (vidéos récemment ajoutées, plus populaires).
            </li>
            <li>
              Cette approche garantit une expérience plus privée, bien que les recommandations soient moins personnalisées.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Publicités Non Ciblées</h2>
          <p>
            Remp Mp4 affiche des publicités pour financer ses services. Ces publicités sont :
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              <strong>Non ciblées</strong> : elles ne sont pas basées sur vos données personnelles (historique, préférences, etc.).
            </li>
            <li>
              <strong>Aléatoires</strong> : elles sont sélectionnées de manière générique, sans suivi ou profilage utilisateur.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Collecte et Protection des Données</h2>
          <p>
            Remp Mp4 s'engage à protéger vos données personnelles en appliquant les principes suivants :
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              <strong>Collecte minimale :</strong> seules les informations strictement nécessaires (par exemple, votre e-mail) sont demandées.
            </li>
            <li>
              <strong>Aucune vente de données :</strong> vos informations personnelles ne seront jamais partagées ou vendues à des tiers.
            </li>
            <li>
              <strong>Sécurisation des données :</strong> nous utilisons des protocoles avancés pour garantir la confidentialité et l’intégrité de vos informations.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Votre Contrôle et Vos Droits</h2>
          <p>
            Vous disposez d’un contrôle total sur vos données personnelles :
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Vous pouvez supprimer vos informations personnelles ou votre compte à tout moment via votre espace utilisateur.</li>
            <li>
              Nous n'enregistrons aucun historique de vos vidéos regardées, sauf si vous choisissez de le faire manuellement.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Une Plateforme Transparente</h2>
          <p>
            Chez Remp Mp4, nous privilégions une expérience simple et respectueuse de votre vie privée. Contrairement à d'autres services, nous n'utilisons pas vos données pour améliorer nos algorithmes au détriment de votre vie privée.
          </p>
        </section>
      </main>

      <footer className="bg-gray-100 py-6">
        <div className="max-w-4xl mx-auto text-center text-gray-600">
          <p>© 2025 Remp Mp4. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
