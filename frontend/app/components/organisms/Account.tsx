'use client';

import { useContext } from 'react';

import { AuthContext } from '../../context/AuthContext';
import { Button } from '../atoms/Button';
import { BaseQuizData } from '../../types/quizzes';
import { parseSubtopics, transformDate } from '../../utils/helperFunctions';
import { QLink } from '../atoms/QLink';

export const Account = ({ quizzes }: { quizzes: BaseQuizData[] }) => {
  const { signOut, userState } = useContext(AuthContext);

  return (
    <>
      <h2>{userState?.data?.email}</h2>
      <h3>{transformDate(userState?.data?.created_at)}</h3>
      {/* All other table classes are in globals */}
      {/* Because we are using display: grid in mobile, we need to add roles for a11y */}
      {/* Captions need to be the first child of a table */}
      {/* https://youtube.com/watch?v=czZ1PvNW5hk */}
      <table role='table'>
        <thead role='rowgroup'>
          <tr role='row'>
            <th role='columnheader'>Topic</th>
            <th role='columnheader'>Subtopics</th>
            <th role='columnheader'>Completed</th>
            <th role='columnheader'>Score</th>
            <th role='columnheader'>Review</th>
          </tr>
        </thead>
        <tbody role='rowgroup'>
          {quizzes.map((quiz) => (
            <tr key={quiz.id} role='row'>
              <td role='cell' data-cell='Topic' className='capitalize'>
                {quiz.primary_topic}
              </td>
              <td role='cell' data-cell='Subtopics'>
                {parseSubtopics(quiz.subtopics)}
              </td>
              {/* https://nextjs.org/docs/messages/react-hydration-error#solution-3-using-suppresshydrationwarning */}
              <td role='cell' data-cell='Completed' suppressHydrationWarning>
                {transformDate(quiz.completed_at)}
              </td>
              <td role='cell' data-cell='Score'>
                {quiz.score}%
              </td>
              <td role='cell' data-cell='Review'>
                <QLink href={`/quizzes/${quiz.id}/review`} styles={{ fontSize: '1rem' }}>
                  Link
                </QLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button onClick={signOut} secondary>
        Sign out
      </Button>
    </>
  );
};
