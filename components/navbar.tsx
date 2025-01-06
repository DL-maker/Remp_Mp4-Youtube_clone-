'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NavbarProps {
  toggleColumn: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleColumn }) => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleColumn} 
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <Link href="/">
              <Image
                src="/Logo_light_mode.png"
                alt="Logo"
                width={40}
                height={40}
                className="h-10 w-auto cursor-pointer"
              />
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Recherche"
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <Link href="/profile" prefetch={false}>
              <Image
                src={"https://thispersondoesnotexist.com"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full h-10 w-10 object-cover cursor-pointer"
              />
            </Link>
            <Link href="/login" prefetch={false}> 
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                Connexion
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;