import { Meta, StoryObj } from '@storybook/react';

import { TopicCard } from '../app/components/molecules/TopicCard';

const meta = {
  title: 'Components/Molecules/TopicCard',
  component: TopicCard,
  args: {
    description: 'This is a topic card description',
    title: 'Movies',
  },
  render: (args) => <TopicCard {...args} />,
} satisfies Meta<typeof TopicCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryCyan: Story = {};

export const Emerald: Story = {
  args: {
    ...PrimaryCyan.args,
    color: 'emerald',
  },
};

export const Yellow: Story = {
  args: {
    ...PrimaryCyan.args,
    color: 'yellow',
  },
};
