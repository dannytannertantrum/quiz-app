import type { Meta, StoryObj } from '@storybook/react';

import { QLink } from '../app/components/atoms/QLink';

const meta = {
  title: 'Components/Atoms/QLink',
  component: QLink,
  args: {
    href: '/',
  },
  render: (args) => <QLink {...args}>Link me</QLink>,
} satisfies Meta<typeof QLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
