import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ThemeProvider } from '../app/context/Theme';

// Custom setup provided straight from RTL:
// https://testing-library.com/docs/react-testing-library/setup
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      {children}
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
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render, renderWithUserEvent };
