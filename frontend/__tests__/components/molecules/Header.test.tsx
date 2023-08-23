import '@testing-library/jest-dom';

import { render, screen } from 'custom-rtl';
import { Header } from '../../../app/components/molecules/Header';

describe('Header', () => {
  test('loads and displays a header', () => {
    render(<Header />);

    expect(screen.getByRole('button', { name: 'toggle light and dark mode' })).toBeInTheDocument();
    expect(screen.getByAltText('Home')).toBeInTheDocument();
  });
});
