import '@testing-library/jest-dom';

import { render, renderWithUserEvent, screen, waitFor } from 'custom-rtl';
import { DeleteUserAccount } from '../../../app/components/molecules/DeleteUserAccount';

describe('DeleteUserAccount', () => {
  // workaround until dialog elements are supported in jest/jsdom
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });

  test('loads and displays a DeleteUserAccount component with no modal showing yet', () => {
    render(<DeleteUserAccount />);

    expect(screen.getByText('Delete account')).toBeInTheDocument();
    expect(screen.queryByText('Please select account removal method')).not.toBeVisible();
  });

  test('modal opens after clicking delete account', async () => {
    const { user } = renderWithUserEvent(<DeleteUserAccount />);
    const deleteAccountButton: HTMLButtonElement = screen.getByText('Delete account');

    expect(screen.queryByText('Please select account removal method')).not.toBeVisible();

    await user.click(deleteAccountButton);

    waitFor(() => expect(screen.getByText('Please select account removal method')).toBeVisible());
  });

  test('focus moves to first radio button after modal opens', async () => {
    const { user } = renderWithUserEvent(<DeleteUserAccount />);
    const deleteAccountButton: HTMLButtonElement = screen.getByText('Delete account');
    const firstRadioButton = screen.queryAllByTestId('radioInput')[0];

    await user.click(deleteAccountButton);

    waitFor(() => expect(firstRadioButton).toHaveFocus());
  });

  test('focus moves back to delete account button after modal close', async () => {
    const { user } = renderWithUserEvent(<DeleteUserAccount />);
    const cancelButton: HTMLButtonElement = screen.getByText('Cancel');
    const deleteAccountButton: HTMLButtonElement = screen.getByText('Delete account');

    await user.click(deleteAccountButton);
    await user.click(cancelButton);

    waitFor(() => expect(deleteAccountButton).toHaveFocus());
  });

  test('error message displays if user tries to submit the form without selection', async () => {
    const { user } = renderWithUserEvent(<DeleteUserAccount />);
    const deleteAccountButton: HTMLButtonElement = screen.getByText('Delete account');
    const submitButton: HTMLButtonElement = screen.getByText('Submit');

    await user.click(deleteAccountButton);
    await user.click(submitButton);

    waitFor(() => expect(screen.queryByText('Please make a selection')).toBeInTheDocument());
  });

  test('form successfully submits after a selection is made', async () => {
    const { user } = renderWithUserEvent(<DeleteUserAccount />);
    const firstRadioButton = screen.queryAllByTestId('radioInput')[0];
    const submitButton: HTMLButtonElement = screen.getByText('Submit');

    expect(screen.getByText('Delete account')).toBeInTheDocument();

    await user.click(firstRadioButton);
    await user.click(submitButton);

    // This means the page navigated away
    waitFor(() => expect(screen.queryByText('Delete account')).not.toBeInTheDocument());
  });
});
