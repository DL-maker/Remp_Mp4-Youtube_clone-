import { useState, useEffect } from 'react';

export function useSubscription(username: string) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier le statut d'abonnement au chargement
  useEffect(() => {
    if (!username) return;
    
    const checkSubscription = async () => {
      try {
        const response = await fetch(`/api/subscriptions/status?username=${encodeURIComponent(username)}`);
        if (response.ok) {
          const data = await response.json();
          setIsSubscribed(data.isSubscribed);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'abonnement:', error);
      }
    };

    checkSubscription();
  }, [username]);

  const toggleSubscription = async () => {
    if (!username || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/subscriptions', {
        method: isSubscribed ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channelUsername: username }),
      });

      if (response.ok) {
        setIsSubscribed(!isSubscribed);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Erreur lors de la gestion de l\'abonnement:', error);
      return { success: false, error: 'Erreur réseau' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSubscribed,
    isLoading,
    toggleSubscription
  };
}
