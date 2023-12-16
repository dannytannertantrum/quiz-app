import type { Meta, StoryObj } from '@storybook/react';

import { RadioButton } from '../app/components/atoms/RadioButton';

const meta = {
  title: 'Components/Atoms/RadioButton',
  component: RadioButton,
  args: {
    id: 'myId',
    label: 'This is my radio button label',
    name: 'radioGroup',
    value: 'myValue',
  },
} satisfies Meta<typeof RadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
