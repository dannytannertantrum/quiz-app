'use client';

import { SignIn } from './components/SignIn';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center gap-4 p-8'>
      <SignIn />
    </main>
  );
}
