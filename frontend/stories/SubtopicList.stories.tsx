import { Meta, StoryObj } from '@storybook/react';

import { subtopicsTestData } from '../test-utils/shared-data';
import { SubtopicList } from '../app/components/organisms/SubtopicList';

const meta = {
  title: 'Components/Organisms/SubtopicList',
  component: SubtopicList,
  args: {
    subtopics: subtopicsTestData,
  },
  render: (args) => <SubtopicList {...args} />,
} satisfies Meta<typeof SubtopicList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
