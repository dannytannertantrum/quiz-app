import '@testing-library/jest-dom';

import { render, screen } from 'test-utils';
import { ThemeSwitcher } from '../app/components/atoms/ThemeSwitcher';

// Official way to mock matchMedia from jest docs
// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

test('loads and displays a theme switcher', () => {
  render(<ThemeSwitcher />);

  expect(screen.getByRole('button', { name: 'toggle light and dark mode' })).toBeInTheDocument();
});
