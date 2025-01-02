'use client'
import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return ( // Navbar component for the app layout 
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" prefetch={false}>
          <img
            src="/Logo_light_mode.png"
            alt="Logo"
            className="h-10 w-auto"
          />
          </Link>
          
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Recherche"
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <Link href="/login" prefetch={false}>
              <img
                src={"https://thispersondoesnotexist.com"}
                alt="Profile"
                className="rounded-full h-10 w-10 object-cover cursor-pointer"
              />
            </Link>
            <Link href="/profile" prefetch={false}>
              <img
                src="/icons/bell.svg"
                alt="Notifications"
                className="h-6 w-6 object-cover cursor-pointer"
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}