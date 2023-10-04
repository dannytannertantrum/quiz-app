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
