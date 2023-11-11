import '@testing-library/jest-dom';

import { render, screen } from 'custom-rtl';
import {
  QuizCompleteMessage,
  QuizCompleteMessageProps,
} from '../../../app/components/atoms/QuizCompleteMessage';

describe('QuizCompleteMessage', () => {
  const props: QuizCompleteMessageProps = {
    primaryTopic: 'movies',
    score: 70,
  };

  test('loads and displays a QuizCompleteMessage', () => {
    render(<QuizCompleteMessage {...props} />);

    expect(screen.getByText(/Not bad/)).toBeInTheDocument();
  });

  test('displays a different message for score below 60', () => {
    const lowScore = {
      ...props,
      score: 50,
    };
    render(<QuizCompleteMessage {...lowScore} />);

    expect(screen.getByText(/terrible/)).toBeInTheDocument();
  });

  test('displays a different message for a score above 95', () => {
    const highScore = {
      ...props,
      score: 100,
    };
    render(<QuizCompleteMessage {...highScore} />);

    expect(screen.getByText(/Woo hoo!/)).toBeInTheDocument();
  });
});
