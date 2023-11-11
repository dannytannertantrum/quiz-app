'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Button } from '../atoms/Button';
import { QuizCompleteData } from '../../types/quizzes';
import { QuizCompleteMessage } from '../atoms/QuizCompleteMessage';

export const QuizReview = ({ quizCompleteData }: { quizCompleteData: QuizCompleteData }) => {
  const searchParams = useSearchParams();
  const quizIsComplete = searchParams?.get('complete');
  const safeScore = quizCompleteData.score ?? 0;

  if (quizIsComplete === 'true') {
    return (
      <div>
        <QuizCompleteMessage primaryTopic={quizCompleteData.primary_topic} score={safeScore} />
        <Button>Review Answers</Button>
        <Link href={'/topics'}>Home</Link>
      </div>
    );
  }

  return <h2>Hello!</h2>;
};
