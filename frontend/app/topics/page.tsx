import { cookies } from 'next/headers';
import { Fragment } from 'react';
import type { Metadata } from 'next';

import { BASE_SERVER_URL, RESPONSE_ERROR } from '../utils/constants';
import { BaseQuizData } from '../types/quizzes';
import { BaseTopicData } from '../types/topics';
import { TopicList } from '../components/organisms/TopicList';
import { WelcomeMessage } from '../components/atoms/WelcomeMessage';
import { IncompleteQuizList } from '@/components/atoms/IncompleteQuizList';

export const metadata: Metadata = {
  title: 'Topics | Quiz App',
  description: 'Select a topic!',
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

const getTopics = async () => {
  const response = await fetch(`${BASE_SERVER_URL}/topics/primary-topics`, {
    headers: { Cookie: cookies().toString() },
  });
  if (response.status === 404) return [];
  if (!response.ok) {
    throw new Error(RESPONSE_ERROR);
  }

  return await response.json();
};

export default async function Topics() {
  let primaryTopics: BaseTopicData[] = [];
  let quizzes: BaseQuizData[] = [];
  let incompleteQuizzes: BaseQuizData[] = [];
  try {
    [primaryTopics, quizzes] = await Promise.all([getTopics(), getQuizzes()]);
    incompleteQuizzes = quizzes.filter((quiz) => quiz.completed_at == null);
  } catch (error: any) {
    console.error('There was a problem getting primary topics and quizzes: ', error);
  }

  if (primaryTopics.length === 0) return <h2 className='text-3xl'>No topics found</h2>;

  return (
    <Fragment>
      <WelcomeMessage />
      <h2 className='text-4xl mb-3'>Select a topic</h2>
      <TopicList primaryTopics={primaryTopics} />
      {incompleteQuizzes.length > 0 && <IncompleteQuizList quizzes={incompleteQuizzes} />}
    </Fragment>
  );
}
