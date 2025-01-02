"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import ColumnOfVideo from "@/components/column_of_video";
import Navbar from "@/components/navbar";
import Link from 'next/link';

// On définit les composants AVANT le composant de page
const AbonnementButton = () => {
  return (
    <div className='bg-gray-500'>
      <button className="flex-1 px-4 py-2 text-center hover:bg-gray-200 rounded-md transition-colors duration-200 focus:outline-none flex">
        <span className="flex-1">Abonnement</span>
      </button>
    </div>
  );
}

const StateButton = () => {
  return (
    <div>
      <button className="flex-1 px-4 py-2 text-center hover:bg-gray-200 rounded-md transition-colors duration-200 focus:outline-none flex">
        <span className="flex-1">State</span>
      </button>
    </div>
  );
}

interface CollapsibleColumnProps {
  isOpen: boolean;
  toggleColumn: () => void;
}

const CollapsibleColumn: React.FC<CollapsibleColumnProps> = ({ isOpen, toggleColumn }) => {
  return (
    <div className={`fixed top-0 left-0 h-full bg-gray-600 p-4 rounded-lg transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <button 
        onClick={toggleColumn} 
        className="w-full px-4 py-2 text-center hover:bg-gray-200 rounded-md transition-colors duration-200 focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
      <img
              src="/Logo_light_mode.png"
              alt="Logo"
              className="h-10 w-auto cursor-pointer"
              onClick={() => window.location.reload()}
            />
      {isOpen && (
        <>
          <div className="max-w-xs rounded-t-lg flex justify-center items-center bg-gray-500">
            <AbonnementButton />
          </div>

          <div className="flex max-w-xs itemsStretch rounded-b-lg bg-gray-400 mb-4">
            <Image 
              className="rounded-full w-[50px] h-[50px] mt-2 mb-2 mr-1 ml-2" 
              src={"https://thispersondoesnotexist.com?" + new Date().getTime()} 
              alt="Profile" 
              width={50} 
              height={50}
            />
            <Image 
              className="max-w-xs mt-2 mb-2 mr-3 ml-1" 
              src="/Video_indisponible.png" 
              alt="Photo video" 
              width={175} 
              height={350} 
            />
            <p className='justify-center items-center'>Titre : Shif ... Shif...</p>
          </div>

          <div className="max-w-xs rounded-t-lg flex justify-center items-center bg-gray-500">
            <StateButton />
          </div>

          <div className='flex max-w-xs justify-center items-center rounded-b-lg bg-gray-400'>
            <p>
              Vues : +...<br/>
              Likes : +...<br/>
              Commentaire: +...
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// Puis notre composant de page
export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative flex flex-col">
      <Navbar toggleColumn={toggleColumn} />
      <div className="flex">
        <CollapsibleColumn isOpen={isOpen} toggleColumn={toggleColumn} />
        <div className="flex-1 bg-white">
          <ColumnOfVideo />
        </div>
      </div>
    </div>
  );
}