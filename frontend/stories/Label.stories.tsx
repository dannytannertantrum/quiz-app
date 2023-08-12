import type { Meta, StoryObj } from '@storybook/react';

import { Label } from '../app/components/atoms/Label';
import { TextInput } from '../app/components/atoms/TextInput';

const meta = {
  title: 'Components/Atoms/Label',
  component: Label,
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryWithInput: Story = {
  args: {
    forAttribute: 'myInput',
    name: 'Email:',
  },
  render: (args) => (
    <Label {...args}>
      <TextInput name='myInput' id='myInput' handleOnChange={() => {}} />
    </Label>
  ),
};
