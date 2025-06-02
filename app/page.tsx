'use client';

import React, { useState } from 'react';
import Navbar from "@/components/navbar";
import ColumnOfVideo from "@/components/column_of_video";
import Head from 'next/head';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Add your logout logic here, e.g., clear cookies, session, etc.
    setIsLoggedIn(false); // Update isLoggedIn state
  };

  return (
    <><Head>
      <title>My Page Title</title>
    </Head><div className="relative flex flex-col">
        <Navbar
          toggleColumn={toggleColumn}
          isOpen={isOpen}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout} // Pass the handleLogout function
        />
        <div className="flex">
          <div className="flex-1 bg-white">
            <ColumnOfVideo />
          </div>
        </div>
      </div></>
  );
}