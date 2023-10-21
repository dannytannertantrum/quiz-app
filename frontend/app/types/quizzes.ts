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
  created_at: Date;
  subtopics: string[];
  primary_topic: string;
  user_id: string;
  completed_at?: Date;
  last_modified_at?: Date;
  score?: number;
}
