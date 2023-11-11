import { cookies } from 'next/headers';

import { BASE_SERVER_URL, RESPONSE_ERROR } from '../../../utils/constants';
import { QuizCompleteData } from '../../../types/quizzes';
import { QuizReview } from '../../../components/organisms/QuizReview';

export async function getQuizReviewData(id: string) {
  const response = await fetch(`${BASE_SERVER_URL}/quizzes/${id}/review`, {
    headers: { Cookie: cookies().toString() },
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(RESPONSE_ERROR);
  }
  const quiz: QuizCompleteData = await response.json();
  return quiz;
}

export default async function QuizReviewPage({ params }: { params: { id: string } }) {
  let quizCompleteData: QuizCompleteData | null = null;
  try {
    quizCompleteData = await getQuizReviewData(params.id);
  } catch (reason: unknown) {
    console.error('There was a problem getting the quiz review data: ', reason);
  }

  if (quizCompleteData === null) return <h2 className='text-3xl'>No quiz found</h2>;

  return <QuizReview quizCompleteData={quizCompleteData} />;
}
