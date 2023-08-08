import React from 'react';
import type { Preview } from '@storybook/react';

import { ThemeProvider } from '../app/context/Theme';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  decorators: [
    (Story) => (
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
