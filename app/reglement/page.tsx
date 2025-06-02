'use client';

import React, { useState } from 'react';
import Navbar from "@/components/navbar";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ReglementDeLaCommunaute() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar toggleColumn={toggleColumn} isOpen={isOpen} isLoggedIn={false} onLogout={function (): void {
        throw new Error('Function not implemented.');
      } } />

      {/* Section Principale */}
      <section className="relative bg-gray-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Règlement de notre communauté
          </h1>
          <p className="text-lg md:text-xl mb-8 font-light">
            Nous avons mis en place des règles simples pour garantir une expérience positive et respectueuse pour tous.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="bg-white text-black px-8 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-100 hover:shadow-xl transition" onClick={() => router.push('/toutes-les-regles')}>
              Consulter les règles
            </button>
          </div>
        </div>
      </section>

      {/* Section Règles Fondamentales */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Principes essentiels à respecter
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Notre communauté repose sur le respect mutuel et un comportement positif. Voici quelques principes clés à suivre :
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <span className="bg-gray-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
                  <p className="text-gray-700">Respectez les opinions des autres membres, même si elles diffèrent des vôtres.</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="bg-gray-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</span>
                  <p className="text-gray-700">Évitez les comportements hostiles, discriminatoires ou offensants.</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="bg-gray-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</span>
                  <p className="text-gray-700">Partagez des contenus appropriés et respectueux des lois et des droits d&apos;autrui.</p>
                </li>
              </ul>
            </div>
            <div>
              <Image
                src="/community-rules.png"
                alt="Règlement communautaire"
                className="rounded-lg shadow-lg"
                width={500}
                height={500}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section Conséquences */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Conséquences du non-respect des règles</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Avertissement</h3>
              <p className="text-gray-600">
                Un rappel sera émis en cas de première infraction mineure.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Suspension</h3>
              <p className="text-gray-600">
                En cas de comportement répété, une suspension temporaire sera appliquée.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Exclusion</h3>
              <p className="text-gray-600">
                Les infractions graves entraîneront une exclusion permanente de la communauté.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="bg-gray-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Rejoignez une communauté respectueuse
          </h2>
          <p className="text-lg mb-8">
            Respectez nos règles et contribuez à un espace où chacun se sent en sécurité et valorisé.
          </p>
          <button className="bg-white text-black px-10 py-3 rounded-lg font-semibold hover:bg-gray-100 shadow-lg transition" onClick={() => router.push('/login')}>
            Rejoindre maintenant
          </button>
        </div>
      </section>

      <footer className="bg-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>© 2025 Communauté LD-Makeur. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
