import type { Meta, StoryObj } from '@storybook/react';

import { AuthForm } from '../app/components/organisms/AuthForm';

const meta = {
  title: 'Components/Organisms/AuthForm',
  component: AuthForm,
  args: {
    userEmails: [],
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '20px' }}>
      <AuthForm userEmails={[]} />
    </div>
  ),
} satisfies Meta<typeof AuthForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
