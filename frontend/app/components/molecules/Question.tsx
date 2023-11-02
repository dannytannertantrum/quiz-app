'use client';

import { AnimationEvent, MouseEvent, useState } from 'react';

import { BaseQuestionData } from '../../types/questions';
import { Fieldset } from '../atoms/Fieldset';
import { QuizQuestionsPutRequest } from '../../types/quizQuestions';

export interface QuestionProps {
  answer_options: BaseQuestionData['answer_options'];
  handleSelectedAnswer: (
    event: AnimationEvent<HTMLButtonElement>,
    questionId: string,
    answerId: number
  ) => void;
  primaryTopic: string;
  question: BaseQuestionData['question'];
  quizQuestionId: QuizQuestionsPutRequest['id'];
  shouldAnimate: boolean;
  subtopic: string;
  user_answer: number | null;
  disabled?: boolean;
}

export const Question = ({
  answer_options,
  disabled = false,
  handleSelectedAnswer,
  primaryTopic,
  question,
  quizQuestionId,
  shouldAnimate = true,
  subtopic,
  user_answer,
}: QuestionProps) => {
  const [disabledFieldset, setDisabledFieldset] = useState(disabled);

  const handleOnClick = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    event.currentTarget.classList.add('answerSelected');
    setDisabledFieldset(true);
  };

  return (
    <div
      className={
        disabledFieldset ? 'animateQuestionFlyoff' : shouldAnimate ? 'animateQuestionAppear' : ''
      }
    >
      <h3 className='text-md sm:text-xl capitalize mb-4 text-indigo-950 dark:text-cyan-300'>{`${primaryTopic} | ${subtopic}`}</h3>
      <Fieldset legend={question} disabled={disabledFieldset} twClasses='max-w-xl'>
        <ul>
          {answer_options?.map((answer) => (
            <li key={answer.id} className='block relative w-auto mb-4 max-w-xl mx-auto'>
              <button
                autoFocus={answer.id === user_answer}
                className={`relative isolate capitalize cursor-pointer p-4 rounded-md w-full text-xl sm:text-2xl text-left transition-all
              bg-outer-space-300 enabled:hover:bg-outer-space-200 focus-visible:bg-outer-space-100 text-outer-space-900 enabled:hover:text-outer-space-950
              focus-visible:text-outer-space-950 shadow-md shadow-outer-space-500 
              dark:bg-outer-space-800 dark:enabled:hover:bg-outer-space-900 dark:focus-visible:bg-outer-space-900 dark:text-outer-space-300
              dark:enabled:hover:text-outer-space-100 dark:focus-visible:text-outer-space-100 
              dark:shadow-outer-space-950 after:absolute after:-z-10 after:inset-0 after:rounded-md after:origin-left after:scale-x-0 after:scale-y-100 ${
                answer.id === user_answer
                  ? `shadow-inner enabled:text-outer-space-950 enabled:bg-outer-space-100 shadow-outer-space-500
                dark:enabled:text-outer-space-100 dark:enabled:bg-outer-space-1000 dark:shadow-outer-space-1000
                `
                  : ''
              }`}
                onClick={handleOnClick}
                onAnimationEnd={(event: AnimationEvent<HTMLButtonElement>) =>
                  handleSelectedAnswer(event, quizQuestionId, answer.id)
                }
              >
                {answer[`option_${answer.id}`]}
              </button>
            </li>
          ))}
        </ul>
      </Fieldset>
    </div>
  );
};
