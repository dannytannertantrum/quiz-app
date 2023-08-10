import '@testing-library/jest-dom';

import { render, screen } from 'test-utils';
import { Header } from '../app/components/molecules/Header';

test('loads and displays a header', () => {
  render(<Header />);

  expect(screen.getByRole('button', { name: 'toggle light and dark mode' })).toBeInTheDocument();
  expect(screen.getByAltText('Home')).toBeInTheDocument();
});
