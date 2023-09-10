import type { Meta, StoryObj } from '@storybook/react';

import Topics from '../app/topics/page';

const meta = {
  title: 'PathPages/Topics',
  component: Topics,
} satisfies Meta<typeof Topics>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
