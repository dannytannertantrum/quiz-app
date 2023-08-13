import type { Meta, StoryObj } from '@storybook/react';

import { Fieldset } from '../app/components/atoms/Fieldset';
import { TextInput } from '../app/components/molecules/TextInput';

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
      <TextInput
        handleOnBlur={() => {}}
        handleOnChange={() => {}}
        id='email'
        label='Email address'
        name='email'
        placeholder='email'
      />
    </Fieldset>
  ),
};

export const Disabled: Story = {
  args: {},
  render: (args) => (
    <Fieldset {...args} disabled>
      <TextInput
        errorMessage='Here is an error to see what it looks like'
        handleOnBlur={() => {}}
        handleOnChange={() => {}}
        id='email'
        label='Email'
        name='username'
        placeholder='email'
      />
      <TextInput
        handleOnBlur={() => {}}
        handleOnChange={() => {}}
        id='another'
        label='Another'
        name='another'
        placeholder='email'
        type='password'
      />
    </Fieldset>
  ),
};
