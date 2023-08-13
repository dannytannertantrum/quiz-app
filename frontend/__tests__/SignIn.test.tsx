import '@testing-library/jest-dom';

import { render, screen } from 'test-utils';
import { SignIn } from '../app/components/SignIn';

describe('SignIn', () => {
  test('loads and displays the SignIn component', () => {
    render(<SignIn />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Email address')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
  });
});
