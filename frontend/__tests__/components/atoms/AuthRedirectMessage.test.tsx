import '@testing-library/jest-dom';

import { render, screen, waitFor } from 'custom-rtl';
import { AuthRedirectMessage } from '../../../app/components/atoms/AuthRedirectMessage';

describe('AuthRedirectMessage', () => {
  test('does not load a message when there is no "redirect" search param', () => {
    render(<AuthRedirectMessage />);

    expect(screen.queryByText(/Please/)).toBeNull();
  });

  test('loads a message when "redirect" is in search params', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        search: '?redirect=topics',
      })),
    });

    render(<AuthRedirectMessage />);

    waitFor(() =>
      expect(screen.queryAllByText('Please sign in to view that page')).toBeInTheDocument()
    );
  });
});
