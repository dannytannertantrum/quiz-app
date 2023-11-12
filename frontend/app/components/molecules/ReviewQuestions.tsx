import { QuizCompleteData } from '../../types/quizzes';

const getQuestionTwClasses = (
  answerOption: number,
  correctAnswer: number,
  userAnswer: number
): string => {
  let twClasses = 'my-4 text-lg sm:text-xl w-fit list-disc list-inside ';
  if (answerOption === correctAnswer) {
    twClasses += 'px-4 py-2 border-2 border-green-900 dark:border-green-400 list-none ';
  }
  if (userAnswer === answerOption && answerOption !== correctAnswer) {
    twClasses += 'text-amber-900 dark:text-amber-400';
  }

  return twClasses;
};

export const ReviewQuestions = ({
  questions,
}: {
  questions: QuizCompleteData['questions_data'];
}) => {
  return (
    <ul>
      {questions.map((question, index) => (
        <li className='mb-12' key={question.question_id}>
          <div className='flex gap-4 items-center'>
            <h4
              className={`text-xl sm:text-2xl ${
                question.correct_answer === question.user_answer
                  ? 'text-green-900 dark:text-green-400'
                  : 'text-amber-900 dark:text-amber-400'
              }`}
            >
              Q: {question.question}{' '}
            </h4>
            <span
              aria-labelledby={
                question.correct_answer === question.user_answer
                  ? 'You answered correctly'
                  : 'You answered incorrectly'
              }
              className='text-amber-900 dark:text-amber-400 text-xl sm:text-2xl'
            >
              {question.correct_answer === question.user_answer ? '✅' : 'X'}
            </span>
          </div>
          <ul className='ml-4'>
            {question.answer_options.map((answer, index) => (
              <li
                className={getQuestionTwClasses(
                  index + 1,
                  question.correct_answer,
                  question.user_answer
                )}
                key={answer.id}
              >
                {index + 1 === question.correct_answer ? 'A: ' : ''}
                {answer[`option_${index + 1}`]}
                {index + 1 === question.user_answer && index + 1 !== question.correct_answer
                  ? ' (X)'
                  : ''}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};
