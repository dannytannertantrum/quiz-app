'use client';

import { useContext, useRef, useState } from 'react';

import { AuthContext } from '../../context/AuthContext';
import { BaseUserData } from '../../types/users';
import { Button } from '../atoms/Button';
import { checkForDuplicateEmail } from '../../utils/helperFunctions';
import { Fieldset } from '../atoms/Fieldset';
import { QuizLoader } from '../atoms/QuizLoader';
import { TextInput } from '../molecules/TextInput';
import { useInput } from '../../hooks/fieldValidation';

export const AuthForm = ({ userEmails }: { userEmails: BaseUserData['email'][] }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const emailInput = useInput({ required: true, name: 'Email' }, '');
  const passwordInput = useInput(
    { required: true, name: 'Password', maxLength: 64, minLength: 8 },
    ''
  );
  const emailInputRef = useRef<HTMLInputElement>(null);
  const { createAccount, signIn, userState } = useContext(AuthContext);

  // We want to erase data when toggling to make it clear what action someone is taking
  const toggleSignIn = () => {
    setIsSignIn(!isSignIn);
    emailInput.reset();
    passwordInput.reset();
    emailInputRef && emailInputRef.current?.focus();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validation happens onBlur, so disaply errors if user tries to submit right away
    if (!emailInput.touched || !passwordInput.touched || emailInput.error || passwordInput.error) {
      emailInput.validate(emailInput.value);
      passwordInput.validate(passwordInput.value);
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const formJson = JSON.stringify(Object.fromEntries(formData.entries()));

    if (isSignIn) {
      signIn(form, formData);
    } else {
      const emailExists = checkForDuplicateEmail(userEmails, emailInput.value);
      if (emailExists) {
        emailInput.setError('A user with this email already exists; please use another email.');
        return;
      }
      createAccount(form, formJson);
    }
  };

  return (
    <form
      autoComplete='off'
      method='post'
      onSubmit={handleSubmit}
      className={`w-full bg-thunder-100 border-y border-thunder-800 p-7 shadow-lg shadow-thunder-500
      dark:bg-thunder-1000 dark:border-thunder-300 dark:shadow-thunder-800
      md:w-[500px] md:border md:rounded-xl`}
      noValidate
    >
      <h2 className='text-4xl mb-6'>{isSignIn ? 'Sign in' : 'Create account'}</h2>
      <Fieldset disabled={userState?.isLoading}>
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
          <Button type='submit' styles={{ minWidth: '150px' }}>
            {userState?.isLoading ? <QuizLoader center /> : 'Submit'}
          </Button>
          <Button type='button' onClick={toggleSignIn} secondary>
            {isSignIn ? 'Create a new account' : 'Already have an account? Sign in'}
          </Button>
        </div>
      </Fieldset>
      {userState?.error && (
        <p className='pt-5 text-rose-900 dark:text-rose-300'>
          There was a problem processing your request; please try again.
        </p>
      )}
    </form>
  );
};
