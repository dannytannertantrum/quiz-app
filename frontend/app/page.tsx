'use client';

import { useState } from 'react';

import { TextInput } from './components/atoms/TextInput';

export default function Home() {
  const [inputValue, setInputValue] = useState('');

  const handleOnChange = (value: string): void => {
    setInputValue(value);
  };

  return (
    <main className='flex min-h-screen flex-col items-center gap-4 p-8'>
      <h2 className='text-6xl'>Hello, World!</h2>
      <TextInput
        name='myInput'
        errorMessage='You are doing it wrong'
        handleOnChange={handleOnChange}
        type='password'
        value={inputValue}
      />
    </main>
  );
}
