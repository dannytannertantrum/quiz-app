import type { Meta, StoryObj } from '@storybook/react';

import { QuizCompleteMessage } from '../app/components/atoms/QuizCompleteMessage';

const meta = {
  title: 'Components/Atoms/QuizCompleteMessage',
  component: QuizCompleteMessage,
  args: {
    primaryTopic: 'sportsball',
    score: 60,
  },
} satisfies Meta<typeof QuizCompleteMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LowScore: Story = {};

export const MediumScore: Story = {
  args: {
    ...LowScore.args,
    score: 80,
  },
};

export const GreatScore: Story = {
  args: {
    ...LowScore.args,
    score: 100,
  },
};
