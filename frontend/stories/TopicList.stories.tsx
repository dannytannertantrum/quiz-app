import { Meta, StoryObj } from '@storybook/react';

import { primaryTopicsTestData } from '../test-utils/shared-data';
import { TopicList } from '../app/components/organisms/TopicList';

const meta = {
  title: 'Components/Organisms/TopicList',
  component: TopicList,
  args: {
    primaryTopics: primaryTopicsTestData,
  },
  render: (args) => <TopicList {...args} />,
} satisfies Meta<typeof TopicList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
