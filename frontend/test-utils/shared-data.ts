import { BaseQuestionData } from '../app/types/questions';
import { BaseQuizData, QuizCompleteData } from '../app/types/quizzes';
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

export const quizReviewTestData: QuizCompleteData = {
  id: '3c99c4f7-21fe-4e0b-960e-cf178de94e21',
  completed_at: '2023-11-09T01:36:01.707588Z',
  created_at: '2023-11-09T00:06:05.198321Z',
  last_modified_at: '2023-11-09T01:36:01.707585Z',
  score: 40,
  subtopics: ['baseball', 'basketball', 'football'],
  primary_topic: 'sportsball',
  user_id: '813940d3-735f-4556-a300-eaadb9104059',
  questions_data: [
    {
      answer_options: [
        {
          id: 1,
          option_1: 'Los Angeles Dodgers',
        },
        {
          id: 2,
          option_2: 'Boston Red Sox',
        },
        {
          id: 3,
          option_3: 'Chicago Cubs',
        },
        {
          id: 4,
          option_4: 'New York Yankees',
        },
      ],
      correct_answer: 3,
      question: 'Which team won the World Series in 2016 after a 108-year drought?',
      question_id: '25b32bc9-a94c-4a4b-9b45-7d629f75a8d1',
      topic: 'baseball',
      user_answer: 2,
    },
    {
      answer_options: [
        {
          id: 1,
          option_1: 'Brett Favre',
        },
        {
          id: 2,
          option_2: 'LeRoy Butler',
        },
        {
          id: 3,
          option_3: 'Jerry Rice',
        },
        {
          id: 4,
          option_4: 'Peyton Manning',
        },
      ],
      correct_answer: 2,
      question: 'Which football player is known for his "Lambeau Leap"?',
      question_id: '51c521f6-b22e-4c99-965d-484bdf66a71d',
      topic: 'football',
      user_answer: 1,
    },
    {
      answer_options: [
        {
          id: 1,
          option_1: 'New England Patriots',
        },
        {
          id: 2,
          option_2: 'San Francisco 49ers',
        },
        {
          id: 3,
          option_3: 'Dallas Cowboys',
        },
        {
          id: 4,
          option_4: 'Green Bay Packers',
        },
      ],
      correct_answer: 3,
      question: 'Which NFL team is known as "America\'s Team"?',
      question_id: '36a743c3-8a89-4287-ba5f-af4b380ea813',
      topic: 'football',
      user_answer: 3,
    },
    {
      answer_options: [
        {
          id: 1,
          option_1: 'New York Giants',
        },
        {
          id: 2,
          option_2: 'Pittsburgh Steelers',
        },
        {
          id: 3,
          option_3: 'Chicago Bears',
        },
        {
          id: 4,
          option_4: 'Kansas City Chiefs',
        },
      ],
      correct_answer: 3,
      question: 'Which NFL team plays its home games at Soldier Field?',
      question_id: '6a2aef4d-0971-44b6-b7a3-664a6669f800',
      topic: 'football',
      user_answer: 3,
    },
    {
      answer_options: [
        {
          id: 1,
          option_1: 'LeBron James',
        },
        {
          id: 2,
          option_2: 'Kareem Abdul-Jabbar',
        },
        {
          id: 3,
          option_3: 'Wilt Chamberlain',
        },
        {
          id: 4,
          option_4: 'Michael Jordan',
        },
      ],
      correct_answer: 4,
      question: 'Who holds the NBA record for the highest career points per game average?',
      question_id: '3e5eef8a-38ca-4382-995e-90c24d3e2380',
      topic: 'basketball',
      user_answer: 1,
    },
  ],
};
