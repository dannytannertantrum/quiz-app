import '@testing-library/jest-dom';

import { render, screen } from 'custom-rtl';
import { QuizNavButton } from '../../../app/components/atoms/QuizNavButton';

describe('QuizNavButton', () => {
  test('loads and displays a QuizNavButton', () => {
    render(
      <QuizNavButton direction='previous' handleNavClick={() => {}}>
        Previous
      </QuizNavButton>
    );

    expect(screen.getByText('Previous')).toBeInTheDocument();
  });
});
