import '@testing-library/jest-dom';

import { render, renderWithUserEvent, screen } from 'custom-rtl';
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

  test('error message displays when user tries to submit the form without info', async () => {
    const { user } = renderWithUserEvent(<AuthForm />);
    const submitButton = screen.getByText('Submit');

    await user.click(submitButton);

    expect(screen.getByText(/Please enter a valid email/)).toBeInTheDocument();
    expect(screen.getByText('Password cannot be blank')).toBeInTheDocument();
  });

  test('toggle sign in resets the state for an input and gives the email input focus', async () => {
    const { user } = renderWithUserEvent(<AuthForm />);
    const emailInput = screen.getByLabelText('Email address');
    const submitButton = screen.getByText('Submit');
    const toggleSignInButton = screen.getByText('Create a new account');
    const userInputText = 'hello';

    await user.type(emailInput, userInputText);
    await user.click(submitButton);

    expect(screen.getByText(/Please enter a valid email/)).toBeInTheDocument();

    await user.click(toggleSignInButton);

    expect(emailInput).toHaveDisplayValue('');
    expect(emailInput).toHaveFocus();
  });
});
