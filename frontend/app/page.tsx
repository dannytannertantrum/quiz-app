'use client';

import { useState } from 'react';

import { Button } from './components/atoms/Button';
import { Fieldset } from './components/atoms/Fieldset';
import { Label } from './components/atoms/Label';
import { TextInput } from './components/atoms/TextInput';

export default function Home() {
  const [inputValue, setInputValue] = useState('');

  const handleOnChange = (value: string): void => {
    setInputValue(value);
  };

  return (
    <main className='flex min-h-screen flex-col items-center gap-4 p-8'>
      <Fieldset>
        <Label forAttribute='email'>
          Password
          <TextInput
            id='password'
            name='password'
            errorMessage='You are doing it wrong'
            handleOnChange={handleOnChange}
            type='password'
            value={inputValue}
          />
        </Label>
        <Button>Click me</Button>
      </Fieldset>
    </main>
  );
}
