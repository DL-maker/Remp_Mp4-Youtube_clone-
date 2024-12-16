import React from 'react';
export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <img 
            src="/Logo_light_mode.png" 
            alt="Logo" 
            className="h-10 w-auto"
          />
          
          <div className="flex items-center space-x-4">
            <input 
              type="text" 
              placeholder="Recherche" 
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <img 
              src="/Photo_profile_light_mode.png" 
              alt="Profile" 
              className="rounded-full h-10 w-10 object-cover"
            />
          </div>
        </div>

        
      </div>
    </nav>
  );
}