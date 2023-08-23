import '@testing-library/jest-dom';

import { render, screen } from 'custom-rtl';
import { QuizLoader } from '../../../app/components/atoms/QuizLoader';

describe('QuizLoader', () => {
  test('loads and displays an animated loading graphic', () => {
    render(<QuizLoader />);

    expect(screen.getByText('?')).toBeInTheDocument();
  });
});
