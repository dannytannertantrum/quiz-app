import React, { ReactNode } from 'react';
import '@testing-library/jest-dom';

import { AuthContext, AuthContextProps } from '../../../app/context/AuthContext';
import { render, screen } from 'custom-rtl';
import { Header } from '../../../app/components/molecules/Header';

const authProviderProps = {
  createAccount: async () => {},
  signIn: async () => {},
  userState: { isLoading: false, data: { id: 'user-id', email: 'fake@user.com' } },
} satisfies AuthContextProps;

// https://testing-library.com/docs/example-react-context/
const renderWithAuth = (ui: ReactNode) => {
  return render(<AuthContext.Provider value={authProviderProps}>{ui}</AuthContext.Provider>);
};

describe('Header', () => {
  test('loads and displays a header', () => {
    render(<Header />);

    expect(screen.getByRole('button', { name: 'toggle light and dark mode' })).toBeInTheDocument();
    expect(screen.getByAltText('Home')).toBeInTheDocument();
  });

  test('when signed out, the logo link goes to "/"', () => {
    render(<Header />);
    const logoLink: HTMLAnchorElement | null = document.querySelector('nav a');

    expect(logoLink?.pathname).toBe('/');
  });

  test('when signed in, the logo link goes to "/topics"', () => {
    renderWithAuth(<Header />);
    const logoLink: HTMLAnchorElement | null = document.querySelector('nav a');

    expect(logoLink?.pathname).toBe('/topics');
  });
});
