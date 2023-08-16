'use client';

import { useRef, useState } from 'react';

import { Button } from '../atoms/Button';
import { Fieldset } from '../atoms/Fieldset';
import { TextInput } from '../molecules/TextInput';
import { FieldValidationProperties, useInput } from '../../hooks/fieldValidation';

const baseValidationProperties: Pick<FieldValidationProperties, 'required'> = {
  required: true,
};

export const AuthForm = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const emailInput = useInput({ ...baseValidationProperties, name: 'Email' }, '');
  const passwordInput = useInput(
    { ...baseValidationProperties, name: 'Password', maxLength: 64, minLength: 8 },
    ''
  );
  const emailInputRef = useRef<HTMLInputElement>(null);

  const toggleSignIn = () => {
    setIsSignIn(!isSignIn);
    emailInput.reset();
    passwordInput.reset();
    emailInputRef && emailInputRef.current?.focus();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    emailInput.validate(emailInput.value);
    passwordInput.validate(passwordInput.value);
    if (emailInput.error || passwordInput.error) return;

    // const form = event.currentTarget;
    // const formData = new FormData(form);
  };

  return (
    <form
      autoComplete='off'
      method='post'
      onSubmit={handleSubmit}
      className={`w-full bg-thunder-100 border-y border-thunder-800 p-7 shadow-lg shadow-thunder-500
      dark:bg-thunder-1000 dark:border-thunder-300 dark:shadow-thunder-800
      md:w-auto md:min-w-[500px] md:border md:rounded-xl`}
      noValidate
    >
      <h2 className='text-4xl mb-6'>{isSignIn ? 'Sign in' : 'Create account'}</h2>
      <Fieldset>
        <TextInput
          errorMessage={emailInput.error}
          handleOnBlur={emailInput.handleBlur}
          handleOnChange={emailInput.handleChange}
          id='email'
          label='Email address'
          name='username' // 'username' is the expected key for the OAUTH spec
          placeholder='Email address'
          inputref={emailInputRef}
          type='email'
          value={emailInput.value}
        />
        <TextInput
          errorMessage={passwordInput.error}
          handleOnBlur={passwordInput.handleBlur}
          handleOnChange={passwordInput.handleChange}
          id='password'
          label='Password'
          maxlength={64}
          minlength={8}
          name='password'
          placeholder='Password'
          type='password'
          value={passwordInput.value}
        />
        <div className='flex flex-col gap-4 justify-between md:flex-row'>
          <Button type='submit'>Submit</Button>
          <Button type='button' onClick={toggleSignIn} secondary>
            {isSignIn ? 'Create a new account' : 'Already have an account? Sign in'}
          </Button>
        </div>
      </Fieldset>
    </form>
  );
};
