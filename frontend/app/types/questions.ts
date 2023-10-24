export interface AnswerOptions {
  id: number;
  [key: string]: string | number;
}

export interface BaseQuestionData {
  id: string; // uuid
  answer_options: AnswerOptions[];
  question: string;
  question_type: 'multiple choice';
  topic_id: string; // uuid
}
