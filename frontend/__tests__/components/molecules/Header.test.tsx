import React, { ReactNode } from 'react';
import '@testing-library/jest-dom';

import { render, renderWithAuth, screen } from 'custom-rtl';
import { Header } from '../../../app/components/molecules/Header';

describe('Header', () => {
  describe('Signed out', () => {
    test('loads and displays a header', () => {
      render(<Header />);

      expect(
        screen.getByRole('button', { name: 'toggle light and dark mode' })
      ).toBeInTheDocument();
      expect(screen.getByAltText('Home')).toBeInTheDocument();
    });

    test('the logo link goes to "/"', () => {
      render(<Header />);
      const logoLink: HTMLAnchorElement | null = document.querySelector('nav a');

      expect(logoLink?.pathname).toBe('/');
    });
  });

  describe('signed in', () => {
    test('the logo link goes to "/topics"', () => {
      renderWithAuth(<Header />);
      const logoLink: HTMLAnchorElement | null = document.querySelector('nav a');

      expect(logoLink?.pathname).toBe('/topics');
    });
  });
});
