import '@testing-library/jest-dom';

import { render, screen } from 'custom-rtl';
import { QLink } from '../../../app/components/atoms/QLink';

describe('QLink', () => {
  test('loads and displays a custom QuizApp Link', () => {
    render(<QLink href='/'>Link me</QLink>);

    expect(screen.getByText('Link me')).toBeInTheDocument();
  });
});
