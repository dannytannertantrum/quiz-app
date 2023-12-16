import '@testing-library/jest-dom';

import { render, screen } from 'custom-rtl';
import { RadioButton } from '../../../app/components/atoms/RadioButton';

describe('RadioButton', () => {
  test('loads and displays an input radio button', () => {
    render(
      <RadioButton id='myId' label='text to display to user' name='radioGroup' value='myValue' />
    );

    expect(screen.getByText('text to display to user')).toBeInTheDocument();
  });
});
