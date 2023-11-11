import { AnswerOptions } from './questions';
import { QuizQuestions } from './quizQuestions';

export interface CreateQuizDataRequest {
  // The entry values are uuid strings
  selected_topics: FormDataEntryValue[];
}

export interface CreateQuizDataResponse {
  id: string; // uuid
  quiz_questions: QuizQuestions[];
}

export interface BaseQuizData {
  id: string;
  created_at: string;
  subtopics: string[];
  primary_topic: string;
  user_id: string;
  completed_at?: string;
  last_modified_at?: string;
  score?: number;
}

export interface QuizCompleteData extends BaseQuizData {
  questions_data: {
    answer_options: AnswerOptions[];
    correct_answer: number;
    question: string;
    question_id: string;
    topic: string;
    user_answer: number;
  }[];
}
