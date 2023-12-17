import type { Meta, StoryObj } from '@storybook/react';

import { ReviewQuestions } from '../app/components/molecules/ReviewQuestions';
import { quizReviewTestData } from '../test-utils/shared-data';

const meta = {
  title: 'Components/Molecules/ReviewQuestions',
  component: ReviewQuestions,
  args: {
    questions: quizReviewTestData.questions_data,
  },
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <ReviewQuestions questions={quizReviewTestData.questions_data} />
    </div>
  ),
} satisfies Meta<typeof ReviewQuestions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
