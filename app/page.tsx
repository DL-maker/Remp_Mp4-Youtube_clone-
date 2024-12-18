import React from 'react';
import Image from 'next/image';
import ColumnOfVideo from "@/components/column_of_video";

export default function Home() {
  return (
    <div className="flex">  
      <div className="w-1/4 container mx-auto bg-gray-600 p-4 rounded-lg"> 
        <div className="max-w-xs rounded-t-lg flex justify-center items-center bg-gray-500">
          <AbonnementBoutton />
        </div>
        
        <div className="flex max-w-xs itemsStretch rounded-b-lg bg-gray-400 mb-4">
          <Image className="rounded-full w-[50px] h-[50px] mt-2 mb-2 mr-1 ml-2" src={"https://thispersondoesnotexist.com?" + new Date().getTime()}  alt="Profile" width={50} height={50}/>
          <Image className="max-w-xs mt-2 mb-2 mr-3 ml-1" src="/Video_indisponible.png" alt="Photo video" width={175} height={350} /><br/>
          <p className='justify-center items-center' >Titre : Shif ... Shif...</p>
        </div>
        
        <div className="max-w-xs rounded-t-lg flex justify-center items-center bg-gray-500">
          <StateBoutton />
        </div>
        
        <div className='flex max-w-xs justify-center items-center rounded-b-lg bg-gray-400'>
          <p>Vues : +...<br/>
          Likes : +...<br/>
          Commentaire: +...</p>
        </div>
        </div>
      
      <div className="flex-1 bg-white">
        <ColumnOfVideo />
      </div>
    </div>
  );
}

export function AbonnementBoutton() {
  return (
    <div className='bg-gray-500'>
      <button className="flex-1 px-4 py-2 text-center hover:bg-gray-200 rounded-md transition-colors duration-200 focus:outline-none flex">
        <span className="flex-1">Abonnement</span>
      </button>
    </div>
  );
}

export function StateBoutton() {
  return (
    <div>
      <div>
        <button className="flex-1 px-4 py-2 text-center hover:bg-gray-200 rounded-md transition-colors duration-200 focus:outline-none flex">
          <span className="flex-1">State</span>
        </button>
      </div>
    </div>
  );
}