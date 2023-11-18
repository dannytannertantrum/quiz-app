import '@testing-library/jest-dom';

import { render, screen } from 'custom-rtl';
import { Accordion } from '../../../app/components/molecules/Accordion';

describe('Accordion', () => {
  test('loads and displays an Accordion', () => {
    render(<Accordion title='User info'>Hello!</Accordion>);

    expect(screen.getByText('User info')).toBeInTheDocument();
    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });
});
