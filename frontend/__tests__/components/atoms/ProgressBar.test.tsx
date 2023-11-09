import '@testing-library/jest-dom';

import { render, screen } from 'custom-rtl';
import { ProgressBar } from '../../../app/components/atoms/ProgressBar';

describe('ProgressBar', () => {
  const max = 5;
  const value = 2;

  test('loads and displays a ProgressBar', () => {
    render(<ProgressBar max={max} value={value} />);

    expect(screen.getByText(value)).toBeInTheDocument();
  });
});
