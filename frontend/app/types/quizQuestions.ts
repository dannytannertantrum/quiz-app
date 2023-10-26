import { AnswerOptions } from './questions';

export interface QuizQuestions {
  // all strings are UUIDs
  id: string;
  question_id: string;
  quiz_id: string;
  user_answer: number;
}

export interface QuizQuestionsAllData extends QuizQuestions {
  question: string;
  answer_options: AnswerOptions[];
  question_type: 'multiple choice';
}
