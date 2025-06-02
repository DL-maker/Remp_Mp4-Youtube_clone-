'use client';

import React, { useState } from 'react';
import Navbar from "@/components/navbar";
import ColumnOfVideo from "@/components/column_of_video";
import Head from 'next/head';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  return (
    <><Head>
      <title>My Page Title</title> {/* Add title here */}
    </Head><div className="relative flex flex-col">
        <Navbar toggleColumn={toggleColumn} isOpen={isOpen} isLoggedIn={false} />
        <div className="flex">
          <div className="flex-1 bg-white">
            <ColumnOfVideo />
          </div>
        </div>
      </div></>
  );
}