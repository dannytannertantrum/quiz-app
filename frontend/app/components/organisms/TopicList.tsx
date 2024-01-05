import Link from 'next/link';

import { BaseTopicData } from '../../types/topics';
import { TopicCard, TopicCardProps } from '../molecules/TopicCard';

const colors: TopicCardProps['color'][] = ['cyan', 'emerald', 'yellow'];

export const TopicList = ({ primaryTopics }: { primaryTopics: BaseTopicData[] }) => {
  return (
    <ul className='w-full md:flex md:gap-4 md:w-auto'>
      {primaryTopics.map((topic: BaseTopicData, index: number) => (
        <li className='mb-4 md:basis-full' key={topic.id}>
          <Link className='md:block md:h-full' href={`/topics/${topic.id}`}>
            <TopicCard color={colors[index]} description={topic.description} title={topic.title} />
          </Link>
        </li>
      ))}
    </ul>
  );
};
