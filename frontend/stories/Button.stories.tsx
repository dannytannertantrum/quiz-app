import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../app/components/atoms/Button';

const meta = {
  title: 'Components/Atoms/Button',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: (args) => <Button {...args}>Button</Button>,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <Button {...args}>Button</Button>,
};
