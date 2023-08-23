import type { Meta, StoryObj } from '@storybook/react';

import { QuizLoader } from '../app/components/atoms/QuizLoader';

const meta = {
  title: 'Components/Atoms/QuizLoader',
  component: QuizLoader,
} satisfies Meta<typeof QuizLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const WithStyles: Story = {
  args: {
    styles: {
      fontSize: '36px',
    },
  },
};
