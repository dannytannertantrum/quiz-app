import type { Meta, StoryObj } from '@storybook/react';

import { TextInput } from '../app/components/atoms/TextInput';

const meta = {
  title: 'Components/Atoms/TextInput',
  component: TextInput,
  args: {
    name: 'my-input',
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
    type: 'number',
  },
};
export const Password: Story = {
  args: {
    ...Primary.args,
    type: 'password',
  },
};
export const Error: Story = {
  args: {
    ...Primary.args,
    errorMessage: "You're doing it wrong",
  },
};
