'use client';

import { useState } from 'react';

import { QuizQuestionsAllData } from '../../types/quizQuestions';
import { Question } from '../molecules/Question';
import { updateQuizQuestion } from '../../api/quizQuestions';

/*
  - Set up previous and next buttons
    - Next only shows up if a user has backtracked
    - Previous only shows up if the answer before has been submitted
  - Add animation
    - Do a simple 2s animation for now
    - Once animation is complete, update show/hide to only activate after that point
      - need useEffect (maybe useLayoutEffect?)
    - Do 
*/

const getActiveNav = (quizQuestions: QuizQuestionsAllData[]) => {
  return quizQuestions.some((val) => val.user_answer !== null);
};

const findActiveQuestionIndex = (quizQuestions: QuizQuestionsAllData[]) =>
  quizQuestions.findIndex((qq) => qq.user_answer === null);

export const Quiz = ({ quizQuestions }: { quizQuestions: QuizQuestionsAllData[] }) => {
  const [quizQuestionsState, setQuizQuestionsState] =
    useState<QuizQuestionsAllData[]>(quizQuestions);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(
    findActiveQuestionIndex(quizQuestionsState)
  );
  const [quizComplete, setQuizComplete] = useState(false);
  const isNavActive = getActiveNav(quizQuestionsState);

  if (quizComplete) {
    // router push happens here within use effect
    return;
  }

  const handleSelectedAnswer = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    quizQuestionId: string,
    answerId: number
  ) => {
    // If answer is already selected and it's the same, just bump the activeIndex don't make a request
    const questionAlreadyAnswered =
      quizQuestionsState.find((qq) => qq.id === quizQuestionId)?.user_answer === answerId;

    if (questionAlreadyAnswered) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
      return;
    }

    const jsonRequestObject = JSON.stringify({ id: quizQuestionId, user_answer: answerId });
    try {
      const response = await updateQuizQuestion(quizQuestionId, jsonRequestObject);
      if (!(response instanceof Error)) {
        // Straight from React Docs
        // https://react.dev/learn/updating-arrays-in-state#updating-objects-inside-arrays
        setQuizQuestionsState(
          quizQuestionsState.map((qq) => {
            if (qq.id === quizQuestionId) {
              return { ...qq, user_answer: answerId };
            } else {
              return qq;
            }
          })
        );
        if (activeQuestionIndex + 1 === quizQuestionsState.length) {
          setQuizComplete(true);
          return;
        }
        setActiveQuestionIndex(activeQuestionIndex + 1);
      }
    } catch (reason: unknown) {
      console.error('There was a problem updating the quiz question: ', reason);
    }
  };

  if (activeQuestionIndex === -1 || quizComplete) return <h2>Looks like this quiz is finished!</h2>;

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
          <div
            className='flex justify-between max-w-2xl mx-auto'
            style={{
              display: isNavActive ? 'flex' : 'none',
            }}
          >
            <button
              onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
              style={{
                display:
                  activeQuestionIndex - 1 >= 0 &&
                  quizQuestionsState[activeQuestionIndex - 1]?.user_answer
                    ? 'inline-block'
                    : 'none',
              }}
            >
              Back
            </button>
            <button
              className='ml-auto'
              onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
              style={{
                display:
                  activeQuestionIndex + 1 < quizQuestionsState.length &&
                  quizQuestionsState[activeQuestionIndex].user_answer !== null
                    ? 'inline-block'
                    : 'none',
              }}
            >
              Forward
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
