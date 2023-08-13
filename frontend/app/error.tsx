'use client';

import { useEffect } from 'react';

import { Button } from './components/atoms/Button';

// https://nextjs.org/docs/app/building-your-application/routing/error-handling
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // In a real app, log to Sentry or another error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className='flex flex-col items-center gap-4 p-8'>
      <h2 className='text-4xl'>Something went wrong!</h2>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </main>
  );
}
