import '@testing-library/jest-dom';

import { render, screen } from 'test-utils';
import { Fieldset } from '../app/components/atoms/Fieldset';
import { TextInput } from '../app/components/atoms/TextInput';

describe('Fieldset', () => {
  test('loads and displays a fieldset', () => {
    render(<Fieldset />);

    expect(screen.getByTestId('test-fieldset')).toBeInTheDocument();
  });

  test('When the fieldset is disabled, all inputs within should not be focusable', () => {
    const labelInputName = 'myInput';
    render(
      <Fieldset disabled>
        <TextInput handleOnChange={() => {}} name={labelInputName} />
      </Fieldset>
    );
    const textInput: HTMLInputElement = screen.getByTestId('text-input');

    expect(textInput).toBeDisabled();
  });
});
