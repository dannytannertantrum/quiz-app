import type { Meta, StoryObj } from '@storybook/react';

import { QuizReview } from '../app/components/organisms/QuizReview';
import { quizReviewTestData } from '../test-utils/shared-data';

const meta = {
  title: 'Components/Organisms/QuizReview',
  component: QuizReview,
  args: {
    quizCompleteData: quizReviewTestData,
  },
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '20px' }}>
      <QuizReview quizCompleteData={quizReviewTestData} />
    </div>
  ),
} satisfies Meta<typeof QuizReview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
