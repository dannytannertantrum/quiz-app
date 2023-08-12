'use client';

import { useState } from 'react';

import { Label } from './components/atoms/Label';
import { TextInput } from './components/atoms/TextInput';

export default function Home() {
  const [inputValue, setInputValue] = useState('');

  const handleOnChange = (value: string): void => {
    setInputValue(value);
  };

  return (
    <main className='flex min-h-screen flex-col items-center gap-4 p-8'>
      <Label forAttribute='email' name='Email:'>
        <TextInput
          id='email'
          name='email'
          errorMessage='You are doing it wrong'
          handleOnChange={handleOnChange}
          type='password'
          value={inputValue}
        />
      </Label>
    </main>
  );
}
