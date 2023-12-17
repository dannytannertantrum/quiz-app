import type { Meta, StoryObj } from '@storybook/react';

import { DeleteUserAccount } from '../app/components/molecules/DeleteUserAccount';

const meta = {
  title: 'Components/Molecules/DeleteUserAccount',
  component: DeleteUserAccount,
} satisfies Meta<typeof DeleteUserAccount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
