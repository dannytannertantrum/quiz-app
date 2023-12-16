import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from '../app/components/atoms/Checkbox';

const meta = {
  title: 'Components/Atoms/Checkbox',
  component: Checkbox,
  args: {
    id: 'drama',
    name: 'Drama',
    value: 'fake-uuid',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
