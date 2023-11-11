import { QuizCompleteData } from '../../types/quizzes';

export const ReviewQuestions = ({
  questions,
}: {
  questions: QuizCompleteData['questions_data'];
}) => {
  return <h2>{questions[0].question}</h2>;
};
