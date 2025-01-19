'use client';

import React, {useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import logo from '@/public/Logo_light_mode.png'; // Ensure you have a high-resolution logo

interface NavbarProps {
  toggleColumn: () => void;
  isOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleColumn, isOpen }) => {
  const columnRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnRef.current && !columnRef.current.contains(event.target as Node)) {
        toggleColumn();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleColumn]);

  return (
    <>
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
                  src={logo}
                  alt="Logo"
                  width={150}
                  height={50}
                  className="logo"
                />
              </Link>
            </div>
            
            <div className="flex-1 flex justify-center ">
              <input
                type="text"
                placeholder="Recherche"
                className="px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 border-2"
              />
            </div>
            
            <div className="flex items-center space-x-4">
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

      {/* Collapsible Column */}
      <div ref={columnRef} className={`fixed top-0 left-0 h-full bg-gray-300 p-4 rounded-lg transition-transform duration-300 overflow-y-auto z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleColumn} 
            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-white transition"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16m-7 6h7" 
              />
            </svg>
          </button>
          <Image
            src={logo}
            alt="Logo"
            width={150}
            height={50}
            className="logo"
            onClick={() => window.location.reload()}
          />
        </div>
        {isOpen && (
        <>
          <div className="flex flex-col space-y-2 mt-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition" onClick={() => router.push('/')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-9 2v12m-4-4h16" />
              </svg>
              <span>Accueil</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition" onClick={() => router.push('/short')}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                <path clipRule="evenodd" d="M18.45 8.851c1.904-1.066 2.541-3.4 1.422-5.214-1.119-1.814-3.57-2.42-5.475-1.355L5.55 7.247c-1.29.722-2.049 2.069-1.968 3.491.081 1.423.989 2.683 2.353 3.268l.942.404-1.327.742c-1.904 1.066-2.541 3.4-1.422 5.214 1.119 1.814 3.57 2.421 5.475 1.355l8.847-4.965c1.29-.722 2.049-2.068 1.968-3.49-.081-1.423-.989-2.684-2.353-3.269l-.942-.403 1.327-.743ZM10 14.567a.25.25 0 00.374.217l4.45-2.567a.25.25 0 000-.433l-4.45-2.567a.25.25 0 00-.374.216v5.134Z" fillRule="evenodd" ></path>
              </svg>
              <span>Short</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition" onClick={() => router.push('/abonnement')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                <path clipRule="evenodd" d="M4 4.5A1.5 1.5 0 015.5 3h13A1.5 1.5 0 0120 4.5H4Zm16.5 3h-17v11h17v-11ZM3.5 6A1.5 1.5 0 002 7.5v11A1.5 1.5 0 003.5 20h17a.5.5 0 00.5-.5v-11A.5.5 0 0020.5 8h-17Zm7.257 4.454a.5.5 0 00-.757.43v4.233a.5.5 0 00.757.429L15 13l-4.243-2.546Z"/>
              </svg>
              <span>Abonnements</span>
            </button>
            <br />
            <hr className="my-2 border-black" />
            <h3 className="px-4 py-2 text-gray-700">Vous</h3>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition" onClick={() => router.push('/historique')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                <path d="M14.203 4.83c-1.74-.534-3.614-.418-5.274.327-1.354.608-2.49 1.6-3.273 2.843H8.25c.414 0 .75.336.75.75s-.336.75-.75.75H3V4.25c0-.414.336-.75.75-.75s.75.336.75.75v2.775c.935-1.41 2.254-2.536 3.815-3.236 1.992-.894 4.241-1.033 6.328-.392 2.088.641 3.87 2.02 5.017 3.878 1.146 1.858 1.578 4.07 1.215 6.223-.364 2.153-1.498 4.1-3.19 5.48-1.693 1.379-3.83 2.095-6.012 2.016-2.182-.08-4.26-.949-5.849-2.447-1.588-1.499-2.578-3.523-2.784-5.697-.039-.412.264-.778.676-.817.412-.04.778.263.818.675.171 1.812.996 3.499 2.32 4.748 1.323 1.248 3.055 1.973 4.874 2.04 1.818.065 3.598-.532 5.01-1.681 1.41-1.15 2.355-2.773 2.657-4.567.303-1.794-.056-3.637-1.012-5.186-.955-1.548-2.44-2.697-4.18-3.231ZM12.75 7.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75v4.886l.314.224 3.5 2.5c.337.241.806.163 1.046-.174.241-.337.163-.806-.174-1.046l-3.186-2.276V7.5Z"/>
              </svg>
              <span>Historique</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"  onClick={() => router.push('/vos_videos')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                <path d="M3.5 5.5h17v13h-17v-13ZM2 5.5C2 4.672 2.672 4 3.5 4h17c.828 0 1.5.672 1.5 1.5v13c0 .828-.672 1.5-1.5 1.5h-17c-.828 0-1.5-.672-1.5-1.5v-13Zm7.748 2.927c-.333-.19-.748.05-.748.435v6.276c0 .384.415.625.748.434L16 12 9.748 8.427Z" />
              </svg>
              <span>Vos Vidéos</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition" onClick={() => router.push('/Liked')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                <path d="M14.813 5.018 14.41 6.5 14 8h5.192c.826 0 1.609.376 2.125 1.022.711.888.794 2.125.209 3.101L21 13l.165.413c.519 1.296.324 2.769-.514 3.885l-.151.202v.5c0 1.657-1.343 3-3 3H5c-1.105 0-2-.895-2-2v-8c0-1.105.895-2 2-2h2v.282c0-.834.26-1.647.745-2.325L12 1l1.1.472c1.376.59 2.107 2.103 1.713 3.546ZM7 10.5H5c-.276 0-.5.224-.5.5v8c0 .276.224.5.5.5h2v-9Zm10.5 9h-9V9.282c0-.521.163-1.03.466-1.453l3.553-4.975c.682.298 1.043 1.051.847 1.77l-.813 2.981c-.123.451-.029.934.255 1.305.284.372.725.59 1.192.59h5.192c.37 0 .722.169.954.459.32.399.357.954.094 1.393l-.526.876c-.241.402-.28.894-.107 1.33l.165.412c.324.81.203 1.73-.32 2.428l-.152.202c-.195.26-.3.575-.3.9v.5c0 .828-.672 1.5-1.5 1.5Z"/>
              </svg>
              <span>Vidéos &quot;J&apos;aime&quot;</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition" onClick={() => router.push('/Dis_like')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                <path d="M14.813 5.018 14.41 6.5 14 8h5.192c.826 0 1.609.376 2.125 1.022.711.888.794 2.125.209 3.101L21 13l.165.413c.519 1.296.324 2.769-.514 3.885l-.151.202v.5c0 1.657-1.343 3-3 3H5c-1.105 0-2-.895-2-2v-8c0-1.105.895-2 2-2h2v.282c0-.834.26-1.647.745-2.325L12 1l1.1.472c1.376.59 2.107 2.103 1.713 3.546ZM7 10.5H5c-.276 0-.5.224-.5.5v8c0 .276.224.5.5.5h2v-9Zm10.5 9h-9V9.282c0-.521.163-1.03.466-1.453l3.553-4.975c.682.298 1.043 1.051.847 1.77l-.813 2.981c-.123.451-.029.934.255 1.305.284.372.725.59 1.192.59h5.192c.37 0 .722.169.954.459.32.399.357.954.094 1.393l-.526.876c-.241.402-.28.894-.107 1.33l.165.412c.324.81.203 1.73-.32 2.428l-.152.202c-.195.26-.3.575-.3.9v.5c0 .828-.672 1.5-1.5 1.5Z"/>
                </svg>
              <span>Vidéos &quot;J&apos;aime pas&quot;</span>
            </button>
            <hr className="my-2 border-black" />
            <br />
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition" onClick={() => router.push('/parametre')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                <path d="m14.302 6.457-.668-.278L12.87 3.5h-1.737l-.766 2.68-.668.277c-.482.2-.934.463-1.344.778l-.575.44-2.706-.677-.868 1.504 1.938 2.003-.093.716c-.033.255-.05.514-.05.779 0 .264.017.524.05.779l.093.716-1.938 2.003.868 1.504 2.706-.677.575.44c.41.315.862.577 1.344.778l.668.278.766 2.679h1.737l.765-2.68.668-.277c.483-.2.934-.463 1.345-.778l.574-.44 2.706.677.869-1.504-1.938-2.003.092-.716c.033-.255.05-.514.05-.779 0-.264-.017-.524-.05-.779l-.092-.716 1.938-2.003-.869-1.504-2.706.677-.574-.44c-.41-.315-.862-.577-1.345-.778ZM15.5 12c0 1.933-1.567 3.5-3.5 3.5S8.5 13.933 8.5 12s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5ZM14 12c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2Z"/>
              </svg>
              <span>Paramètres</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition" onClick={() => router.push('/signaler')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                <path d="M6.379 17.5H19c.276 0 .5-.224.5-.5V5c0-.276-.224-.5-.5-.5H5c-.276 0-.5.224-.5.5v14.379l1.44-1.44.439-.439Zm-1.879 4-.033.033-.26.26-.353.353c-.315.315-.854.092-.854-.353V5c0-1.105.895-2 2-2h14c1.105 0 2 .895 2 2v12c0 1.105-.895 2-2 2H7l-2.5 2.5ZM12 6c.552 0 1 .448 1 1v4c0 .552-.448 1-1 1s-1-.448-1-1V7c0-.552.448-1 1-1Zm0 9.75c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25Z"/>
              </svg>
              <span>Signaler un problème</span>
            </button>
            <br />
            <hr className="my-2 border-black" />
            <div className="px-4 py-2 text-gray-700">
                <p className="cursor-pointer hover:underline" onClick={() => router.push('/presse_droits')}>Presse Droits d&apos;auteur</p>
              <p className="cursor-pointer hover:underline" onClick={() => router.push('/nous_contacter')}>Nous contacter</p>
              <p className="cursor-pointer hover:underline" onClick={() => router.push('/publicite')}>Publicité</p>
              <p className="cursor-pointer hover:underline" onClick={() => router.push('/condition')}>Conditions d&apos;utilisation</p>
              <p className="cursor-pointer hover:underline" onClick={() => router.push('/confidentialite')}>Confidentialité</p>
              <p className="cursor-pointer hover:underline" onClick={() => router.push('/reglement')}>Règles et sécurité</p>
              <p className="mt-4">&copy; 2025 LD-Makeur</p>
            </div>
          </div>
        </>
      )}
      </div>
    </>
  );
}

export default Navbar;