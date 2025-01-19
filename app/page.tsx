'use client';

import React, { useState } from 'react';
import Navbar from "@/components/navbar";
import ColumnOfVideo from "@/components/column_of_video";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative flex flex-col">
      <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
      <div className="flex">
        <div className="flex-1 bg-white">
          <ColumnOfVideo />
        </div>
      </div>
    </div>
  );
}