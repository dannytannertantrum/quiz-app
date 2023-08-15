import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../app/components/atoms/Button';

const meta = {
  title: 'Components/Atoms/Button',
  component: Button,
  args: {},
  render: (args) => <Button {...args}>Button</Button>,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Secondary: Story = {
  args: { secondary: true },
};
