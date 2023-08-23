import '@testing-library/jest-dom';

import { render, screen } from 'custom-rtl';
import { ThemeSwitcher } from '../../../app/components/atoms/ThemeSwitcher';

describe('ThemeSwitcher', () => {
  test('loads and displays a theme switcher', () => {
    render(<ThemeSwitcher />);

    expect(screen.getByRole('button', { name: 'toggle light and dark mode' })).toBeInTheDocument();
  });
});
