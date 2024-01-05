import { cookies } from 'next/headers';
import type { Metadata } from 'next';

import { BASE_SERVER_URL, RESPONSE_ERROR } from '../utils/constants';
import { BaseQuizData } from '../types/quizzes';
import { Account } from '@/components/organisms/Account';

export const metadata: Metadata = {
  title: 'My Account | Quiz App',
  description: 'View your quiz history and account settings',
};

const getQuizzes = async () => {
  const response = await fetch(`${BASE_SERVER_URL}/quizzes/user/me`, {
    headers: { Cookie: cookies().toString() },
  });
  if (response.status === 404) return [];
  if (!response.ok) {
    throw new Error(RESPONSE_ERROR);
  }

  return await response.json();
};

export default async function AccountPage() {
  // Get quizzes - user info already there
  let quizzes: BaseQuizData[] = [];
  try {
    quizzes = await getQuizzes();
    quizzes = quizzes.filter((quiz) => quiz.completed_at != null);
  } catch (error: any) {
    console.error('There was a problem getting quizzes: ', error);
  }

  return <Account quizzes={quizzes} />;
}
