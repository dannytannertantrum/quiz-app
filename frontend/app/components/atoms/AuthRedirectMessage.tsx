'use client';

import { useSearchParams } from 'next/navigation';

export const AuthRedirectMessage = () => {
  const searchParams = useSearchParams();
  const redirectParam = searchParams?.get('redirect');

  if (redirectParam) {
    return (
      <h2 className='mt-4 px-7 [text-wrap:balance] text-center text-3xl text-rose-900 dark:text-rose-300 md:mt-0 md:mb-8'>
        Please sign in to view that page
      </h2>
    );
  }

  return null;
};
