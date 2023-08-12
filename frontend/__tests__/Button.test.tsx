import '@testing-library/jest-dom';

import { render, screen } from 'test-utils';
import { Button } from '../app/components/atoms/Button';

describe('Button', () => {
  test('loads and displays a button', () => {
    render(<Button>Click me!</Button>);

    expect(screen.getByText(/Click/)).toBeInTheDocument();
  });
});
