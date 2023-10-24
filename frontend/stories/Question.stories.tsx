import type { Meta, StoryObj } from '@storybook/react';

import { Question } from '../app/components/molecules/Question';
import { questionTestData } from '../test-utils/shared-data';

const meta = {
  title: 'Components/Molecules/Question',
  component: Question,
  args: {
    answer_options: questionTestData[0].answer_options,
    id: questionTestData[0].id,
    question: questionTestData[0].question,
    disabled: false,
  },
} satisfies Meta<typeof Question>;

export default meta;
type Story = StoryObj<typeof meta>;

const copy = structuredClone(questionTestData[0].answer_options);
copy[3].option_4 =
  'And he said, "Do ya love me?" And she said, "No! But that\'s a real nice SKI mask!"';

export const Primary: Story = {};

export const FieldsetDisabled: Story = {
  args: {
    ...Primary.args,
    disabled: true,
  },
};

export const WithLongAnswer: Story = {
  args: {
    ...Primary.args,
    answer_options: copy,
  },
};
