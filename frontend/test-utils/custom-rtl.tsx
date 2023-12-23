import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ThemeProvider } from '../app/context/Theme';
import { AuthContext, AuthContextProps } from '../app/context/AuthContext';

export const testAuthProviderProps = {
  createAccount: async () => {},
  deleteAccount: async () => {},
  signIn: async () => {},
  signInTest: async () => {},
  signOut: async () => {},
  userState: {
    isLoading: false,
    data: { id: 'user-id', email: 'user@example.com', created_at: '2023-10-31T13:13:53.346099Z' },
  },
} satisfies AuthContextProps;

// Custom setup provided straight from RTL:
// https://testing-library.com/docs/react-testing-library/setup
const WithThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      {children}
    </ThemeProvider>
  );
};

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <AuthContext.Provider value={testAuthProviderProps}>{children}</AuthContext.Provider>
    </ThemeProvider>
  );
};

/*
  userEvent is preferred over fireEvent - explanation and custom setup docs below
  https://testing-library.com/docs/user-event/intro#differences-from-fireevent
  https://testing-library.com/docs/user-event/intro#writing-tests-with-userevent

  Now we can use it in our tests like:
  const { user } = setup(<MyComponent />)
*/
const renderWithUserEvent = (jsx: ReactElement) => {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: WithThemeProvider, ...options });

const customRenderWithAuth = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRenderWithAuth as renderWithAuth, customRender as render, renderWithUserEvent };
