import { cookies } from 'next/headers';
import type { Metadata } from 'next';

import { BASE_SERVER_URL, RESPONSE_ERROR } from '../../utils/constants';
import { BaseQuizData } from '../../types/quizzes';
import { QuizQuestionsAllData } from '../../types/quizQuestions';
import { Quiz } from '../../components/organisms/Quiz';

// Dynamic metadata
// https://nextjs.org/docs/app/building-your-application/optimizing/metadata#dynamic-metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const quiz: BaseQuizData = await fetch(`${BASE_SERVER_URL}/quizzes/${params.id}`, {
    headers: { Cookie: cookies().toString() },
  }).then((res) => res.json());

  return {
    title: `${
      quiz?.primary_topic?.charAt(0)?.toUpperCase() + quiz?.primary_topic?.slice(1)
    } | Quiz App`,
    description: 'You can do it!',
  };
}

export async function getQuizQuestions(id: string) {
  const response = await fetch(`${BASE_SERVER_URL}/quiz-questions/quiz/${id}`, {
    headers: { Cookie: cookies().toString() },
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(RESPONSE_ERROR);
  }
  const quizQuestions: QuizQuestionsAllData[] = await response.json();

  return quizQuestions;
}

export default async function Quizzes({ params }: { params: { id: string } }) {
  let quizQuestions: QuizQuestionsAllData[] | null = null;
  try {
    quizQuestions = await getQuizQuestions(params.id);
  } catch (reason: unknown) {
    console.error('There was a problem getting the quiz: ', reason);
  }

  if (quizQuestions === null) return <h2 className='text-3xl'>No quiz found</h2>;

  return <Quiz quizQuestions={quizQuestions} />;
}
