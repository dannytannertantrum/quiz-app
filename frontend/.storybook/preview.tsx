import React from 'react';
import type { Decorator, Preview } from '@storybook/react';

import { ThemeProvider } from '../app/context/Theme';
import '../app/globals.css';

// Storybook docs: https://storybook.js.org/blog/how-to-add-a-theme-switcher-to-storybook/
export const withTheme: Decorator = (Story, context) => {
  // Get values from story parameter first, else fallback to globals
  const theme = context.parameters.theme || context.globals.theme;
  const storyTheme = theme === 'dark' ? 'dark' : 'light';

  if (
    context.component?.displayName === 'Header' ||
    context.component?.displayName === 'ThemeSwitcher'
  ) {
    return (
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <Story />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute='class' forcedTheme={storyTheme}>
      <Story />
    </ThemeProvider>
  );
};

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

  decorators: [withTheme],
};

// Add the theme switch for light and dark modes in the toolbar
export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'dark',
    toolbar: {
      // The icon for the toolbar item
      icon: 'circlehollow',
      // Array of options
      items: [
        { value: 'light', icon: 'circlehollow', title: 'light' },
        { value: 'dark', icon: 'circle', title: 'dark' },
      ],
      // Property that specifies if the name of the item will be displayed
      showName: true,
    },
  },
};

export default preview;
