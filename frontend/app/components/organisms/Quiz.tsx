'use client';

import { AnimationEvent, useState } from 'react';

import { QuizNavButton } from '../atoms/QuizNavButton';
import { QuizQuestionsAllData } from '../../types/quizQuestions';
import { Question } from '../molecules/Question';
import { updateQuizQuestion } from '../../api/quizQuestions';

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
  const [shouldQuestionAnimate, setShouldQuestionAnimate] = useState(true);
  const isNavActive = getActiveNav(quizQuestionsState);

  if (quizComplete) {
    // reouter push here
  }

  const handleNavClick = (direction: 'previous' | 'next') => {
    if (direction === 'previous') {
      setActiveQuestionIndex(activeQuestionIndex - 1);
    } else {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    }
    setShouldQuestionAnimate(false);
  };

  const handleSelectedAnswer = async (
    event: AnimationEvent<HTMLButtonElement>,
    quizQuestionId: string,
    answerId: number
  ) => {
    event.stopPropagation(); // This doesn't seem to be working
    setShouldQuestionAnimate(true);

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
      {quizQuestionsState?.map(
        (quizQuestion, index) =>
          index === activeQuestionIndex && (
            <li key={quizQuestion.id}>
              <Question
                answer_options={quizQuestion.answer_options}
                handleSelectedAnswer={handleSelectedAnswer}
                question={quizQuestion.question}
                quizQuestionId={quizQuestion.id}
                shouldAnimate={shouldQuestionAnimate}
                user_answer={quizQuestion.user_answer}
              />
              <div
                className='flex justify-between max-w-2xl mx-auto'
                style={{
                  display: isNavActive ? 'flex' : 'none',
                }}
              >
                <QuizNavButton
                  direction='previous'
                  handleNavClick={() => handleNavClick('previous')}
                  styles={{
                    display:
                      activeQuestionIndex - 1 >= 0 &&
                      quizQuestionsState[activeQuestionIndex - 1]?.user_answer
                        ? 'flex'
                        : 'none',
                  }}
                >
                  Previous
                </QuizNavButton>
                <QuizNavButton
                  direction='next'
                  handleNavClick={() => handleNavClick('next')}
                  styles={{
                    display:
                      activeQuestionIndex + 1 < quizQuestionsState.length &&
                      quizQuestionsState[activeQuestionIndex].user_answer !== null
                        ? 'flex'
                        : 'none',
                  }}
                  twClasses='ml-auto'
                >
                  Next
                </QuizNavButton>
              </div>
            </li>
          )
      )}
    </ul>
  );
};
