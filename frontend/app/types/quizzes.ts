import { QuizQuestions } from './quizQuestions';

export interface CreateQuizDataRequest {
  // The entry values are uuid strings
  selected_topics: FormDataEntryValue[];
}

export interface CreateQuizDataResponse {
  id: string; // uuid
  quiz_questions: QuizQuestions[];
}
