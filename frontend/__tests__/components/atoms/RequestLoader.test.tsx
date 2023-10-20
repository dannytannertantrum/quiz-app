import '@testing-library/jest-dom';

import { render, screen } from 'custom-rtl';
import { RequestLoader } from '../../../app/components/atoms/RequestLoader';

describe('RequestLoader', () => {
  test('loads and displays a RequestLoader', () => {
    render(<RequestLoader />);

    expect(screen.getByText('?')).toBeInTheDocument();
  });
});
