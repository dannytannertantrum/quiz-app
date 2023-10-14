import { cookies } from 'next/headers';
import type { Metadata } from 'next';

import { BASE_SERVER_URL, RESPONSE_ERROR } from '../../utils/constants';
import { BaseTopicData } from '../../types/topics';
import { SubtopicList } from '../../components/organisms/SubtopicList';

export const metadata: Metadata = {
  title: 'Subtopics | Quiz App',
  description: 'Select your subtopics',
};

export async function getSubTopics(id: string) {
  const response = await fetch(`${BASE_SERVER_URL}/topics/primary-topics/${id}`, {
    headers: { Cookie: cookies().toString() },
  });
  if (response.status === 404) return [];
  if (!response.ok) {
    throw new Error(RESPONSE_ERROR);
  }
  const subTopics: BaseTopicData[] = await response.json();

  return subTopics;
}

export default async function SubTopics({ params }: { params: { id: string } }) {
  let subTopics: BaseTopicData[] = [];
  try {
    subTopics = await getSubTopics(params.id);
  } catch (error: any) {
    console.error('There was a problem getting the subtopics: ', error);
  }

  if (subTopics.length === 0) return <h2 className='text-3xl'>No subtopics found</h2>;

  return (
    <>
      <h2 className='text-3xl'>Select subtopics</h2>
      <SubtopicList subtopics={subTopics} />
    </>
  );
}
