'use client';

import { BaseQuestionData } from '../../types/questions';
import { Fieldset } from '../atoms/Fieldset';
import { QuizQuestionsPutRequest } from '../../types/quizQuestions';

export interface QuestionProps {
  answer_options: BaseQuestionData['answer_options'];
  handleSelectedAnswer: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    questionId: string,
    answerId: number
  ) => void;
  id: BaseQuestionData['id'];
  question: BaseQuestionData['question'];
  quizQuestionId: QuizQuestionsPutRequest['id'];
  disabled?: boolean;
}

export const Question = ({
  answer_options,
  disabled = false,
  handleSelectedAnswer,
  id,
  question,
  quizQuestionId,
}: QuestionProps) => {
  return (
    <Fieldset legend={question} disabled={disabled}>
      <ul>
        {answer_options?.map((answer) => (
          <li key={answer.id} className='block w-auto mb-4 max-w-2xl mx-auto'>
            <button
              className={`capitalize cursor-pointer p-4 rounded-md w-full text-2xl text-left transition-all disabled:cursor-not-allowed
              bg-outer-space-300 enabled:hover:bg-outer-space-200 focus-visible:bg-outer-space-200 text-outer-space-900 enabled:hover:text-outer-space-950
              focus-visible:text-outer-space-950 shadow-md shadow-outer-space-500 disabled:bg-slate-300 disabled:border-slate-500
              dark:bg-outer-space-800 dark:enabled:hover:bg-outer-space-700 dark:focus-visible:bg-outer-space-700 dark:text-outer-space-300
              dark:enabled:hover:text-outer-space-100 dark:focus-visible:text-outer-space-100 dark:disabled:bg-slate-500 dark:disabled:border-slate-300
              dark:shadow-outer-space-950 enabled:active:scale-[0.98]`}
              onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                handleSelectedAnswer(event, quizQuestionId, answer.id)
              }
            >
              {answer[`option_${answer.id}`]}
            </button>
          </li>
        ))}
      </ul>
    </Fieldset>
  );
};
