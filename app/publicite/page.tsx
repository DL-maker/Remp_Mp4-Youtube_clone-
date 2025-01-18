'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/navbar";
import Image from 'next/image';

export default function Publicite() {
  const [isOpen, setIsOpen] = useState(false); // État du menu latéral ouvert ou fermé
  const router = useRouter(); // Hook de routage pour la redirection

  const toggleColumn = () => { // Fonction pour basculer le menu latéral
    setIsOpen(!isOpen);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />

      {/* Section Principale */}
      <section
        className="relative text-white py-20 px-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/Advertising.png')",
        }}
      >
        <div className="absolute inset-0"></div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="md:w-3/5">
            <div className="bg-white p-4 rounded-lg">
              <h1 className="text-4xl md:text-5xl font-bold mb-3 text-black">
                Boostez votre entreprise grâce à la publicité Re-Mp4
              </h1>
            </div>
            <p className="text-xl mb-8">
              Attirez de nouveaux spectateurs et développez votre clientèle en maximisant votre portée.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition" onClick={() => router.push('/login')}>
                Commencez maintenant
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section Avantages */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Atteignez vos clients et élargissez votre audience
              </h2>
              <p className="text-gray-600 mb-6">
                Des amateurs de cuisine à proximité aux passionnés de mode dans tout le pays, connectez-vous à vos clients lorsqu&apos;ils recherchent, explorent ou regardent du contenu en ligne.
              </p>
              <blockquote className="border-l-4 border-blue-600 pl-4 italic">
                &quot;Si une image vaut mille mots, une vidéo en vaut des millions.&quot;
                <footer className="mt-2 font-semibold">- Njord Rota, Propriétaire, Majestic Heli Ski</footer>
              </blockquote>
            </div>
            <div>
              <Image
                src="/community.png"
                alt="Connexion avec les clients"
                width={500}
                height={300}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Chiffres clés</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-blue-600 mb-4">2x</div>
              <p className="text-gray-600">Les utilisateurs déclarent être deux fois plus enclins à acheter un produit vu sur Remp Mp4</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-blue-600 mb-4">70%</div>
              <p className="text-gray-600">39,5 millions d&apos;adultes en France regardent Remp Mp4 chaque mois</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-blue-600 mb-4">4x</div>
              <p className="text-gray-600">Les utilisateurs sont quatre fois plus susceptibles d&apos;utiliser Remp Mp4 par rapport à d&apos;autres plateformes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Avis de nos utilisateurs</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <blockquote className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-250">
              <p className="text-gray-600 mb-4">&quot;Nous avons réussi à atteindre notre audience au moment parfait.&quot;</p>
              <footer className="font-semibold">- Kim Thompson, Spark Foundry</footer>
            </blockquote>
            <blockquote className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-250">
              <p className="text-gray-600 mb-4">&quot;Depuis que nous utilisons Remp Mp4 pour nos publicités, nos ventes ont presque doublé chaque année.&quot;</p>
              <footer className="font-semibold">- Stephanie Syberg, Propriétaire de Tulane&apos;s Closet</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section
        className="relative text-white py-20 px-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/Advertising.png')",
        }}
      ><div className="bg-white p-4 rounded-lg max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-black">
            Les outils essentiels pour créer une publicité efficace
          </h2>
          <p className="text-xl mb-8 text-black">
            Que vous soyez débutant ou expert, créez facilement des annonces vidéo qui produisent des résultats avec nos outils gratuits ou l&apos;aide de nos partenaires.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition border-2 border-sky-500" onClick={() => router.push('/login')}>
              Lancez-vous
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>© 2025 LD-Makeur. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
