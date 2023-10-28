import type { Meta, StoryObj } from '@storybook/react';

import { QuizNavButton } from '../app/components/atoms/QuizNavButton';

const meta = {
  title: 'Components/Atoms/QuizNavButton',
  component: QuizNavButton,
  args: {
    children: 'Previous',
    direction: 'previous',
    handleNavClick: () => {},
  },
  render: (args) => <QuizNavButton {...args}>{args.children}</QuizNavButton>,
} satisfies Meta<typeof QuizNavButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Previous: Story = {};

export const Next: Story = {
  args: {
    ...Previous.args,
    direction: 'next',
    children: 'Next',
  },
};
