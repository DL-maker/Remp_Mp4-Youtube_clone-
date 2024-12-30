import React from 'react';
import Image from 'next/image';
import ColumnOfVideo from "@/components/column_of_video";
import { verifySession } from "@/app/_lib/session";

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

// Puis notre composant de page
export default async function Home() {
  const session = await verifySession()
  
  if (typeof session === 'object' && 'role' in session) {
    const role = session.role;
    if (role === 'LD_ADMIN') {
    }
  }

  return (
    <div className="flex">
      <div className="w-1/4 container mx-auto bg-gray-600 p-4 rounded-lg">
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
      </div>

      <div className="flex-1 bg-white">
        <ColumnOfVideo />
      </div>
    </div>
  );
}