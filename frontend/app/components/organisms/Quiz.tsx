'use client';

import { BaseQuizData } from '../../types/quizzes';
import { QuizQuestionsAllData } from '../../types/quizQuestions';
import { Question } from '../molecules/Question';

/*
- Build the Question Carousel
  - Loop through and display sets of questions - DONE
  - Only show the active question and hide the others
    - Need to add "show" boolean prop to Question - DONE
    - Update style to be display: none - DONE
    - Set up Click Handler to capture answer and id - DONE
    - Pass handler down to Question molecule - DONE
    - COMMIT
    - Make the PUT request
      - Once the request makes the update, hide 
  - Set up previous and next buttons
    - Next only shows up if a user has backtracked
    - Previous only shows up if the answer before has been submitted
  - Add animation
    - Do a simple 2s animation for now
    - Once animation is complete, update show/hide to only activate after that point
      - need useEffect (maybe useLayoutEffect?)
    - Do 
*/

export const Quiz = ({
  quiz,
  quizQuestions,
}: {
  quiz: BaseQuizData;
  quizQuestions: QuizQuestionsAllData[];
}) => {
  const handleSelectedAnswer = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    questionId: string,
    answerId: number
  ) => {
    console.log('hello', questionId, answerId);
    // PUT request - answerId = user_answer
  };

  return (
    <ul className='text-center max-w-5xl [text-wrap:balance]'>
      {quizQuestions?.map((quizQuestion, index) => (
        <li key={quizQuestion.id} style={{ display: index === 0 ? 'block' : 'none' }}>
          <Question
            answer_options={quizQuestion.answer_options}
            handleSelectedAnswer={handleSelectedAnswer}
            id={quizQuestion.question_id}
            question={quizQuestion.question}
          />
        </li>
      ))}
    </ul>
  );
};
