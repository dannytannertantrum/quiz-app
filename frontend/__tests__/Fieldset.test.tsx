import '@testing-library/jest-dom';

import { render, screen } from 'custom-rtl';
import { Fieldset } from '../app/components/atoms/Fieldset';
import { TextInput } from '../app/components/molecules/TextInput';

describe('Fieldset', () => {
  test('loads and displays a fieldset', () => {
    render(<Fieldset />);

    expect(screen.getByTestId('test-fieldset')).toBeInTheDocument();
  });

  test('When the fieldset is disabled, all inputs within should not be focusable', () => {
    render(
      <Fieldset disabled>
        <TextInput
          handleOnBlur={() => {}}
          handleOnChange={() => {}}
          id='Email'
          label='email'
          name='email'
          placeholder='email'
        />
      </Fieldset>
    );
    const textInput: HTMLInputElement = screen.getByTestId('text-input');

    expect(textInput).toBeDisabled();
  });
});
