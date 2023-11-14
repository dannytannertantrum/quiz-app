'use client';

import { useContext } from 'react';

import { AuthContext } from '../../context/AuthContext';
import { Button } from '../atoms/Button';
import { BaseQuizData } from '../../types/quizzes';

export const Account = ({ quizzes }: { quizzes: BaseQuizData[] }) => {
  const { signOut, userState } = useContext(AuthContext);

  return (
    <>
      <Button onClick={signOut} secondary>
        Sign out
      </Button>
      <h2>{userState?.data?.email}</h2>
    </>
  );
};
