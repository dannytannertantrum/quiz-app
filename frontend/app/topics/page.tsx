import { cookies } from 'next/headers';
import Link from 'next/link';
import type { Metadata } from 'next';

import { BASE_SERVER_URL, RESPONSE_ERROR } from '../utils/constants';
import { WelcomeMessage } from '../components/atoms/WelcomeMessage';
import { BaseTopicData } from '../types/topics';

export const metadata: Metadata = {
  title: 'Topics | Quiz App',
  description: 'Select a topic!',
};

const getTopics = async () => {
  const response = await fetch(`${BASE_SERVER_URL}/topics/primary-topics`, {
    headers: { Cookie: cookies().toString() },
  });
  if (response.status === 404) return [];
  if (!response.ok) {
    throw new Error(RESPONSE_ERROR);
  }

  return await response.json();
};

export default async function Topics() {
  let primaryTopics: BaseTopicData[] = [];
  try {
    primaryTopics = await getTopics();
  } catch (error: any) {
    console.error('There was a problem getting primary topics: ', error);
  }

  if (primaryTopics.length === 0) return <h2 className='text-3xl'>No topics found</h2>;

  return (
    <>
      <WelcomeMessage />
      <h2 className='text-3xl'>Select a topic</h2>
      <ul>
        {primaryTopics.map((topic) => (
          <li key={topic.id}>
            <Link href={`/topics/${topic.id}`}>{topic.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
