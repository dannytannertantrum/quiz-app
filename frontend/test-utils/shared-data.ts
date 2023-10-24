import { BaseQuestionData } from '@/types/questions';
import { BaseTopicData } from '../app/types/topics';

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
