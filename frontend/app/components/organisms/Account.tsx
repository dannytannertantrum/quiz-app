'use client';

import { useContext } from 'react';

import { AuthContext } from '../../context/AuthContext';
import { BaseQuizData } from '../../types/quizzes';

export const Account = ({ quizzes }: { quizzes: BaseQuizData[] }) => {
  const { userState } = useContext(AuthContext);

  return <h2>{userState?.data?.email}</h2>;
};
