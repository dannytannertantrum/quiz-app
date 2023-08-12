import type { Meta, StoryObj } from '@storybook/react';

import { ThemeSwitcher } from '../app/components/atoms/ThemeSwitcher';

const meta = {
  title: 'Components/Atoms/ThemeSwitcher',
  component: ThemeSwitcher,
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const CustomSize: Story = {
  args: {
    size: 150,
  },
};
