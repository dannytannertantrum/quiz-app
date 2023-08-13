import type { Meta, StoryObj } from '@storybook/react';

import { TextInput } from '../app/components/molecules/TextInput';

const meta = {
  title: 'Components/Molecules/TextInput',
  component: TextInput,
  args: {
    id: 'email',
    label: 'Email Address',
    name: 'email',
    placeholder: 'Email Address',
  },
  argTypes: {
    handleOnChange: { action: 'changed' },
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Disabled: Story = {
  args: {
    ...Primary.args,
    disabled: true,
    value: "Can't touch this",
  },
};
export const AutoFocused: Story = {
  args: {
    ...Primary.args,
    autofocus: true,
  },
};
export const Number: Story = {
  args: {
    ...Primary.args,
    label: 'Enter a number',
    type: 'number',
  },
};
export const Password: Story = {
  args: {
    ...Primary.args,
    label: 'password',
    type: 'password',
  },
};
export const Error: Story = {
  args: {
    ...Primary.args,
    errorMessage: "You're doing it wrong",
  },
};
