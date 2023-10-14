import '@testing-library/jest-dom';

import { render, screen } from 'custom-rtl';
import { Checkbox } from '../../../app/components/molecules/Checkbox';

describe('Checkbox', () => {
  test('loads and displays an input checkbox', () => {
    render(<Checkbox id='drama' name='Drama' />);

    expect(screen.getByText('Drama')).toBeInTheDocument();
  });
});
