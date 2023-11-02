import { BaseQuestionData } from '../app/types/questions';
import { BaseQuizData } from '../app/types/quizzes';
import { BaseTopicData } from '../app/types/topics';
import { QuizQuestionsAllData } from '../app/types/quizQuestions';

export const primaryTopicsTestData: BaseTopicData[] = [
  {
    id: '1',
    description: 'This is a long topic title so we can see different lengths between the cards',
    title: 'Movies',
  },
  { id: '2', description: 'Cards should be equal width and height', title: 'Sportsball' },
  { id: '3', description: 'When next to each other', title: 'Music' },
];

export const subtopicsTestData: BaseTopicData[] = [
  { id: '4', description: '', title: 'comedy' },
  { id: '5', description: '', title: 'drama' },
  { id: '6', description: '', title: 'horror' },
  { id: '7', description: '', title: 'sci-fi' },
];

export const questionTestData: BaseQuestionData[] = [
  {
    id: 'fake-uuid',
    answer_options: [
      { id: 1, option_1: 'Lloyd Christmas' },
      { id: 2, option_2: 'Harry Dunne' },
      { id: 3, option_3: 'The Gas Man' },
      { id: 4, option_4: 'Sea Bass' },
    ],
    question: 'Who does Jim Carrey play in "Dumb and Dumber"?',
    question_type: 'multiple choice',
    topic_id: 'another-fake-uuid',
  },
];

export const quizQuestionsTestDataAllNullAnswers: QuizQuestionsAllData[] = [
  {
    id: 'quizQuestion-uuid',
    answer_options: questionTestData[0].answer_options,
    question: questionTestData[0].question,
    question_type: 'multiple choice',
    question_id: 'question-uuid',
    quiz_id: 'quiz-uuid',
    user_answer: null,
    topic: 'comedy',
  },
  {
    id: 'quizQuestion2-uuid',
    answer_options: [
      { id: 1, option_1: 'Billy' },
      { id: 2, option_2: 'Henry' },
      { id: 3, option_3: 'Barry' },
      { id: 4, option_4: 'Frank' },
    ],
    question: 'What is the name of the bunny rabbit in "Donnie Darko"?',
    question_type: 'multiple choice',
    question_id: 'question2-uuid',
    quiz_id: 'quiz-uuid',
    user_answer: null,
    topic: 'drama',
  },
];

export const quizQuestionsTestDataWithFirstIndexAnswered: QuizQuestionsAllData[] = [
  {
    id: 'quizQuestion3-uuid',
    answer_options: [
      { id: 1, option_1: 'Harry Dunne' },
      { id: 2, option_2: 'Lloyd Christmas' },
      { id: 3, option_3: 'The Gas Man' },
      { id: 4, option_4: 'Mary Swanson' },
    ],
    question: 'Who talks about wearing a "real nice ski mask"?',
    question_type: 'multiple choice',
    question_id: 'question2-uuid',
    quiz_id: 'quiz-uuid',
    user_answer: 2,
    topic: 'comedy',
  },
  ...quizQuestionsTestDataAllNullAnswers,
];

export const quizTestData: BaseQuizData = {
  id: 'quiz-uuid',
  created_at: '2023-10-27T14:25:36.514294Z',
  subtopics: ['comedy', 'drama'],
  primary_topic: 'movies',
  user_id: 'user-uuid',
};
