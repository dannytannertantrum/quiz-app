import type { Meta, StoryObj } from '@storybook/react';

import { Fieldset } from '../app/components/atoms/Fieldset';
import { Label } from '../app/components/atoms/Label';
import { TextInput } from '../app/components/atoms/TextInput';

const meta = {
  title: 'Components/Atoms/Fieldset',
  component: Fieldset,
} satisfies Meta<typeof Fieldset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryWithLabelsAndInputs: Story = {
  args: {},
  render: (args) => (
    <Fieldset {...args}>
      <Label forAttribute='myInput' name='user'>
        <TextInput name='myInput' id='myInput' handleOnChange={() => {}} />
      </Label>
    </Fieldset>
  ),
};

export const Disabled: Story = {
  args: {},
  render: (args) => (
    <Fieldset {...args} disabled>
      <Label forAttribute='myInput' name='user'>
        <TextInput
          name='myInput'
          id='myInput'
          handleOnChange={() => {}}
          errorMessage='Here is an error to see what it looks like'
        />
      </Label>
      <Label forAttribute='another' name='pass'>
        <TextInput name='another' id='another' handleOnChange={() => {}} type='password' />
      </Label>
    </Fieldset>
  ),
};
