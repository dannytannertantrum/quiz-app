import '@testing-library/jest-dom';

import { render, screen, waitFor } from 'custom-rtl';
import { WelcomeMessage } from '../../../app/components/atoms/WelcomeMessage';

describe('WelcomeMessage', () => {
  test('does not load a message when there is no "welcome" search param', () => {
    render(<WelcomeMessage />);

    expect(screen.queryByText(/Welcome/)).toBeNull();
  });

  test('loads a welcome message when "welcome" is in search params', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        search: '?welcome=true',
      })),
    });

    render(<WelcomeMessage />);

    waitFor(() => expect(screen.queryAllByText('Welcome to QuizApp!')).toBeInTheDocument());
  });
});
