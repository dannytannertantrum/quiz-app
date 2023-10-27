'use client';

import { useState } from 'react';

import { BaseQuizData } from '../../types/quizzes';
import { QuizQuestionsAllData } from '../../types/quizQuestions';
import { Question } from '../molecules/Question';
import { updateQuizQuestion } from '../../api/quizQuestions';

/*
- Build the Question Carousel
  - Loop through and display sets of questions - DONE
  - Only show the active question and hide the others
    - Need to add "show" boolean prop to Question - DONE
    - Update style to be display: none - DONE
    - Set up Click Handler to capture answer and id - DONE
    - Pass handler down to Question molecule - DONE
    - COMMIT
    - Make the PUT request - DONE
      - Once the request makes the update, hide - DONE
  - Set up previous and next buttons
    - Next only shows up if a user has backtracked
    - Previous only shows up if the answer before has been submitted
  - Add animation
    - Do a simple 2s animation for now
    - Once animation is complete, update show/hide to only activate after that point
      - need useEffect (maybe useLayoutEffect?)
    - Do 
*/

const findActiveQuestionIndex = (quizQuestions: QuizQuestionsAllData[]) =>
  quizQuestions.findIndex((qq) => qq.user_answer == null);

export const Quiz = ({
  quiz,
  quizQuestions,
}: {
  quiz: BaseQuizData;
  quizQuestions: QuizQuestionsAllData[];
}) => {
  const [quizQuestionsState, setQuizQuestionsState] =
    useState<QuizQuestionsAllData[]>(quizQuestions);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(
    findActiveQuestionIndex(quizQuestionsState)
  );

  if (activeQuestionIndex === -1) {
    // router push happens here
    console.log('quiz complete!');
  }

  const handleSelectedAnswer = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    quizQuestionId: string,
    answerId: number
  ) => {
    const jsonRequestObject = JSON.stringify({ id: quizQuestionId, user_answer: answerId });
    try {
      const response = await updateQuizQuestion(quizQuestionId, jsonRequestObject);
      if (!(response instanceof Error)) {
        // Straight from React Docs
        // https://react.dev/learn/updating-arrays-in-state#updating-objects-inside-arrays
        const updatedQuestions = quizQuestionsState.map((qq) => {
          if (qq.id === quizQuestionId) {
            return { ...qq, user_answer: answerId };
          } else {
            return qq;
          }
        });
        const updatedIndex = findActiveQuestionIndex(updatedQuestions);

        setQuizQuestionsState(updatedQuestions);
        setActiveQuestionIndex(updatedIndex);
      }
    } catch (reason: unknown) {
      console.error('There was a problem updating the quiz question: ', reason);
    }
  };

  return (
    <ul className='text-center max-w-5xl [text-wrap:balance]'>
      {quizQuestions?.map((quizQuestion, index) => (
        <li
          key={quizQuestion.id}
          style={{ display: index === activeQuestionIndex ? 'block' : 'none' }}
        >
          <Question
            answer_options={quizQuestion.answer_options}
            handleSelectedAnswer={handleSelectedAnswer}
            id={quizQuestion.question_id}
            question={quizQuestion.question}
            quizQuestionId={quizQuestion.id}
          />
        </li>
      ))}
    </ul>
  );
};
