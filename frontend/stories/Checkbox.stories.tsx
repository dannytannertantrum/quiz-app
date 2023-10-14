import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from '../app/components/molecules/Checkbox';

const meta = {
  title: 'Components/Molecules/Checkbox',
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
