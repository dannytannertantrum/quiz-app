import '@testing-library/jest-dom';

import { render, screen } from 'custom-rtl';
import { AboutPage } from '../../../app/components/organisms/AboutPage';

describe('About Page', () => {
  test('loads and displays an AboutPage organism', () => {
    render(<AboutPage />);

    expect(screen.getByText('About QuizApp')).toBeInTheDocument();
  });
});
