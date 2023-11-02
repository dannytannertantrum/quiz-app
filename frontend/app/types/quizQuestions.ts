import { AnswerOptions } from './questions';

export interface QuizQuestionsPutRequest {
  id: string; // quizQuestion uuid
  user_answer: number; // 1-4
}

export interface QuizQuestions {
  // all strings are UUIDs
  id: string;
  question_id: string;
  quiz_id: string;
  user_answer: number | null;
}

export interface QuizQuestionsAllData extends QuizQuestions {
  question: string;
  answer_options: AnswerOptions[];
  question_type: 'multiple choice';
  topic: string;
}
