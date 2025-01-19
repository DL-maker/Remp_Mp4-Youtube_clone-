'use client';

import React from 'react';
import Navbar from "@/components/navbar";
import { useRouter } from 'next/navigation';

export default function ToutesLesRegles() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <Navbar toggleColumn={() => {}} isOpen={false} />

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            Toutes les règles de notre communauté
          </h1>
          <p className="text-lg md:text-xl mb-8 font-light">
            Voici une liste complète des règles que nous attendons de tous les membres de notre communauté.
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
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <button className="bg-white text-black px-8 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-100 hover:shadow-xl transition" onClick={() => router.push('/reglement')}>
              Retour au règlement
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
