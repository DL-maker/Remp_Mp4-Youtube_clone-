'use client';

import React from 'react';
import { MdSubscriptions, MdOutlineSubscriptions } from "react-icons/md";
import { useSubscription } from '@/app/_lib/useSubscription';

interface SubscribeButtonProps {
  username: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function SubscribeButton({ username, className = '', size = 'medium' }: SubscribeButtonProps) {
  const { isSubscribed, isLoading, toggleSubscription } = useSubscription(username);

  const handleSubscribe = async () => {
    if (!username || isLoading) return;
    
    const result = await toggleSubscription();
    if (result && !result.success) {
      alert(result.error || 'Erreur lors de l\'abonnement');
    }
  };

  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };

  const iconSizes = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  };

  return (
    <button
      className={`flex items-center text-white rounded-lg font-bold shadow-md transition ${
        isSubscribed
          ? "bg-gray-500 hover:bg-gray-600"
          : "bg-red-600 hover:bg-red-700"
      } ${sizeClasses[size]} ${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={handleSubscribe}
      disabled={isLoading}
    >
      {isSubscribed ? (
        <>
          <MdSubscriptions className={`${iconSizes[size]} mr-2`} />
          Abonné(e)
        </>
      ) : (
        <>
          <MdOutlineSubscriptions className={`${iconSizes[size]} mr-2`} />
          S&apos;abonner
        </>
      )}
    </button>
  );
}
