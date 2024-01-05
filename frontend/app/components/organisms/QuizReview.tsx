'use client';

import { Fragment, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Button } from '../atoms/Button';
import { QuizCompleteData } from '../../types/quizzes';
import { QuizCompleteMessage } from '../atoms/QuizCompleteMessage';
import { QLink } from '../atoms/QLink';
import { ReviewQuestions } from '../molecules/ReviewQuestions';

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
          <QLink href={'/topics'}>Home</QLink>
        </div>
      </Fragment>
    );
  }

  return (
    <div>
      <h2 className='[font-size:_clamp(1.25rem,5vw,2.5rem)] [text-wrap:balance] capitalize'>
        Quiz: {quizCompleteData.primary_topic}
      </h2>
      <h3 className='text-lg text-indigo-950 dark:text-cyan-300 mb-4'>Score: {safeScore}%</h3>
      <hr className='mb-4 border-thunder-900 dark:border-thunder-700' />
      <ReviewQuestions questions={quizCompleteData.questions_data} />
      <hr />
      <div className='pt-8 flex gap-8 justify-between'>
        <QLink href={'/account'}>&lt; Back to Account</QLink>
        <QLink href={'/topics'}>Return home</QLink>
      </div>
    </div>
  );
};
