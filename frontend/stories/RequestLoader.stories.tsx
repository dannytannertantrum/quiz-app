import type { Meta, StoryObj } from '@storybook/react';

import { RequestLoader } from '../app/components/atoms/RequestLoader';

const meta = {
  title: 'Components/Atoms/RequestLoader',
  component: RequestLoader,
  args: {},
} satisfies Meta<typeof RequestLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
