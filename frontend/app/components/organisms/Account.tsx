'use client';

import { Fragment, useContext } from 'react';

import { Accordion } from '../molecules/Accordion';
import { AuthContext } from '../../context/AuthContext';
import { Button } from '../atoms/Button';
import { BaseQuizData } from '../../types/quizzes';
import { parseSubtopics, transformDate } from '../../utils/helperFunctions';
import { QLink } from '../atoms/QLink';

export const Account = ({ quizzes }: { quizzes: BaseQuizData[] }) => {
  const { signOut, userState } = useContext(AuthContext);

  return (
    <Fragment>
      <Accordion title='User Info'>
        <h3 className='text-lg mb-2'>
          <strong>Email: </strong>
          {userState?.data?.email}
        </h3>
        <h3 className='text-lg mb-4'>
          <strong>Member since: </strong>
          {transformDate(userState?.data?.created_at)}
        </h3>
      </Accordion>
      <Accordion title='Quiz History'>
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
      </Accordion>
      <Accordion title='Manage Account'>
        <p>Will complete this later</p>
      </Accordion>
      <Button onClick={signOut} secondary>
        Sign out
      </Button>
    </Fragment>
  );
};
