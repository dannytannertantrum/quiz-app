import { Meta, StoryObj } from '@storybook/react';

import { AuthRedirectMessage } from '../app/components/atoms/AuthRedirectMessage';

const meta = {
  title: 'Components/Atoms/AuthRedirectMessage',
  component: AuthRedirectMessage,
} satisfies Meta<typeof AuthRedirectMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
