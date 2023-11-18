import type { Meta, StoryObj } from '@storybook/react';

import { Accordion } from '../app/components/molecules/Accordion';
import { Fragment } from 'react';

const meta = {
  title: 'Components/Molecules/Accordion',
  component: Accordion,
  args: {
    title: 'Cool thing',
    children: 'Accordion contents',
  },
  render: (args) => (
    <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '20px' }}>
      <Accordion {...args}>{args.children}</Accordion>
    </div>
  ),
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const TwoAccordions: Story = {
  render: (args) => (
    <Fragment>
      <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '20px' }}>
        <Accordion {...args}>{args.children}</Accordion>
      </div>
      <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '20px' }}>
        <Accordion {...args}>{args.children}</Accordion>
      </div>
    </Fragment>
  ),
};
