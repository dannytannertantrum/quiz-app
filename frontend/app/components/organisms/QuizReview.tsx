'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '../atoms/Button';
import { QuizCompleteData } from '../../types/quizzes';
import { QuizCompleteMessage } from '../atoms/QuizCompleteMessage';
import { ReviewQuestions } from './ReviewQuestions';

export const QuizReview = ({ quizCompleteData }: { quizCompleteData: QuizCompleteData }) => {
  const searchParams = useSearchParams();
  const quizIsComplete = searchParams?.get('complete');
  const safeScore = quizCompleteData.score ?? 0;
  const [showReview, setShowReview] = useState(false);

  if (quizIsComplete === 'true' && !showReview) {
    return (
      <Fragment>
        <QuizCompleteMessage primaryTopic={quizCompleteData.primary_topic} score={safeScore} />
        <div className='text-center'>
          <h3 className='text-xl text-indigo-950 dark:text-cyan-300'>Score: {safeScore}%</h3>
          <Button
            onClick={() => setShowReview(true)}
            styles={{ display: 'block', marginBlock: '1em' }}
          >
            Review Answers
          </Button>
          <Link
            className='bg-transparent underline underline-offset-4 decoration-2 text-outer-space-900 text-xl hover:text-outer-space-1000
            dark:text-outer-space-300 dark:hover:text-outer-space-200 transition-colors'
            href={'/topics'}
          >
            Home
          </Link>
        </div>
      </Fragment>
    );
  }

  return (
    <div>
      <h2 className='[font-size:_clamp(1.25rem,5vw,2.5rem)] [text-wrap:balance] capitalize'>
        Quiz: {quizCompleteData.primary_topic}
      </h2>
      <h3 className='text-xl text-indigo-950 dark:text-cyan-300'>Score: {safeScore}%</h3>
      <ReviewQuestions questions={quizCompleteData.questions_data} />
    </div>
  );
};
