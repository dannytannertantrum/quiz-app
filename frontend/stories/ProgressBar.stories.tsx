import { Meta, StoryObj } from '@storybook/react';

import { ProgressBar } from '../app/components/atoms/ProgressBar';

const meta = {
  title: 'Components/Atoms/ProgressBar',
  component: ProgressBar,
  args: {
    max: 5,
    value: 3,
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
