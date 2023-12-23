'use client';

import { Fragment, useContext } from 'react';

import { AuthContext } from '../../context/AuthContext';
import { Button } from '../atoms/Button';
import { QLink } from '../atoms/QLink';
import { QuizLoader } from '../atoms/QuizLoader';

export const TestAccountSignIn = () => {
  const { signInTest, userState } = useContext(AuthContext);

  return (
    <Fragment>
      <h1 className='text-4xl mb-3'>Welcome to QuizApp!</h1>
      <p className='text-lg leading-8 mb-6'>
        If you&apos;re tired of creating accounts, click the button below to sign in using a shared
        test account. If you&apos;re not sure why you&apos;re here...well...I can&apos;t help you
        with that, but check out what{' '}
        <QLink href='/about' styles={{ fontSize: '1.25rem' }}>
          this site is all about
        </QLink>
        !
      </p>
      <Button disabled={userState?.isLoading} styles={{ minWidth: '245px' }} onClick={signInTest}>
        {userState?.isLoading ? <QuizLoader center /> : 'Test Account Sign-in'}
      </Button>
    </Fragment>
  );
};
