'use client';

import { useSearchParams } from 'next/navigation';

export const WelcomeMessage = () => {
  const welcomeParam = useSearchParams().get('welcome');

  if (welcomeParam) {
    return (
      <h1 className='mt-4 mx-4 [text-wrap:balance] text-center text-4xl text-outer-space-900 dark:text-outer-space-300'>
        Thank you for joining QuizApp!
      </h1>
    );
  }

  return null;
};
