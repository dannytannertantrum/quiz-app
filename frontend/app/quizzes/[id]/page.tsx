import { cookies } from 'next/headers';
import type { Metadata } from 'next';

import { BASE_SERVER_URL, RESPONSE_ERROR } from '../../utils/constants';
import { BaseQuizData } from '../../types/quizzes';

export const metadata: Metadata = {
  title: 'Your Quiz | Quiz App',
  description: 'You can do it!',
};

export async function getQuiz(id: string) {
  const response = await fetch(`${BASE_SERVER_URL}/quizzes/${id}`, {
    headers: { Cookie: cookies().toString() },
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(RESPONSE_ERROR);
  }
  const quiz: BaseQuizData = await response.json();

  return quiz;
}

export default async function Quizzes({ params }: { params: { id: string } }) {
  let quiz: BaseQuizData | null = null;
  try {
    quiz = await getQuiz(params.id);
  } catch (reason: unknown) {
    console.error('There was a problem getting the quiz: ', reason);
  }

  if (quiz === null) return <h2 className='text-3xl'>No quiz found</h2>;

  return (
    <>
      <h2>Quiz!</h2>
      <h3>{quiz?.primary_topic}</h3>
    </>
  );
}
