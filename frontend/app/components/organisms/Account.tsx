'use client';

import { Fragment, useContext, useState } from 'react';

import { Accordion } from '../molecules/Accordion';
import { AuthContext } from '../../context/AuthContext';
import { Button } from '../atoms/Button';
import { BaseQuizData } from '../../types/quizzes';
import { DeleteUserAccount } from '../molecules/DeleteUserAccount';
import { parseSubtopics, transformDate } from '../../utils/helperFunctions';
import { QLink } from '../atoms/QLink';

interface sortMap {
  topic: (a: BaseQuizData, b: BaseQuizData) => 1 | -1;
  topicDesc: (a: BaseQuizData, b: BaseQuizData) => 1 | -1;
  subtopic: (a: BaseQuizData, b: BaseQuizData) => 1 | -1;
  subtopicDesc: (a: BaseQuizData, b: BaseQuizData) => 1 | -1;
  completed: (a: BaseQuizData, b: BaseQuizData) => 1 | -1;
  completedDesc: (a: BaseQuizData, b: BaseQuizData) => 1 | -1;
  score: (a: BaseQuizData, b: BaseQuizData) => 1 | -1;
  scoreDesc: (a: BaseQuizData, b: BaseQuizData) => 1 | -1;
}

const sortMap: sortMap = {
  topic: (a, b) => (a.primary_topic < b.primary_topic ? -1 : 1),
  topicDesc: (a, b) => (a.primary_topic > b.primary_topic ? -1 : 1),
  subtopic: (a, b) => (a.subtopics < b.subtopics ? -1 : 1),
  subtopicDesc: (a, b) => (a.subtopics > b.subtopics ? -1 : 1),
  completed: (a, b) =>
    a.completed_at && b.completed_at && a.completed_at < b.completed_at ? -1 : 1,
  completedDesc: (a, b) =>
    a.completed_at && b.completed_at && a.completed_at > b.completed_at ? -1 : 1,
  score: (a, b) => (a.score && b.score && a.score < b.score ? -1 : 1),
  scoreDesc: (a, b) => (a.score && b.score && a.score > b.score ? -1 : 1),
};

const initialSortByCompletedDate = (quizzes: BaseQuizData[]) => {
  return quizzes.sort(sortMap['completedDesc']);
};

export const Account = ({ quizzes }: { quizzes: BaseQuizData[] }) => {
  const { signOut, userState } = useContext(AuthContext);
  const [sortedQuizzes, setSortedQuizzes] = useState(initialSortByCompletedDate(quizzes));
  const [sortBy, setSortBy] = useState<keyof sortMap>('completedDesc');

  const handleSortBy = (sortByKey: keyof sortMap) => {
    setSortBy(sortByKey);
    setSortedQuizzes([...sortedQuizzes].sort(sortMap[sortByKey]));
  };

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
        {sortedQuizzes?.length === 0 ? (
          <p className='text-xl mb-4'>
            Nothing here yet. Go <QLink href='/topics'>take a quiz</QLink>!
          </p>
        ) : (
          <table role='table'>
            <thead role='rowgroup'>
              <tr role='row'>
                <th role='columnheader'>
                  <button onClick={() => handleSortBy(sortBy === 'topic' ? 'topicDesc' : 'topic')}>
                    Topic{sortBy === 'topic' ? ' ⬆️' : sortBy === 'topicDesc' ? ' ⬇️' : ''}
                  </button>
                </th>
                <th role='columnheader'>
                  <button
                    onClick={() =>
                      handleSortBy(sortBy === 'subtopic' ? 'subtopicDesc' : 'subtopic')
                    }
                  >
                    Subtopics
                    {sortBy === 'subtopic' ? ' ⬆️' : sortBy === 'subtopicDesc' ? ' ⬇️' : ''}
                  </button>
                </th>
                <th role='columnheader'>
                  <button
                    onClick={() =>
                      handleSortBy(sortBy === 'completed' ? 'completedDesc' : 'completed')
                    }
                  >
                    Completed
                    {sortBy === 'completed' ? ' ⬆️' : sortBy === 'completedDesc' ? ' ⬇️' : ''}
                  </button>
                </th>
                <th role='columnheader'>
                  <button onClick={() => handleSortBy(sortBy === 'score' ? 'scoreDesc' : 'score')}>
                    Score{sortBy === 'score' ? ' ⬆️' : sortBy === 'scoreDesc' ? ' ⬇️' : ''}
                  </button>
                </th>
                <th role='columnheader'>Review</th>
              </tr>
            </thead>
            <tbody role='rowgroup'>
              {sortedQuizzes.map((quiz) => (
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
        )}
      </Accordion>
      <Accordion title='Manage Account'>
        <DeleteUserAccount />
      </Accordion>
      <Button onClick={signOut} secondary>
        Sign out
      </Button>
    </Fragment>
  );
};
