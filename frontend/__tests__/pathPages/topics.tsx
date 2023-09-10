import '@testing-library/jest-dom';

import { render, screen } from 'custom-rtl';
import Topics from '../../app/topics/page';

describe('Topics', () => {
  test('loads and displays the topics page', () => {
    render(<Topics />);

    expect(screen.getByText('Topics!')).toBeInTheDocument();
  });
});
