import '@testing-library/jest-dom';

import { render, renderWithUserEvent, screen } from 'test-utils';
import { AuthForm } from '../app/components/organisms/AuthForm';

describe('AuthForm', () => {
  test('loads and displays the AuthForm component', () => {
    render(<AuthForm />);

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Email address')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  test('displays create account text when secondary button is clicked', async () => {
    const { user } = renderWithUserEvent(<AuthForm />);
    const secondaryButton = screen.getByText('Create a new account');

    expect(screen.queryByText('Create account')).toBeNull();

    await user.click(secondaryButton);

    expect(screen.getByText('Create account')).toBeInTheDocument();
  });
});
