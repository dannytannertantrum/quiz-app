import type { Meta, StoryObj } from '@storybook/react';

import { SignIn } from '../app/components/SignIn';

const meta = {
  title: 'Components/SignIn',
  component: SignIn,
} satisfies Meta<typeof SignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
