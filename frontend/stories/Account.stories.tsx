import type { Meta, StoryObj } from '@storybook/react';

import { Account } from '../app/components/organisms/Account';
import { quizTestData } from '../test-utils/shared-data';

const meta = {
  title: 'Components/Organisms/Account',
  component: Account,
  args: {
    quizzes: [quizTestData, quizTestData, quizTestData, quizTestData],
  },
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '20px' }}>
      <Account {...args} />
    </div>
  ),
} satisfies Meta<typeof Account>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
