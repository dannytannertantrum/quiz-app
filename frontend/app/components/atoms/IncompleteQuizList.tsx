'use client';

import { Fragment, useEffect, useState } from 'react';

import { BaseQuizData } from '../../types/quizzes';
import { QLink } from './QLink';
import { transformDate } from '../../utils/helperFunctions';
import { QuizLoader } from './QuizLoader';

interface IncompleteQuizListProps {
  quizzes: BaseQuizData[];
}

export const IncompleteQuizList = ({ quizzes }: IncompleteQuizListProps) => {
  const [formattedDates, setFormattedDates] = useState<BaseQuizData['created_at'][] | []>([]);

  useEffect(() => {
    const getDates = quizzes.map((quiz) => transformDate(quiz.created_at));
    setFormattedDates(getDates);
  }, [quizzes]);

  if (formattedDates.length < 1) return <QuizLoader styles={{ fontSize: '4rem' }} />;

  return (
    <Fragment>
      <h3 className='text-3xl'>--- OR ---</h3>
      <ul>
        {quizzes.map((quiz, index) => (
          <li key={quiz.id}>
            <QLink href={`/quizzes/${quiz.id}`}>Resume quiz from {formattedDates[index]}</QLink>
          </li>
        ))}
      </ul>
    </Fragment>
  );
};
