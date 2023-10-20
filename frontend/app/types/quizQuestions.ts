export interface QuizQuestions {
  // all strings are UUIDs
  id: string;
  question_id: string;
  quiz_id: string;
  user_answer: number;
}
