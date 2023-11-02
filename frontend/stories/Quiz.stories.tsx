import type { Meta, StoryObj } from '@storybook/react';

import { Quiz } from '../app/components/organisms/Quiz';
import { quizQuestionsTestDataWithFirstIndexAnswered } from '../test-utils/shared-data';

const meta = {
  title: 'Components/Organisms/Quiz',
  component: Quiz,
  args: {
    quizQuestions: quizQuestionsTestDataWithFirstIndexAnswered,
    primaryTopic: 'movies',
  },
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '20px' }}>
      <Quiz primaryTopic='movies' quizQuestions={quizQuestionsTestDataWithFirstIndexAnswered} />
    </div>
  ),
} satisfies Meta<typeof Quiz>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
