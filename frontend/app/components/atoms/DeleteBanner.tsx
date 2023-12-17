'use client';

import { useEffect, useState } from 'react';

export const DeleteBanner = () => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (window && sessionStorage.getItem('quizapp-delete-account')) {
      setMessage(sessionStorage.getItem('quizapp-delete-account'));

      setTimeout(() => {
        // Remove from storage in case user creates another account and does not navigate away
        sessionStorage.removeItem('quizapp-delete-account');
      }, 10000);
    }
  }, []);

  if (!message) return null;

  return (
    <div className='bg-rose-300 dark:bg-rose-900 p-4 md:rounded-md md:mb-4'>
      <p className='text-xl'>{message}</p>
    </div>
  );
};
