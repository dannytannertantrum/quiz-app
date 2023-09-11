'use client';

import { useSearchParams } from 'next/navigation';

export const AuthRedirectMessage = () => {
  const searchParams = useSearchParams();
  const redirectParam = searchParams?.get('redirect');

  if (redirectParam) {
    return (
      <h1 className='mt-4 mx-4 [text-wrap:balance] text-center text-3xl text-rose-900 dark:text-rose-300'>
        Please sign in to view that page
      </h1>
    );
  }

  return null;
};
