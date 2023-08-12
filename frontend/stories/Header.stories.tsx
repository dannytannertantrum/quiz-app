import type { Meta, StoryObj } from '@storybook/react';

import { Header } from '../app/components/molecules/Header';

const meta = {
  title: 'Components/Molecules/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
